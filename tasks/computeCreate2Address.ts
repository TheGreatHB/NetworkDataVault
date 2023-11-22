import { task } from "hardhat/config";
import { factoryAddress, salt } from "../constants/constants.json";
import "dotenv/config";

task("computeCreate2Address", "Compute the addres of a contract deployed with CREATE2").setAction(async (taskArgs, hre) => {
    const encoder = (types: any, values: any) => {
        const abiCoder = hre.ethers.AbiCoder.defaultAbiCoder();
        const encodedParams = abiCoder.encode(types, values);
        return encodedParams.slice(2);
    };

    const create2Address = (factoryAddress: string, saltHex: string, initCode: string) => {
        const create2Addr = hre.ethers.getCreate2Address(factoryAddress, saltHex, hre.ethers.keccak256(initCode));
        return create2Addr;
    };

    const deployerAddress = String(process.env.DEPLOYER_ADDRESS);
    const bytecode = (await hre.ethers.getContractFactory("UniversalStorage")).bytecode;
    const initCode = bytecode + encoder(["address"], [deployerAddress]);

    const create2Addr = create2Address(factoryAddress, salt, initCode);
    console.log("precomputed address:", create2Addr);
});
