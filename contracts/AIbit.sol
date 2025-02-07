// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Pausable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "./AIbitUri.sol";

contract AIbit is ERC721, AIbitUri, ERC721Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _nextTokenId;

    constructor(address defaultAdmin, address pauser, address minter)
        ERC721("AIbit", "AIT")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function safeMint(address to, string memory _name, string memory _image, string memory _level) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _name, _image, _level);
    }

        // Restrict _setTokenURI to MINTER_ROLE
    function _setTokenURI(uint256 tokenId, string memory _name, string memory _image, string memory _level) 
        public 
        override 
        onlyRole(MINTER_ROLE) 
    {
        super._setTokenURI(tokenId, _name, _image, _level);
    }

    // Restrict _updateLevel to MINTER_ROLE
    function _updateLevel(uint256 tokenId, string memory _level) 
        public 
        override 
        onlyRole(MINTER_ROLE) 
    {
        super._updateLevel(tokenId, _level);
    }

    // Restrict _updateImageAndLevel to MINTER_ROLE
    function _updateImageAndLevel(uint256 tokenId, string memory _image, string memory _level) 
        public 
        override 
        onlyRole(MINTER_ROLE) 
    {
        super._updateImageAndLevel(tokenId, _image, _level);
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, AIbitUri)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
