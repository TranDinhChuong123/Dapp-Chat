// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";



contract Chat is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    uint256 public constant MAX_LENGTH = 500;
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    mapping(bytes32 => Message[]) private conversations;

    event NewMessage(
        bytes32 indexed convKey,
        address indexed from,
        address indexed to,
        string content,
        uint256 timestamp
    );

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
    }

    /* ============= MODIFIERS ============= */
    modifier validAddress(address _addr) {
        if (_addr == address(0)) revert("Invalid address");
        _;
    }

    modifier notSelf(address _to) {
        if (msg.sender == _to) revert("Cannot message self");
        _;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function sendMessage(
        address _to,
        string calldata _content
    ) external validAddress(_to) notSelf(_to) nonReentrant {

        uint64 ts = uint64(block.timestamp);
        bytes32 convKey = _getConversationKey(msg.sender, _to);

        conversations[convKey].push(
            Message({
                sender: msg.sender,
                content: _content,
                timestamp: ts
            })
        );

        emit NewMessage(convKey, msg.sender, _to, _content, block.timestamp);
    }

    function getConversation(
        address other
    ) external view returns (Message[] memory) {
        bytes32 convKey = _getConversationKey(msg.sender, other);
        return conversations[convKey];
    }

    function _getConversationKey(
        address a,
        address b
    ) private pure returns (bytes32) {
        (address x, address y) = a < b ? (a, b) : (b, a);
        return keccak256(abi.encodePacked(x, y));
    }


    uint256[50] private __gap;
}
