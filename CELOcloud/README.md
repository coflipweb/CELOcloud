# CELOcloud
CELOcloud is a decentralized file storage platform built on the Celo blockchain. It allows users to store, share, and access files securely and privately using the CELO token as the native currency.

How it works
CELOcloud uses a combination of smart contracts, IPFS, and Celo's built-in encryption to provide secure, decentralized file storage. Users can upload files to the platform using the FileUpload contract, which is deployed on the Celo blockchain. The files are stored on IPFS, a distributed file storage system, and are encrypted using Celo's built-in encryption before being stored.

To access a file on CELOcloud, users must first purchase CELO tokens and deposit them into their account. The tokens are used to pay for storage and access to the files. Users can then download the file from IPFS and decrypt it using their private key, which is stored securely on their device.

CELOcloud also includes a file sharing feature, which allows users to share files securely with other users. When a user shares a file, they create a new encrypted key pair that is used to encrypt the file. The encrypted key pair is then stored on IPFS and shared with the recipient. The recipient can then use their private key to decrypt the key pair and access the shared file.

Getting started
To use CELOcloud, you'll need to have a Celo wallet and some CELO tokens. You can create a Celo wallet using a tool such as Valora or a hardware wallet such as Ledger or Trezor. Once you have a wallet, you can purchase CELO tokens from a cryptocurrency exchange such as Binance or Coinbase.

To upload a file to CELOcloud, you'll need to interact with the FileUpload contract using a tool such as Remix or Truffle. Once you've uploaded a file, you can access it using the CELOcloud app, which is available for download on the Celo app store.

Contributing
CELOcloud is an open-source project, and contributions are welcome! If you'd like to contribute to the project, please read the CONTRIBUTING.md file for guidelines on how to get started.

License
CELOcloud is licensed under the MIT License, which allows anyone to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software.



# Install

```

npm install

```

or 

```

yarn install

```

# Start

```

npm run dev

```

# Build

```

npm run build

```
# Usage
1. Install the [CeloExtensionWallet](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh?hl=en) from the google chrome store.
2. Create a wallet.
3. Go to [https://celo.org/developers/faucet](https://celo.org/developers/faucet) and get tokens for the alfajores testnet.
4. Switch to the alfajores testnet in the CeloExtensionWallet.
