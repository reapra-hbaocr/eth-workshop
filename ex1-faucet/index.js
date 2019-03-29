
const Web3 = require('web3');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const fs = require('fs');
const faucet= require('./config/faucet-account');
const app_port=9000;
const bind_ip="0.0.0.0";
const Web3Wrapper = require('./web3_wrapper');
let web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:58547'));
let web3_wrapper = new Web3Wrapper(web3);
const app = express();
//bind the function to the web3_wrapper context then call to avoid losing the this pointer inside this class
let add_account =web3_wrapper.add_account.bind(web3_wrapper);
add_account(faucet.privateKey);

app.use("/", express.static(__dirname + '/web'));//mount root of web to 'web'
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));// parse application/x-www-form-urlencoded
app.listen(app_port, bind_ip, function () {
    console.log('Faucet app listening on ' + bind_ip + ':' + app_port);
});

app.post("/faucet_handler", async (req, response) => {
    let _to = req.body.addr;
    let res={
        isValid:false,
        msg:'none',
        receipt:'none',
    }
    if(_to=='undefined'){
        res.msg='invalid destination adrr';
        response.json(res);
    } else{
        let send_eth=web3_wrapper.send_eth.bind(web3_wrapper);// not to lose the context of this inside
        send_eth(_to,0.5,web3_wrapper.GAS_LIMIT,web3_wrapper.GAS_PRICE)
        .then((receipt)=>{
            console.log(receipt.to + ' req faucet receipt --> ' + receipt.status);
            res.msg='Making Request OK';
            res.isValid=true;
            res.receipt=receipt;

            response.json(res);
        })
        .catch((err)=>{
            res.msg='Making Request Failed';
            res.isValid=false;
            res.receipt=err;
            response.json(res);
        })
    }
})

