import { ethers, network } from "hardhat";
import { factoryAddress, salt } from "../constants/constants.json";
import "dotenv/config";
import { MetamaskClient } from "hardhat_metamask_client2";
import { expect } from "chai";
import fs from "fs";
import * as path from "path";

async function main() {
    let client: any = new MetamaskClient();

    const encoder = (types: any, values: any) => {
        const abiCoder = ethers.AbiCoder.defaultAbiCoder();
        const encodedParams = abiCoder.encode(types, values);
        return encodedParams.slice(2);
    };

    const deployerAddress = String(process.env.DEPLOYER_ADDRESS);
    const bytecode = (await ethers.getContractFactory("UniversalStorage")).bytecode;
    const initCode = bytecode + encoder(["address"], [deployerAddress]);

    const signer = await client.getSigner();
    expect(ethers.getAddress(await signer.getAddress())).to.equal(deployerAddress);

    const usAddress = ethers.getAddress(await signer.call({ to: factoryAddress, data: salt + initCode.slice(2) }));
    console.log("simulated address:", usAddress);

    const tx = await signer.sendTransaction({ to: factoryAddress, data: salt + initCode.slice(2) });
    await tx.wait();

    const us = await ethers.getContractAt("UniversalStorage", usAddress);
    const owner = await us.owner();
    console.log(`Owner of UniversalStorage: ${owner.toLocaleLowerCase() == deployerAddress.toLocaleLowerCase()}. ${owner}`);
    client.close();

    const deploymentsPath = path.resolve(__dirname, "../deployments/UniversalStorage.json");

    let deployments: { [key: string]: string } = {};
    if (fs.existsSync(deploymentsPath)) {
        deployments = JSON.parse(fs.readFileSync(deploymentsPath).toString());
    }
    deployments[String(network.config.chainId)] = usAddress;
    fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
