/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-ethers")
require("@openzeppelin/hardhat-upgrades")

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/9mNwhKkp09N3gaGppTKIdWbXDtkc_kV6",
      },
    },
    local: {
      url: "http://127.0.0.1:8545/",
    },
  },
}
