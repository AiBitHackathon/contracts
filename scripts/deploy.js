const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`🚀 Deploying contracts with account: ${deployer.address}`);

  // Deploy AIbit contract
  const AIbit = await hre.ethers.getContractFactory("AIbit");
  const aibit = await AIbit.deploy(deployer.address, deployer.address, deployer.address);

  await aibit.waitForDeployment();
  const contractAddress = await aibit.getAddress();
  console.log(`✅ AIbit deployed to: ${contractAddress}`);

  // Wait for Arbiscan to index the contract
  console.log("⌛ Waiting for 5 block confirmations before verification...");
  await aibit.deploymentTransaction().wait(5);

  // Verify the contract on Arbiscan
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [deployer.address, deployer.address, deployer.address],
    });
    console.log(`🎉 Contract verified on Arbiscan: https://sepolia.arbiscan.io/address/${contractAddress}`);
  } catch (error) {
    console.error("❌ Verification failed:", error);
  }
}

// Run the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
