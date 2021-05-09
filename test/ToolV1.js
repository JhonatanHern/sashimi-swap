const { expect } = require("chai")

const UNISWAP = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
const USD_COIN = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"

describe("Token contract", () => {
  let ToolV1, toolv1, owner, addr1, addr2, ERC20, dollaCoin
  beforeEach(async () => {
    ERC20 = await ethers.getContractFactory("ERC20")
    dollaCoin = await ERC20.attach(USD_COIN)
    ToolV1 = await ethers.getContractFactory("ToolV1")
    toolv1 = await upgrades.deployProxy(ToolV1, [UNISWAP])
    ;[owner, addr1, addr2, _] = await ethers.getSigners()
  })
  // describe("Deployment", () => {
  //   it("Should set right owner", async () => {
  //     expect(await toolv1.owner()).to.equal(owner.address)
  //   })
  // })
  describe("Can trade", () => {
    it("gives back the required token(s)", async () => {
      const originalDollaBalance = await dollaCoin.balanceOf(owner.address)
      expect(originalDollaBalance).to.equal(0)
      const message = await toolv1.sayHi()
      expect(message).to.equal("Hello V1")
      await toolv1.swapETHForTokens(
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
      const newDollaBalance = await dollaCoin.balanceOf(owner.address)
      // check that our USDCoin balance changed
      expect(newDollaBalance).to.not.equal(0)
    })
  })
})
