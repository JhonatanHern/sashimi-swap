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

const calculateBestDEX = async (toTokenAddress) => {
  const params = encodeParams({
    fromTokenAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH address
    toTokenAddress, // Your token
    amount: "100000000000000000", // 1 ether
    protocols: "UNISWAP_V2,BALANCER",
  })
  let result = await axios.get("https://api.1inch.exchange/v3.0/1/quote" + params)
  return result.data.protocols[0][0][0].name
}

async function main() {
  ;[owner, addr1] = await ethers.getSigners()
  console.log("owner ETH pre deploy:", (await ethers.provider.getBalance(owner.address)).toString())
  //initializing contracts
  const ToolV1 = await ethers.getContractFactory("ToolV1")
  const ERC20 = await ethers.getContractFactory("ERC20")
  const instance = await upgrades.deployProxy(ToolV1, [UNISWAP])
  const dollaCoin = await ERC20.attach(USD_COIN)
  //
  console.log(
    "owner ETH post deploy:",
    (await ethers.provider.getBalance(owner.address)).toString()
  )
  console.log("addr1 $ balance:", (await dollaCoin.balanceOf(addr1.address)).toString())
  console.log("Trading from addr1...")
  await instance.connect(addr1).swapETHForTokens(
    [
      {
        percentage: 100,
        tokenAddress: USD_COIN,
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
