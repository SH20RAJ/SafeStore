#!/usr/bin/env node

// file-encryption-cli.js

const fs = require('fs');
const readline = require('readline');

// Custom color utility
const colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    colorize: (text, color) => `${colors[color]}${text}${colors.reset}`,
    bold_cyan: (text) => `${colors.bold}${colors.cyan}${text}${colors.reset}`
};

// Custom spinner utility
class Spinner {
    constructor(text) {
        this.text = text;
        this.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        this.interval = null;
        this.currentFrame = 0;
    }

    start() {
        process.stdout.write('\x1b[?25l'); // Hide cursor
        this.interval = setInterval(() => {
            process.stdout.write('\r' + this.frames[this.currentFrame] + ' ' + this.text);
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        }, 80);
        return this;
    }

    stop(text) {
        clearInterval(this.interval);
        process.stdout.write('\r' + ' '.repeat(this.text.length + 2));
        process.stdout.write('\r' + text);
        process.stdout.write('\x1b[?25h'); // Show cursor
        console.log();
    }

    succeed(text) {
        this.stop('✓ ' + text);
    }

    fail(text) {
        this.stop('✗ ' + text);
    }
}

function generateKey(password, salt) {
    const key = Buffer.alloc(32);
    const passwordBuffer = Buffer.from(password);
    
    // Simple key derivation using password and salt
    for (let i = 0; i < key.length; i++) {
        key[i] = passwordBuffer[i % passwordBuffer.length] ^ salt[i % salt.length];
    }
    
    return key;
}

function xorEncrypt(data, key) {
    const result = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
        result[i] = data[i] ^ key[i % key.length];
    }
    return result;
}

function encryptFile(inputPath, outputPath, password) {
    const spinner = new Spinner('Encrypting file...').start();
    try {
        // Generate salt and IV
        const salt = Buffer.alloc(16);
        const iv = Buffer.alloc(16);
        
        // Fill salt and IV with random bytes
        for (let i = 0; i < 16; i++) {
            salt[i] = Math.floor(Math.random() * 256);
            iv[i] = Math.floor(Math.random() * 256);
        }
        
        // Generate key from password and salt
        const key = generateKey(password, salt);
        
        // Read and encrypt the file
        const input = fs.readFileSync(inputPath);
        const encrypted = xorEncrypt(input, Buffer.concat([key, iv]));
        
        // Save the encrypted data along with salt and IV
        const dataToSave = Buffer.concat([salt, iv, encrypted]);
        fs.writeFileSync(outputPath, dataToSave);
        spinner.succeed(colors.colorize(`File encrypted successfully! Saved to: ${outputPath}`, 'green'));
    } catch (error) {
        spinner.fail(colors.colorize(`Encryption failed: ${error.message}`, 'red'));
        process.exit(1);
    }
}

function decryptFile(inputPath, outputPath, password) {
    const spinner = new Spinner('Decrypting file...').start();
    try {
        // Read the encrypted file
        const encryptedData = fs.readFileSync(inputPath);
        
        // Extract salt, IV, and encrypted content
        const salt = encryptedData.slice(0, 16);
        const iv = encryptedData.slice(16, 32);
        const encrypted = encryptedData.slice(32);
        
        // Regenerate key using the same salt
        const key = generateKey(password, salt);
        
        // Decrypt the file
        const decrypted = xorEncrypt(encrypted, Buffer.concat([key, iv]));
        
        fs.writeFileSync(outputPath, decrypted);
        spinner.succeed(colors.colorize(`File decrypted successfully! Saved to: ${outputPath}`, 'green'));
    } catch (error) {
        spinner.fail(colors.colorize('Decryption failed. This could be due to an incorrect password or corrupted file.', 'red'));
        process.exit(1);
    }
}

function promptUser(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(colors.colorize(question, 'cyan'), (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function main() {
    console.log(colors.bold_cyan('\n🔐 SafeStore - Secure File Encryption Tool\n'));
    
    const args = process.argv.slice(2);
    let command, inputFile, outputFile, password;

    if (args.length < 4) {
        console.log(colors.colorize('Interactive Mode - Please provide the required details\n', 'yellow'));

        command = (await promptUser('Enter command (e/encrypt, d/decrypt): ')).toLowerCase();
        inputFile = await promptUser('Enter input file path: ');
        outputFile = await promptUser('Enter output file path: ');
        password = await promptUser('Enter password: ');
    } else {
        [command, inputFile, outputFile, password] = args;
        command = command.toLowerCase();
    }

    // Support shorthand commands
    if (command === 'e' || command === 'encrypt') {
        encryptFile(inputFile, outputFile, password);
    } else if (command === 'd' || command === 'decrypt') {
        decryptFile(inputFile, outputFile, password);
    } else {
        console.log(colors.colorize('\n❌ Invalid command. Use "e" or "encrypt" for encryption, "d" or "decrypt" for decryption.\n', 'red'));
        process.exit(1);
    }
}

main();
