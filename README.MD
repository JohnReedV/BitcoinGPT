# BitcoinGPT

BitcoinGPT is a chatGPT plugin that provides information about the Bitcoin blockchain, including block data, transaction details, and information about senders and receivers. It is built using Express and CORS, and communicates with the Bitcoin Core node.

## Features

- Get Bitcoin chain info
- Get current block height
- Get block hash by block number
- Get the details of a block by its block hash
- Get raw transaction by tx hash and block hash
- Get decoded transaction from raw transaction hex string
- Get transaction details by txid
- Get receivers of a transaction from the decoded transaction object
- Get senders of a transaction from the transaction hex string

## Installation

To install the necessary dependencies, run the following command: `npm install`

## Usage

To start the server, run the following command: `npm start`

The server will run on port 3003 by default. You can test the endpoints using a tool like Postman or by writing your own client code.

## Contributing

Feel free to submit issues, fork the repository, and create pull requests. For major changes, please open an issue first to discuss the proposed changes.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) License. To view a copy of this license, visit [https://creativecommons.org/licenses/by-nc/4.0/](https://creativecommons.org/licenses/by-nc/4.0/).

