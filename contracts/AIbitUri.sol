// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

abstract contract AIbitUri is ERC721 {

    struct DataURI{
        string name;
        string image;  
        string level;
    }

    mapping (uint256 => DataURI) AIbitTokensURI;

    constructor(){
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);

        DataURI memory data = AIbitTokensURI[tokenId];

        // Ensure proper JSON formatting
        string memory json = string(
            abi.encodePacked(
                '{"name":"', data.name,
                '","image":"', data.image,
                '","level":"', data.level, '"}' 
            )
        );

        string memory base64Json = Base64.encode(bytes(json));

        return string(abi.encodePacked("data:application/json;base64,", base64Json));
    }


    function _setTokenURI(uint256 tokenId, string memory _name, string memory _image, string memory _level) public virtual {
        _requireOwned(tokenId);
        AIbitTokensURI[tokenId].name = _name;
        AIbitTokensURI[tokenId].image = _image;
        AIbitTokensURI[tokenId].level = _level;
    }

    function _updateLevel(uint256 tokenId,  string memory _level) public virtual {
        _requireOwned(tokenId);
        AIbitTokensURI[tokenId].level = _level;
    }

    function _updateImageAndLevel(uint256 tokenId,  string memory _image, string memory _level) public virtual {
        _requireOwned(tokenId);
        AIbitTokensURI[tokenId].image = _image;
        AIbitTokensURI[tokenId].level = _level;
    }
 
}