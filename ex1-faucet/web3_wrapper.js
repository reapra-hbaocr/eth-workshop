class Web3Wrapper {
    constructor(web3_instance) {
        this.web3 = web3_instance;
        this.GAS_LIMIT = '47000';
        this.GAS_PRICE = '20000000000'; //20 gwei
    }
    add_account(_prvKey) {
        let _web3 = this.web3;
        const account = _web3.eth.accounts.privateKeyToAccount(_prvKey);
        _web3.eth.accounts.wallet.add(account);
        _web3.eth.defaultAccount = _web3.eth.accounts[0];
        return _web3;
    }
    send_eth(to_addr, howmuch_eth, gaslimit, gasprice) {
        let _web3 = this.web3;
        let _from = _web3.eth.accounts.wallet[0].address;
        let _gasLimit = gaslimit;
        let _gasPrice = gasprice;
        let _opt = {
            from: _from,
            to: to_addr.toLowerCase(),
            gas: _gasLimit,//gas limitted
            gasPrice: _gasPrice, // default gas price in wei, 20 gwei in this case
            value: _web3.utils.toBN(_web3.utils.toWei(howmuch_eth.toString(), "ether"))// 1 ETH
        }
        return _web3.eth.sendTransaction(_opt);
    }

}
module.exports=Web3Wrapper;