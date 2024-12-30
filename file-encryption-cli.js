// file-encryption-cli.js

const fs = require('fs');
const readline = require('readline');

function generateKey(password) {
    return password.padEnd(32, '0').slice(0, 32); // Simple padding to ensure 32-byte key
}

function encryptFile(inputPath, outputPath, password) {
    const key = generateKey(password);
    const input = fs.readFileSync(inputPath);
    const encrypted = input.map((byte, index) => byte ^ key.charCodeAt(index % key.length));

    fs.writeFileSync(outputPath, Buffer.from(encrypted));
    console.log(`Encrypted file saved to: ${outputPath}`);
}

function decryptFile(inputPath, outputPath, password) {
    const key = generateKey(password);
    const input = fs.readFileSync(inputPath);
    const decrypted = input.map((byte, index) => byte ^ key.charCodeAt(index % key.length));

    fs.writeFileSync(outputPath, Buffer.from(decrypted));
    console.log(`Decrypted file saved to: ${outputPath}`);
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
