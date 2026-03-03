// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract ExamVaultAudit {
    event AccessRecorded(
        string userPseudo,
        string paperHash,
        string action,
        uint256 timestamp
    );

    function recordAccess(
        string calldata _userPseudo,
        string calldata _paperHash,
        string calldata _action
    ) public {
        emit AccessRecorded(_userPseudo, _paperHash, _action, block.timestamp);
    }
}
