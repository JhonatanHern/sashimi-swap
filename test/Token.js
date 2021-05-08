const { expect } = require("chai")

describe("Token contract", () => {
  let Token, token, owner, addr1, addr2
  beforeEach(async () => {
    Token = await ethers.getContractFactory("Token")
    token = await Token.deploy()
    ;[owner, addr1, addr2, _] = await ethers.getSigners()
  })
  describe("Deployment", () => {
    it("Should set right owner", async () => {
      expect(await token.owner()).to.equal(owner.address)
    })
    it("Should assign tokens to owner", async () => {
      expect(await token.balanceOf(owner.address)).to.equal(await token.totalSupply())
    })
  })
  describe("Transactions", () => {
    it("Should transfer", async () => {
      await token.transfer(addr1.address, 50)
      expect(await token.balanceOf(addr1.address)).to.equal(50)

      await token.connect(addr1).transfer(addr2.address, 50)
      expect(await token.balanceOf(addr1.address)).to.equal(0)
      expect(await token.balanceOf(addr2.address)).to.equal(50)

      expect(await token.balanceOf(owner.address)).to.equal(1000000 - 50)
    })
    it("Should fail if sender is broke", async () => {
      await expect(token.connect(addr1).transfer(owner.address, 1)).to.be.revertedWith(
        "Not enough funds"
      )
    })
  })
})
