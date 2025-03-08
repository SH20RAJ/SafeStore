# SafeStore

[![npm version](https://badge.fury.io/js/safestore.svg)](https://badge.fury.io/js/safestore)[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)[![Downloads](https://img.shields.io/npm/dm/safestore.svg)](https://www.npmjs.com/package/safestore)[![GitHub issues](https://img.shields.io/github/issues/sh20raj/safestore)](https://github.com/sh20raj/safestore/issues)[![GitHub stars](https://img.shields.io/github/stars/sh20raj/safestore)](https://github.com/sh20raj/safestore/stargazers)[![Visitors](https://api.visitorbadge.io/api/combined?path=https%3A%2F%2Fgithub.com%2FSH20RAJ%2FSafeStore&labelColor=%23f47373&countColor=%23dce775&style=flat-square)](https://visitorbadge.io/status?path=https%3A%2F%2Fgithub.com%2FSH20RAJ%2FSafeStore)

SafeStore is an npm package that allows users to encrypt and decrypt files directly from the command line using a password. It is designed to be lightweight, easy to use, and secure. One of its primary use cases is encrypting `.env` files before pushing them to version control systems like GitHub. You can now push your env files to GitHub without the hassle of managing secrets in repository settings or storing them locally. Just remember one password to encrypt and decrypt your files - perfect for small projects where you don't want to deal with complex secrets management and data loss in case files are deleted from PC.

### Real-World Problem It Solves
Have you ever found yourself managing multiple projects with large node_modules directories consuming precious disk space? While tools like `npkill` help clean up these directories,let's say in frustration there's a real risk of accidentally deleting entire project folders in the cleanup process. While your code might be safely stored on GitHub, your `.env` files - which are typically gitignored - could be lost forever. Managing these through GitHub Secrets for each project can become tedious and time-consuming. This was the exact problem that inspired SafeStore: now you can simply use `npx safe` to encrypt your `.env` files and safely push them to GitHub. Just remember your password, and you'll never lose your environment variables again, even if you accidentally delete your local projects!

## Features
- **File Encryption:** Securely encrypt any file using XOR-based encryption with password-derived keys.
- **File Decryption:** Easily decrypt encrypted files with the correct password.
- **Salt and IV:** Automatically includes salt and initialization vector (IV) with the encrypted data for secure decryption.
- **Convenient CLI:** Simple command-line interface for encryption and decryption operations.

## Installation
Install SafeStore globally using npm:

```bash
npm install -g safestore
```

## Usage
Run the following commands from your terminal:

### Encrypt a File

Just run this command:
```bash
npx safe
```
It will ask you for the file path, password and operation type.

Or you can use either of these commands:

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

### Using Custom Scripts
You can add custom scripts to your project's `package.json` for convenient encryption and decryption. The tool will prompt for the password while using predefined file paths:

```json
{
  "scripts": {
    "safe:encrypt": "npx safestore encrypt .env .env.safe",
    "safe:decrypt": "npx safestore decrypt .env.safe .env"
  }
}
```

Then simply run:
```bash
npm run safe:encrypt
# or
npm run safe:decrypt
```
You'll only need to enter the password when prompted.

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
1. **Key Generation:** A secure key is derived from the provided password using a salt, which is randomly generated for each encryption operation.
2. **Initialization Vector (IV):** A unique IV is generated for every encryption operation and combined with the key for enhanced security.
3. **Encryption/Decryption:** The file is encrypted/decrypted using XOR operations with the combined key and IV. The salt and IV are stored at the beginning of the encrypted file.

## Security Considerations
- Use strong, unique passwords for each encrypted file.
- The encrypted file contains everything needed for decryption (salt and IV), so keep it secure.
- Share passwords through secure channels separate from the encrypted files.
- The XOR-based encryption provides basic security suitable for simple use cases. For highly sensitive data, consider using standard encryption libraries.

## License
This project is open-source and available under the MIT License.

## Contributions
Contributions are welcome! Feel free to open issues or submit pull requests to improve SafeStore.

## Contact
If you have any questions or feedback, feel free to reach out:
- Email: sh20raj@gmail.com
- GitHub: [@sh20raj](https://github.com/sh20raj)
