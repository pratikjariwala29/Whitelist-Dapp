//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Whitelist
{
    // Max number of whitelisted addresses allowed
    uint8 public maxWhitelistedAddresses;

    // numAddressesWhitelisted would be used to keep track of how many addresses have been whitelisted
    uint8 public numAddressesWhitelisted;

    // Create a mapping of whitelistedAddresses
    // if an address is whitelisted, we would set it to true, it is false by default for all other addresses.
    mapping(address => bool) public whiteListedAddresses;

    // Setting the Max number of whitelisted addresses
    // User will put the value at the time of deployment
    constructor(uint8 _maxWhitelistedAddresses)
    {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    //addAddressToWhitelist - This function adds the address of the sender to the whitelist
    function addAddressToWhitelist() public
    {
        // check if the user has already been whitelisted
        require(!whiteListedAddresses[msg.sender], "Sender already in the whitelist");
        // check if the numAddressesWhitelisted < maxWhitelistedAddresses, if not then throw an error.
        require(numAddressesWhitelisted < maxWhitelistedAddresses, "Max Limit Reached");
        // Add the address which called the function to the whitelistedAddress array
        whiteListedAddresses[msg.sender] = true;
        // Increase the number of whitelisted addresses
        numAddressesWhitelisted += 1;
        
    }
}