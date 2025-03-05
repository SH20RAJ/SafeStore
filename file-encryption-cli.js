#!/usr/bin/env node

// file-encryption-cli.js

const fs = require('fs');
const readline = require('readline');

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
        console.log(`Encrypted file saved to: ${outputPath}`);
    } catch (error) {
        console.error('Encryption failed:', error.message);
        process.exit(1);
    }
}

function decryptFile(inputPath, outputPath, password) {
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
        console.log(`Decrypted file saved to: ${outputPath}`);
    } catch (error) {
        console.error('Decryption failed. This could be due to an incorrect password or corrupted file.');
        process.exit(1);
    }
}

function promptUser(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function main() {
    const args = process.argv.slice(2);

    let command, inputFile, outputFile, password;

    if (args.length < 4) {
        console.log('Some arguments are missing. Please provide the required details.');

        command = await promptUser('Enter command (encrypt/decrypt): ');
        inputFile = await promptUser('Enter input file path: ');
        outputFile = await promptUser('Enter output file path: ');
        password = await promptUser('Enter password: ');
    } else {
        [command, inputFile, outputFile, password] = args;
    }

    if (command === 'encrypt') {
        encryptFile(inputFile, outputFile, password);
    } else if (command === 'decrypt') {
        decryptFile(inputFile, outputFile, password);
    } else {
        console.log('Invalid command. Use "encrypt" or "decrypt".');
        process.exit(1);
    }
}

main();
