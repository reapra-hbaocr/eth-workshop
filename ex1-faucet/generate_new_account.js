const Web3 = require('web3');
const fs = require('fs');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:58547'));
async function create_new_account(){
    const o_file = __dirname+'/config/faucet-account.js'
    //https://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html
   let acc= await web3.eth.accounts.create(web3.utils.randomHex(32));
    let json_acc = {
        address:acc.address,
        privateKey:acc.privateKey
    }
    let faucet_account='module.exports='+JSON.stringify(json_acc);
    console.log('faucet address: ',json_acc.address);
    fs.writeFileSync(o_file,faucet_account);
}
create_new_account();