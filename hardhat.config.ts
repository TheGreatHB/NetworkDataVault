import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-tracer";
import "@nomicfoundation/hardhat-ignition";

import { HardhatUserConfig, task } from "hardhat/config";

let accounts;
if (process.env.PRIVATE_KEY) {
    accounts = [process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"];
} else {
    accounts = {
        mnemonic: process.env.MNEMONIC || "test test test test test test test test test test test junk",
    };
}

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/hardhat-runner/docs/advanced/create-task
task("balance", "Prints an account's balance")
    .addParam("account", "The account's address")
    .setAction(async (taskArgs, hre) => {
        const balance = await hre.ethers.provider.getBalance(taskArgs.account);

        console.log(hre.ethers.formatEther(balance), "ETH");
    });

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    solidity: {
        compilers: [
            {
                version: "0.8.18",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                    viaIR: false,
                },
            },
        ],
    },
    networks: {
        hardhat: {
            forking: {
                enabled: process.env.FORKING === "true",
                url: process.env.FORKING_CHAINID === "1" ? `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}` : String(process.env.FORKING_RPC_URL),
            },
            chainId: process.env.FORKING === "true" ? Number(process.env.FORKING_CHAINID) : 31337,
        },
        ethereum: {
            url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts,
            chainId: 1,
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts,
            chainId: 5,
        },
        bsc: {
            url: `https://1rpc.io/${process.env.ONERPC_API_KEY}/bnb`,
            accounts,
            chainId: 56,
        },
        polygon: {
            url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts,
            chainId: 137,
        },
        avalanche: {
            url: `https://avalanche-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts,
            chainId: 43114,
        },
        optimism: {
            url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts,
            chainId: 10,
        },
        arbitrum: {
            url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts,
            chainId: 42161,
        },
        base: {
            url: `https://1rpc.io/${process.env.ONERPC_API_KEY}/base`,
            accounts,
            chainId: 8453,
        },
        linea: {
            url: `https://1rpc.io/${process.env.ONERPC_API_KEY}/linea`,
            accounts,
            chainId: 59144,
        },
        moonbeam: {
            url: `https://1rpc.io/${process.env.ONERPC_API_KEY}/glmr`,
            accounts,
            chainId: 1284,
        },
        zkevm: {
            url: `https://1rpc.io/${process.env.ONERPC_API_KEY}/polygon/zkevm`,
            accounts,
            chainId: 1101,
        },
        mantle: {
            url: `https://1rpc.io/${process.env.ONERPC_API_KEY}/mantle`,
            accounts,
            chainId: 5000,
        },
        scroll: {
            url: `https://1rpc.io/${process.env.ONERPC_API_KEY}/scroll`,
            accounts,
            chainId: 534352,
        },
        gnosis: {
            url: `https://1rpc.io/${process.env.ONERPC_API_KEY}/gnosis`,
            accounts,
            chainId: 100,
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS === "true",
    },
};

export default config;
