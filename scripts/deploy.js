const { ethers } = require("hardhat")

const mainnetContracts = {
  // weth: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  // factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  router2: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
}

async function main() {
  const ToolV1 = await ethers.getContractFactory("ToolV1")
  const toolV1 = await ToolV1.deploy(mainnetContracts.router2)

  console.log("token address:", toolV1.address)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
