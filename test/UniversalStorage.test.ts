import { expect } from "chai";
import { ethers } from "hardhat";

import { UniversalStorage } from "../typechain-types";

import { takeSnapshot, SnapshotRestorer } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { Signer, ZeroHash, hexlify } from "ethers";

function getRandomBytesData(bytesLength: number): string {
    return hexlify(ethers.randomBytes(bytesLength));
}

describe("UniversalStorage", () => {
    let universalStorage: UniversalStorage;
    let deployer: Signer, vitalik: Signer;
    let snapshot: SnapshotRestorer;
    const slot0 = ethers.encodeBytes32String("slot0");
    const data0 = getRandomBytesData(50);

    before(async () => {
        [deployer, vitalik] = await ethers.getSigners();
        universalStorage = await ethers.deployContract("UniversalStorage", [await deployer.getAddress()]);
        await universalStorage.waitForDeployment();

        snapshot = await takeSnapshot();
    });

    beforeEach(async () => {
        await snapshot.restore();
    });

    it("should set and retrieve bytes data for a given slot", async () => {
        await universalStorage.setBytesData(slot0, data0);
        expect(await universalStorage.getBytesData(slot0)).to.equal(data0);
    });

    it(`should set and retrieve bytes data of any length`, async () => {
        for (let i = 0; i <= 100; i++) {
            const slot = ethers.encodeBytes32String(`slot${i}`);
            const data = getRandomBytesData(i);

            await universalStorage.setBytesData(slot, data);
            expect(await universalStorage.getBytesData(slot)).to.equal(data);
        }
    });

    it("should revert when setting bytes data for an already used slot", async () => {
        const slot1 = ethers.encodeBytes32String("slot1");
        const data1 = getRandomBytesData(40);

        await universalStorage.setBytesData(slot0, data0);

        await expect(universalStorage.setBytesData(slot0, data0)).to.be.revertedWithCustomError(universalStorage, "SlotAlreadyInUse");
        await expect(universalStorage.setBytesData(slot0, data1)).to.be.revertedWithCustomError(universalStorage, "SlotAlreadyInUse");

        await universalStorage.setBytesData(slot1, data1);
    });

    it("should overwrite existing data when forcefully setting bytes data", async () => {
        const data1 = getRandomBytesData(40);

        await universalStorage.setBytesData(slot0, data0);
        expect(await universalStorage.getBytesData(slot0)).to.equal(data0);

        await universalStorage.forceSetBytesData(slot0, data1);
        expect(await universalStorage.getBytesData(slot0)).to.equal(data1);

        const data2 = getRandomBytesData(70);
        await universalStorage.forceSetBytesData(slot0, data2);
        expect(await universalStorage.getBytesData(slot0)).to.equal(data2);
    });

    it("should revert when setting bytes data for the owner slot", async () => {
        const ownerSlot = ZeroHash;

        await expect(universalStorage.setBytesData(ownerSlot, data0)).to.be.revertedWithCustomError(universalStorage, "SlotAlreadyInUse");
    });

    it("should revert when forcefully setting bytes data for the owner slot", async () => {
        const ownerSlot = ZeroHash;

        await expect(universalStorage.forceSetBytesData(ownerSlot, data0)).to.be.revertedWithCustomError(universalStorage, "OwnerSlotCannotBeSet");
    });

    it("should revert when non-owner tries to set bytes data", async () => {
        await expect(universalStorage.connect(vitalik).setBytesData(slot0, data0)).to.be.revertedWithCustomError(
            universalStorage,
            "OwnableUnauthorizedAccount",
        );
        await expect(universalStorage.connect(vitalik).forceSetBytesData(slot0, data0)).to.be.revertedWithCustomError(
            universalStorage,
            "OwnableUnauthorizedAccount",
        );
    });
});
