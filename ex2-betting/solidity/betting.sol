pragma solidity ^0.4.24;
// We have to specify what version of compiler this code will compile with
contract BettingDapp{
    uint256 public total=0;
    uint256 private rate=3;
    uint256 private bet_range=3;
    uint256 private cnt=0;
    address private founder_addr=0;
    event betting_result_log(
        address addr,
        uint256 yourbet,
        uint256 result_num,
        uint256 howmuch_wei
    );

    struct Better {
        uint256 deposit_wei;
        uint256 betting_num;
        uint256 result_num;
    }
    
    mapping(address => Better) private balances;
    
    constructor()  public{
        founder_addr=msg.sender;
    }

    function random(uint256 range_num) private view returns (uint256 v) {
    
        uint256 seed = block.timestamp+block.difficulty+cnt+total+block.number;
        v = addmod(seed,0,range_num);
       
    }
    // Get the token balance for account `tokenOwner`
    function balanceOf(address tokenOwner) private constant returns (uint256 balance) {
        Better storage info= balances[tokenOwner];
        return info.deposit_wei;
    }
    
    function getBalanceOfDealer() public constant returns (uint256 v){
        Better storage info= balances[founder_addr];
        return info.deposit_wei;
    }
    function getBalanceOfPlayer() public constant returns (uint256 v){
        Better storage info= balances[msg.sender];
        return info.deposit_wei;
    }
    
    function deposit() public payable {
        balances[msg.sender].deposit_wei += msg.value;
        total +=msg.value;
    }
    
    function () private payable {
        deposit();
    }
    
    function withdrawAll() public {
        uint256 amount = balances[msg.sender].deposit_wei;
        balances[msg.sender].deposit_wei=0;
        msg.sender.transfer(amount);
        total-=amount;
    }
     function withdraw(uint256 howmuch) public {
        uint256 amount = balances[msg.sender].deposit_wei;
        if(howmuch>amount){
            revert();
        }
        balances[msg.sender].deposit_wei-=howmuch;
        msg.sender.transfer(howmuch);
        total-=howmuch;
    }
    
    function betYourNum(uint256 bet_num,uint256 howmuch) public returns( uint256 v) {
        uint256 remain = balances[founder_addr].deposit_wei;
        uint256 amount = balances[msg.sender].deposit_wei;
        uint256 exp_win =rate*howmuch;
        
        cnt++;
        if(howmuch>amount){
            revert();
        }
        if(remain< exp_win){
            revert();
        }
        balances[msg.sender].betting_num=bet_num;
        uint256 res = random(bet_range)+1;
        
        if(res==bet_num){/*win the game*/
            balances[founder_addr].deposit_wei -=exp_win;
            balances[msg.sender].deposit_wei +=exp_win;
        }else{/*loose*/
            balances[founder_addr].deposit_wei +=howmuch;
            balances[msg.sender].deposit_wei -=howmuch;
        }
        balances[msg.sender].result_num=res;
        v= res;
        emit betting_result_log(msg.sender,bet_num,res,howmuch);

    }
    
        
    function betAllYourNum(uint256 bet_num) public returns( uint256 v) {
        
        uint256 remain = balances[founder_addr].deposit_wei;
        uint256 amount = balances[msg.sender].deposit_wei;
        uint256 exp_win =rate*amount;
        balances[msg.sender].betting_num=bet_num;
        
        cnt++;
        if(remain< exp_win){
            revert();
        }
        uint256 res = random(bet_range)+1;
        if(res==bet_num){/*win the game*/
            balances[founder_addr].deposit_wei -=exp_win;
            balances[msg.sender].deposit_wei +=exp_win;
        }else{/*loose*/
            balances[founder_addr].deposit_wei +=amount;
            balances[msg.sender].deposit_wei -=amount;
        }
        balances[msg.sender].result_num=res;
        v= res;
        emit betting_result_log(msg.sender,bet_num,res,amount);
    }
    
    function getResult() public view returns( uint256 bet_num,uint256 final_num){
       final_num= balances[msg.sender].result_num;
       bet_num= balances[msg.sender].betting_num;
    }
    
}