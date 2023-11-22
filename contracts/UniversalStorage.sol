// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/StorageSlot.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title UniversalStorage
 * @dev This simple contract is deployed with the same address on each network.
 * @dev Each deployment can store same / different data in the desired slots.
 */
contract UniversalStorage is Ownable {
    error SlotAlreadyInUse(bytes32 slot);
    error OwnerSlotCannotBeSet();

    constructor(address _owner) Ownable(_owner) {}

    /**
     * @dev Sets the bytes data for a given slot.
     * @param slot The slot identifier.
     * @param data The bytes data to be stored.
     * @notice This function will revert if the slot is already in use. Be careful about hash collisions.
     */
    function setBytesData(bytes32 slot, bytes memory data) external onlyOwner {
        if (StorageSlot.getBytes32Slot(slot).value != bytes32(0)) revert SlotAlreadyInUse(slot);
        StorageSlot.getBytesSlot(slot).value = data;
    }

    /**
     * @dev Sets the bytes data for a given slot forcefully.
     * @param slot The slot identifier.
     * @param data The bytes data to be stored.
     * @notice This function will overwrite the existing data in the slot except for the owner slot. Should be used with caution.
     */
    function forceSetBytesData(bytes32 slot, bytes memory data) external onlyOwner {
        if (slot == bytes32(0)) revert OwnerSlotCannotBeSet();
        StorageSlot.getBytesSlot(slot).value = data;
    }

    /**
     * @dev Retrieves the bytes data for a given slot.
     * @param slot The slot identifier.
     * @return The bytes data stored in the slot.
     */
    function getBytesData(bytes32 slot) external view returns (bytes memory) {
        return StorageSlot.getBytesSlot(slot).value;
    }
}
