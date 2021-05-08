pragma solidity ^0.8.0;

interface IUniswap {
    function swapExactETHForTokens(
      uint amountOutMin,
      address[] calldata path,
      address to,
      uint deadline
    )
    external
    payable
    returns (uint[] memory amounts);

    function WETH() external pure returns (address);
}

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract ToolV1 {
  IUniswap uniswap; // router02
  address owner;
  address weth;
  constructor(address _uniswap){
    uniswap = IUniswap(_uniswap);
    weth = IUniswap(_uniswap).WETH();
    owner = msg.sender;
  }
  // https://uniswap.org/docs/v2/smart-contracts/router02/#swapexactethfortokens
  function swapETHForToken(address token) public payable{
    uint comission = msg.value / 1000; // 0.1%
    uint ethToSend = msg.value - comission;
    address[] memory path = new address[](2);
    path[0] = weth;
    path[1] = token;
    uniswap.swapExactETHForTokens{ value: ethToSend }
    (
      1,
      path,
      tx.origin,
      block.timestamp + 1 hours
    );
    payable(owner).transfer(comission);
  }
}
