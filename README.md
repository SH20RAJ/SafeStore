# SafeStore

SafeStore is an npm package that allows users to encrypt and decrypt files directly from the command line using a password. It is designed to be lightweight, easy to use, and secure. One of its primary use cases is encrypting `.env` files before pushing them to version control systems like GitHub.

## Features
- **File Encryption:** Securely encrypt any file using AES-256 encryption.
- **File Decryption:** Easily decrypt encrypted files with the correct password.
- **IV Management:** Automatically stores the initialization vector (IV) in a separate file to enable decryption.
- **Convenient CLI:** Simple command-line interface for encryption and decryption operations.

## Installation
To use SafeStore, you need Node.js installed on your machine. Clone this repository or download the script.

## Usage
Run the following commands from your terminal:

### Encrypt a File
```bash
node file-encryption-cli.js encrypt <inputFile> <outputFile> <password>
```
- `<inputFile>`: Path to the file you want to encrypt.
- `<outputFile>`: Path to save the encrypted file.
- `<password>`: Password to encrypt the file.

Example:
```bash
node file-encryption-cli.js encrypt .env .env.enc mySecretPassword
```

### Decrypt a File
```bash
node file-encryption-cli.js decrypt <inputFile> <outputFile> <password>
```
- `<inputFile>`: Path to the encrypted file.
- `<outputFile>`: Path to save the decrypted file.
- `<password>`: Password to decrypt the file.

Example:
```bash
node file-encryption-cli.js decrypt .env.enc .env mySecretPassword
```

### Use Cases
1. **Securely Store Environment Variables:** Encrypt your `.env` file before pushing it to a public repository.
   - Example:
     ```bash
     node file-encryption-cli.js encrypt .env .env.enc mySecretPassword
     git add .env.enc
     git commit -m "Add encrypted .env file"
     ```
2. **Backup Sensitive Files:** Keep encrypted backups of sensitive files to prevent unauthorized access.
3. **Share Encrypted Files:** Share encrypted files with collaborators securely. Share the password via a separate secure channel.
4. **Prevent Loss of Environment Variables:** Use SafeStore to back up your `.env` file. Even if your local project is deleted, you can recover the variables by decrypting the file.

## How It Works
1. **Encryption:** The script uses the AES-256-CBC algorithm for encryption. A secure key is derived from the provided password using `crypto.scryptSync`.
2. **Initialization Vector (IV):** A unique IV is generated for every encryption operation and saved alongside the encrypted file as `<outputFile>.iv`.
3. **Decryption:** The IV is read from the `.iv` file and used to decrypt the encrypted file with the provided password.

## Security Considerations
- Ensure your password is strong and not stored in plaintext.
- Keep the `.iv` file alongside the encrypted file for decryption.
- Avoid sharing the password insecurely.

## License
This project is open-source and available under the MIT License.

## Contributions
Contributions are welcome! Feel free to open issues or submit pull requests to improve SafeStore.

## Contact
If you have any questions or feedback, feel free to reach out:
- Email: sh20raj@gmail.com
- GitHub: [@sh20raj](https://github.com/sh20raj)
