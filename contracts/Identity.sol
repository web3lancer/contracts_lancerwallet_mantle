// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Identity {
    enum KYCLevel { NONE, KYC_BASIC, KYC_VERIFIED }

    mapping(address => KYCLevel) public kycLevel;
    mapping(address => string) public handle;

    event Registered(address indexed user, string handle, KYCLevel level);
    event KYCUpdated(address indexed user, KYCLevel level);

    function register(string calldata _handle) external {
        require(bytes(_handle).length > 0, "handle required");
        handle[msg.sender] = _handle;
        kycLevel[msg.sender] = KYCLevel.KYC_BASIC;
        emit Registered(msg.sender, _handle, KYCLevel.KYC_BASIC);
    }

    function setKYCLevel(address user, KYCLevel level) external {
        // in a real system this would be restricted to an admin or oracle
        kycLevel[user] = level;
        emit KYCUpdated(user, level);
    }
}
