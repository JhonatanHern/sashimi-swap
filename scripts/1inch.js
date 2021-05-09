const axios = require("axios")

const encodeParams = (params) => {
  const res = []
  for (const key in params) {
    res.push(`${key}=${params[key]}`)
  }
  return "?" + res.join("&")
}

const main = async () => {
  const params = encodeParams({
    fromTokenAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH address
    toTokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // Your token
    amount: "100000000000000000", // 1 ether
  })
  let result = await axios.get("https://api.1inch.exchange/v3.0/1/quote" + params)
  console.log("result:", result.data.protocols[0][0][0])
}

try {
  main()
} catch (e) {
  console.log(e)
}
