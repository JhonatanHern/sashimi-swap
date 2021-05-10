# Hi!

V1 is finished. You can see it in action by installing, compiling and executing:

`npx hardhat run scripts/tradeV1.js`

V2 is also done (luckily). You can see it in action by installing, compiling and executing:

`npx hardhat run scripts/tradeV2.js`

This examines the best swap option off-chain and then sends the requests. My script trades USDCoin, you can change it to interact with other tokens.

## Tests

run `npx hardhat test`

V2 isn't tested via unit tests yet. Test it (roughly) with:

`npx hardhat run scripts/tradeV2.js`
