## Betting Dapp

* At first you should deploy smartcontrol `/solidity/betting.sol` to network the coppy address to use on the web app. The account use to deploy are contract owner and become the dealer in this game.
*  Replace the value of address with the coppied addr from previous step. line 5 of "/web/js/dapp.js" `const contract_addr = '0x0a62514747581f7986f4077835ba56cd154118b2';`

* Run this application
```Sh
cd ex2-betting
npm install
node index.js
```
*  First, dealer should deposit ETH to  this smart contract  to pay for player incase they win the game
*  Player should deposit ETH to this contract to play the game. If the win, they will win 3 times the fund they bet otherwise they lost the fund.
* [Demo link](http://18.136.237.172:9001/betting.html)


