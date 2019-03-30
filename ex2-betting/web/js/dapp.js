const GAS_LIMIT = '70000';
const GAS_PRICE = '20000000000'; //20 gwei
const TIMEOUT = 30;

const contract_addr = '0x0a62514747581f7986f4077835ba56cd154118b2';
const contract_abi = [
	{
		"constant": true,
		"inputs": [],
		"name": "total",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "howmuch",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "withdrawAll",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "bet_num",
				"type": "uint256"
			},
			{
				"name": "howmuch",
				"type": "uint256"
			}
		],
		"name": "betYourNum",
		"outputs": [
			{
				"name": "v",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getBalanceOfPlayer",
		"outputs": [
			{
				"name": "v",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getBalanceOfDealer",
		"outputs": [
			{
				"name": "v",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getResult",
		"outputs": [
			{
				"name": "bet_num",
				"type": "uint256"
			},
			{
				"name": "final_num",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "bet_num",
				"type": "uint256"
			}
		],
		"name": "betAllYourNum",
		"outputs": [
			{
				"name": "v",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "addr",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "yourbet",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "result_num",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "howmuch_wei",
				"type": "uint256"
			}
		],
		"name": "betting_result_log",
		"type": "event"
	}
];
let contract = null;
// abidecoder.decodeLogs(txReceipt.logs)
function init_smart_contract() {
	contract = new web3.eth.Contract(contract_abi, contract_addr);
	abiDecoder.addABI(contract_abi);// lib for decode transaction receipt.logs
}
function wait_for_receipt(txhash, cb, timeoutsec = GAS_PRICE, periodsec = 5) {
	let err = null;
	let result = null;
	if (timeoutsec > 0) {
		timeoutsec = timeoutsec - periodsec;
	} else {
		err = 'timeout';
		cb(err, result);
		return;
	}
	web3.eth.getTransactionReceipt(txhash, (error, res) => {
		if (error) {
			cb(error, result);
		} else {
			if (res) {
				let logs = abiDecoder.decodeLogs(res.logs);
				let ret = {
					receipt: res,
					event_logs: logs,
				}
				cb(null, ret);
			} else {
				setTimeout(() => {
					wait_for_receipt(txhash, cb, timeoutsec, periodsec);
				}, periodsec * 1000);
			}
		}
	})
}
function getBalanceOfDealer() {
	let _fromaddr = web3.currentProvider.selectedAddress;
	return contract.methods.getBalanceOfDealer().call({ from: _fromaddr });
}
function getBalanceOfPlayer() {
	let _fromaddr = web3.currentProvider.selectedAddress;
	return contract.methods.getBalanceOfPlayer().call({ from: _fromaddr });
}
function getResult() {
	let _fromaddr = web3.currentProvider.selectedAddress;
	return contract.methods.getResult().call({ from: _fromaddr });
}
function deposit(howmuch_eth) {
	return new Promise((resolve, reject) => {
		let _fromaddr = web3.currentProvider.selectedAddress;
		let opt = {
			from: _fromaddr,
			gas: GAS_LIMIT,//gas limitted
			gasPrice: GAS_PRICE, // default gas price in wei, 20 gwei in this case
			//value:'0'
			value: web3.utils.toBN(web3.utils.toWei(howmuch_eth.toString(), "ether")),//this.web3.utils.toBN(0)//no need transfer with value of ETH
		}
		contract.methods.deposit().send(opt)
			.on('transactionHash', (hash) => {
				wait_for_receipt(hash, (err, ret) => {
					if (err == null) {
						r = {
							isValid: true,
							ret: ret
						}
						return resolve(r)
					} else {
						r = {
							isValid: false,
							ret: ret
						}
						return reject(r);
					}
				})
			})
			.on('error', (err) => {
				r = {
					isValid: false,
					ret: err
				}
				return reject(r);
			});
	});

}

function withdraw(howmuch_eth) {
	let wei = web3.utils.toWei(howmuch_eth.toString(), "ether")
	return new Promise((resolve, reject) => {
		let _fromaddr = web3.currentProvider.selectedAddress;
		let opt = {
			from: _fromaddr,
			gas: GAS_LIMIT,//gas limitted
			gasPrice: GAS_PRICE, // default gas price in wei, 20 gwei in this case
			value: '0'
			//value: web3.utils.toBN(web3.utils.toWei(howmuch_eth.toString(), "ether")),//this.web3.utils.toBN(0)//no need transfer with value of ETH
		}
		contract.methods.withdraw(wei).send(opt)
			.on('transactionHash', (hash) => {
				wait_for_receipt(hash, (err, ret) => {
					if (err == null) {
						r = {
							isValid: true,
							ret: ret
						}
						return resolve(r)
					} else {
						r = {
							isValid: false,
							ret: ret
						}
						return reject(r);
					}
				})
			})
			.on('error', (err) => {
				r = {
					isValid: false,
					ret: err
				}
				return reject(r);
			});
	});

}


function betYourNum(bet_num, howmuch_eth) {
	return new Promise((resolve, reject) => {
		let _fromaddr = web3.currentProvider.selectedAddress;
		let opt = {
			from: _fromaddr,
			gas: GAS_LIMIT,//gas limitted
			gasPrice: GAS_PRICE, // default gas price in wei, 20 gwei in this case
			value: '0'
			//value: web3.utils.toBN(_web3.utils.toWei(howmuch_eth.toString(), "ether")),//this.web3.utils.toBN(0)//no need transfer with value of ETH
		}
		let bet_fund =web3.utils.toWei(howmuch_eth.toString(), "ether");
		contract.methods.betYourNum(bet_num,bet_fund).send(opt)
		.on('transactionHash', (hash) => {
			wait_for_receipt(hash, (err, ret) => {
				if (err == null) {
					r = {
						isValid: true,
						ret: ret
					}
					return resolve(r)
				} else {
					r = {
						isValid: false,
						ret: ret
					}
					return reject(r);
				}
			})
		})
		.on('error', (err) => {
			r = {
				isValid: false,
				ret: err
			}
			return reject(r);
		});
});
}