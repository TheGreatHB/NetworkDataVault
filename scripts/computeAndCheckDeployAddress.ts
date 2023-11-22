import { ethers } from "hardhat";
import config from "../hardhat.config";
import { expect } from "chai";
import { JsonRpcProvider } from "ethers";
import { factoryAddress, salt } from "../constants/constants.json";
import "dotenv/config";

const encoder = (types: any, values: any) => {
    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
    const encodedParams = abiCoder.encode(types, values);
    return encodedParams.slice(2);
};

const create2Address = (factoryAddress: string, saltHex: string, initCode: string) => {
    const create2Addr = ethers.getCreate2Address(factoryAddress, saltHex, ethers.keccak256(initCode));
    return create2Addr;
};

async function computeAndCheckDeployAddress(networkName: string, _provider: JsonRpcProvider) {
    console.log(`Network: ${networkName}`);
    const deployerAddress = String(process.env.DEPLOYER_ADDRESS);
    const bytecode = (await ethers.getContractFactory("UniversalStorage")).bytecode;

    const initCode = bytecode + encoder(["address"], [deployerAddress]);

    const create2Addr = create2Address(factoryAddress, salt, initCode);
    console.log("precomputed address:", create2Addr);

    const tx = await _provider.call({ to: factoryAddress, data: salt + initCode.slice(2) });
    console.log("simulated address:", ethers.getAddress(tx));

    expect(ethers.getAddress(tx)).to.equal(create2Addr);
}

async function main() {
    const networks = config.networks;

    for (const key in networks) {
        if (key !== "hardhat") {
            const url = (networks[key] as any).url;
            await computeAndCheckDeployAddress(key, new ethers.JsonRpcProvider(url));
        }
    }
}

main().then(() => process.exit(0));
