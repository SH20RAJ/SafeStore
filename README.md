# SafeStore

SafeStore is an npm package that allows users to encrypt and decrypt files directly from the command line using a password. It is designed to be lightweight, easy to use, and secure. One of its primary use cases is encrypting `.env` files before pushing them to version control systems like GitHub. You can now push your env files to GitHub without the hassle of managing secrets in repository settings or storing them locally. Just remember one password to encrypt and decrypt your files - perfect for small projects where you don't want to deal with complex secrets management and data loss in case files are deleted from PC.

## Features
- **File Encryption:** Securely encrypt any file using AES-256 encryption.
- **File Decryption:** Easily decrypt encrypted files with the correct password.
- **IV Management:** Automatically stores the initialization vector (IV) in a separate file to enable decryption.
- **Convenient CLI:** Simple command-line interface for encryption and decryption operations.

## Installation
Install SafeStore globally using npm:

```bash
npm install -g safestore
```

## Usage
Run the following commands from your terminal:

### Encrypt a File
```bash
npx safestore encrypt <inputFile> <outputFile> <password>
```
- `<inputFile>`: Path to the file you want to encrypt.
- `<outputFile>`: Path to save the encrypted file.
- `<password>`: Password to encrypt the file.

Example:
```bash
npx safestore encrypt .env .env.safe mySecretPassword
```

### Decrypt a File
```bash
npx safestore decrypt <inputFile> <outputFile> <password>
```
- `<inputFile>`: Path to the encrypted file.
- `<outputFile>`: Path to save the decrypted file.
- `<password>`: Password to decrypt the file.

Example:
```bash
npx safestore decrypt .env.safe .env mySecretPassword
```

### Use Cases
1. **Securely Store Environment Variables:** Encrypt your `.env` file before pushing it to a public repository.
   - Example:
     ```bash
     npx safestore encrypt .env .env.enc mySecretPassword
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
