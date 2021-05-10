pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./interfaces.sol";

contract ToolV2 is Initializable {
    IUniswap uniswap; // router02
    address public owner;
    address weth;
    Registry registry; // Pool registry for Balancer

    struct TokenSwapRequest {
        uint256 percentage;
        address tokenAddress;
        uint256 dexID; // 0 for uniswap, 1 for balancer. Not doing string comparison because expensive
    }

    function initialize(address _uniswap) public initializer {}

    function setRegistry(address _registry) public {
        require(msg.sender == owner, "Accress forbidden");
        registry = Registry(_registry);
    }

    // https://uniswap.org/docs/v2/smart-contracts/router02/#swapexactethfortokens
    function swapETHForToken(
        address token,
        uint256 value,
        uint256 dex
    ) private {
        if (dex == 0) {
            // zero => uniswap
            address[] memory path = new address[](2);
            path[0] = weth;
            path[1] = token;
            uniswap.swapExactETHForTokens{value: value}(
                1,
                path,
                msg.sender,
                block.timestamp + 1 hours
            );
        } else {
            address bestPool = registry.getBestPoolsWithLimit(
                weth,
                token,
                1
            )[0];
            uint256 price = BPool(bestPool).getSpotPrice(weth, token);
            WETH9(weth).deposit{value: value}();
            WETH9(weth).approve(bestPool, value);

            (uint256 tokenAmountOut, uint256 spotPriceAfter) = BPool(bestPool)
                .swapExactAmountIn(weth, value, token, 0, (110 * price) / 100);
            ERC20(token).transfer(msg.sender, tokenAmountOut);
        }
    }

    function swapETHForTokens(TokenSwapRequest[] calldata request)
        public
        payable
    {
        uint256 comission = msg.value / 1000; // 0.1%
        uint256 amountToSpend = msg.value - comission;
        for (uint8 i = 0; i < request.length; i++) {
            swapETHForToken(
                request[i].tokenAddress,
                (request[i].percentage * amountToSpend) / 100,
                request[i].dexID
            );
        }
        payable(owner).transfer(address(this).balance);
    }

    function sayHi() public pure returns (string memory) {
        return "Hello V2";
    }
}
