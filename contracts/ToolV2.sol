pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IUniswap {
    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function WETH() external pure returns (address);
}

contract ToolV2 is Initializable {
    IUniswap uniswap; // router02
    address owner;
    address weth;

    struct TokenSwapRequest {
        uint256 percentage;
        address tokenAddress;
        uint256 dexID; // 0 for uniswap, 1 for balancer. Not doing string comparison because expensive
    }

    function initialize(address _uniswap) public initializer {}

    // https://uniswap.org/docs/v2/smart-contracts/router02/#swapexactethfortokens
    function swapETHForToken(
        address token,
        uint256 value,
        uint256 dex
    ) private {
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = token;
        if (dex == 0) {
            // zero => uniswap
            uniswap.swapExactETHForTokens{value: value}(
                1,
                path,
                msg.sender,
                block.timestamp + 1 hours
            );
        } else {
            // dex == 1 // balancer
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
