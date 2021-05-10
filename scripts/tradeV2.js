const { ethers } = require("hardhat")
const axios = require("axios")

const encodeParams = (params) => {
  const res = []
  for (const key in params) {
    res.push(`${key}=${params[key]}`)
  }
  return "?" + res.join("&")
}

const UNISWAP = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
const USD_COIN = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"

const DEXNameToID = {
  UNISWAP_V2: 0,
  BALANCER: 1,
}

const calculateBestDEX = async (toTokenAddress) => {
  console.log("Calculating best DEX via 1inch")
  const params = encodeParams({
    fromTokenAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH address
    toTokenAddress, // Your token
    amount: "100000000000000000", // 1 ether
    protocols: "UNISWAP_V2,BALANCER",
  })
  let result = await axios.get("https://api.1inch.exchange/v3.0/1/quote" + params)
  return DEXNameToID[result.data.protocols[0][0][0].name]
}

async function main() {
  ;[owner, addr1] = await ethers.getSigners()
  console.log("owner ETH pre deploy:", (await ethers.provider.getBalance(owner.address)).toString())
  //initializing contracts
  const ToolV1 = await ethers.getContractFactory("ToolV1")
  const ToolV2 = await ethers.getContractFactory("ToolV2")
  const ERC20 = await ethers.getContractFactory("ERC20")
  const instance = await upgrades.deployProxy(ToolV1, [UNISWAP])
  const dollaCoin = await ERC20.attach(USD_COIN)
  // upgrade contract
  const upgrade = await upgrades.upgradeProxy(instance.address, ToolV2)
  upgrade.setRegistry("0x7226DaaF09B3972320Db05f5aB81FF38417Dd687")
  //
  console.log(
    "owner ETH post deploy:",
    (await ethers.provider.getBalance(owner.address)).toString()
  )
  console.log("addr1 $ balance:", (await dollaCoin.balanceOf(addr1.address)).toString())
  console.log("Trading from addr1...")
  await upgrade.connect(addr1).swapETHForTokens(
    [
      {
        percentage: 100,
        tokenAddress: USD_COIN,
        dexID: await calculateBestDEX(USD_COIN),
      },
    ],
    {
      value: ethers.utils.parseEther("1.0"),
    }
  )
  console.log("trade finished")
  console.log("owner ETH post trade:", (await ethers.provider.getBalance(owner.address)).toString())
  console.log("addr1 $ balance:", (await dollaCoin.balanceOf(addr1.address)).toString())
}

try {
  main()
} catch (e) {
  console.log(e)
}
