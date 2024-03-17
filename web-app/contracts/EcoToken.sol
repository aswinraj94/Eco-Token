// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ECOToken is IERC20{
    uint256 public totalSupply;

    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    mapping(address => uint256) public Claim;
	
	mapping(address => bool) public IsEcoFriendly;

    mapping(address => uint256) public LastECOTransaction;

	string public name ;
    string public symbol;
    uint8 public decimals ;
	address private _owner;


	
	event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


	
    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == _owner;
    }
	
    constructor(
	    uint256 _totalSupply,
        string memory _tokenName,
        uint8 _decimalUnits,
        string memory _tokenSymbol) {
        
		
        symbol = _tokenSymbol;
        name = _tokenName;
        decimals = _decimalUnits;
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = _totalSupply;
		_owner = msg.sender;
        emit Transfer(address(0), msg.sender, _totalSupply);
		emit OwnershipTransferred(address(0), _owner);
    }	

    function transfer(address recipient, uint amount) external returns (bool) {
		require(balanceOf[msg.sender]>=amount,"Not enough Balance");
		if(IsEcoFriendly[recipient] == true)
        {
            Claim[recipient]=100;
            LastECOTransaction[recipient]=block.timestamp;
        }
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;

        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address spender,
        address recipient,
        uint amount
    ) external returns (bool) {
		require(balanceOf[spender]>=amount,"Not enough Balance");
        balanceOf[spender] -= amount;
        balanceOf[recipient] += amount;
		if(IsEcoFriendly[recipient] == true)
        {
            Claim[recipient]=100;
            LastECOTransaction[recipient]=block.timestamp;
        }
        emit Transfer(spender, recipient, amount);
        return true;
    }


    function ClaimToken() public{
        uint256 ClaimAmount=Claim[msg.sender];
        uint256 TimeFromLastECOTransaction;

        TimeFromLastECOTransaction=block.timestamp-LastECOTransaction[msg.sender];

        ClaimAmount = ClaimAmount / (TimeFromLastECOTransaction/ 4 weeks );

        require(Claim[msg.sender]>0,"No Claim Amount");
        totalSupply += ClaimAmount;
        balanceOf[msg.sender] += ClaimAmount;
    }

    function mint(uint amount) private onlyOwner{
        balanceOf[msg.sender] += amount;

        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    function burn(uint amount) private onlyOwner{
        balanceOf[msg.sender] -= amount;

        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }


}