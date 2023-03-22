const hre = require("hardhat");

async function main() {
  const DonateToDev = await hre.ethers.getContractFactory("DonateToDev");
  const donateToDev = await DonateToDev.deploy();

  await donateToDev.deployed();

  console.log(
    `The DonateToDev contract has been deployed to ${donateToDev.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
