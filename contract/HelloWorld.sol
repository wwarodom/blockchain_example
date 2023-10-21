// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract HelloWorld {
    string public message;

    constructor() {
        message = "Hello World!";
    }

    function updateMessage(string memory newMessage) public {
        message = newMessage;
    }
}