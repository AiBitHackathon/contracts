const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AIbit", function () {
  async function deployAIbitFixture() {
    // Get test accounts
    const [admin, pauser, minter, user] = await ethers.getSigners();

    // Deploy AIbit contract
    const AIbit = await ethers.getContractFactory("AIbit");
    const aibit = await AIbit.deploy(admin.address, pauser.address, minter.address);

    return { aibit, admin, pauser, minter, user };
  }

  describe("Deployment", function () {
    it("Should set the correct admin, pauser, and minter roles", async function () {
      const { aibit, admin, pauser, minter } = await deployAIbitFixture();

      const DEFAULT_ADMIN_ROLE = await aibit.DEFAULT_ADMIN_ROLE();
      const PAUSER_ROLE = await aibit.PAUSER_ROLE();
      const MINTER_ROLE = await aibit.MINTER_ROLE();

      expect(await aibit.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
      expect(await aibit.hasRole(PAUSER_ROLE, pauser.address)).to.be.true;
      expect(await aibit.hasRole(MINTER_ROLE, minter.address)).to.be.true;
    });
  });

  describe("Pausing", function () {
    it("Should allow the pauser to pause and unpause the contract", async function () {
      const { aibit, pauser } = await deployAIbitFixture();
      
      await expect(aibit.connect(pauser).pause())
        .to.emit(aibit, "Paused")
        .withArgs(pauser.address);

      expect(await aibit.paused()).to.be.true;

      await expect(aibit.connect(pauser).unpause())
        .to.emit(aibit, "Unpaused")
        .withArgs(pauser.address);

      expect(await aibit.paused()).to.be.false;
    });

    it("Should prevent non-pausers from pausing", async function () {
      const { aibit, user } = await deployAIbitFixture();
      await expect(aibit.connect(user).pause()).to.be.revertedWithCustomError(
        aibit,
        "AccessControlUnauthorizedAccount"
      );
    });
  });

  describe("Minting", function () {
    it("Should allow the minter to mint a new token", async function () {
      const { aibit, minter, user } = await deployAIbitFixture();

      const name = "AIbit Token";
      const image = "https://example.com/token.png";
      const level = "1";

      await expect(aibit.connect(minter).safeMint(user.address, name, image, level))
        .to.emit(aibit, "Transfer") // ERC721 Transfer event
        .withArgs(ethers.ZeroAddress, user.address, 0); // First tokenId = 0

      expect(await aibit.ownerOf(0)).to.equal(user.address);
    });

    it("Should prevent non-minters from minting", async function () {
      const { aibit, user } = await deployAIbitFixture();
      await expect(
        aibit.connect(user).safeMint(user.address, "Token", "Image", "1")
      ).to.be.revertedWithCustomError(aibit, "AccessControlUnauthorizedAccount");
    });
  });

  describe("Token Metadata", function () {
    it("Should return correct tokenURI after minting", async function () {
      const { aibit, minter, user } = await deployAIbitFixture();
  
      const name = "AIbit Token";
      const image = "https://example.com/token.png";
      const level = "1";
  
      await aibit.connect(minter).safeMint(user.address, name, image, level);
  
      // Fetch token URI
      const tokenUri = await aibit.tokenURI(0);
  
      // Ensure the token URI follows the expected "data:application/json;base64," format
      expect(tokenUri.startsWith("data:application/json;base64,")).to.be.true;
  
      // Extract the Base64-encoded part of the URI
      const base64Encoded = tokenUri.split(",")[1];
  
      // Decode Base64 back to JSON string
      const decodedString = Buffer.from(base64Encoded, "base64").toString();
  
      console.log("Decoded Token URI JSON:", decodedString); // Debugging output
  
      // Parse the decoded JSON
      const decodedJson = JSON.parse(decodedString);
  
      // Expected JSON structure (ensure no extra spaces)
      const expectedJsonObj = {
        name: name,
        image: image,
        level: level,
      };
  
      // Compare JSON objects
      expect(decodedJson).to.deep.equal(expectedJsonObj);
    });
  });
  
});
