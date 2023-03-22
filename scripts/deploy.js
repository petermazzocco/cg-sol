const hre = require("hardhat");

async function main() {
  const CrowdGaming = await hre.ethers.getContractFactory("CrowdGaming");
  const crowdGaming = await CrowdGaming.deploy();

  await crowdGaming.deployed();

  console.log(
    `The CrowdGaming contract has been deployed to ${crowdGaming.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
