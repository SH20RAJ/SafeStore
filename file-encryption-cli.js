// file-encryption-cli.js

const fs = require('fs');
const path = require('path');

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

// CLI Logic
const args = process.argv.slice(2);
if (args.length < 4) {
    console.log('Usage: node file-encryption-cli.js <encrypt|decrypt> <inputFile> <outputFile> <password>');
    process.exit(1);
}

const [command, inputFile, outputFile, password] = args;

if (command === 'encrypt') {
    encryptFile(inputFile, outputFile, password);
} else if (command === 'decrypt') {
    decryptFile(inputFile, outputFile, password);
} else {
    console.log('Invalid command. Use "encrypt" or "decrypt".');
    process.exit(1);
}
