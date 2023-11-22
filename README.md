# NetworkDataVault

NetworkDataVault is a repository that contains a smart contract named UniversalStorage. This contract can be deployed on any EVM network and allows for the storage of byte data in specified slots.

## UniversalStorage Contract

The UniversalStorage contract provides the following functionalities:

- `setBytesData(bytes32 slot, bytes memory data)`: Sets byte data in the given slot. This function reverts if the slot is already in use.
- `forceSetBytesData(bytes32 slot, bytes memory data)`: Force sets byte data in the given slot. This function overwrites any existing data in the slot.
- `getBytesData(bytes32 slot)`: Retrieves the byte data in the given slot.

## Installation

1. Clone this repository: `git clone https://github.com/TheGreatHB/NetworkDataVault.git`
2. Navigate into the directory: `cd NetworkDataVault`
3. Install dependencies: `npm install`

## Usage

This project is developed using Hardhat. You can use the default Hardhat commands to run tests. The deployment script is not yet available.

- Run tests: `npx hardhat test`

## License

This project is licensed under the MIT License.
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Contact

- [TheGreatHB](https://twitter.com/TheGreatHB_/)
