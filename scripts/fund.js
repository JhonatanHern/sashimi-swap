const { ethers } = require("hardhat")

async function main() {
  const signers = await ethers.getSigners()
  const tx = await signers[0].sendTransaction({
    to: "0x42261b574358b4EE8ad3D43FB416B4D82D61CD93",
    value: ethers.utils.parseEther("50.0"),
  })
  console.log(tx)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
