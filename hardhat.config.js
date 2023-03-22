require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

module.exports = {
  //Make sure the .sol pragma matches here
  solidity: "0.8.4",
  //send abi to front end
  paths: {
    artifacts: "./cg-app/src/artifacts",
  },
  networks: {
    //choose mainnet or testnet like goerli
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
};
