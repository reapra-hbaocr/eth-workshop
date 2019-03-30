

$(document).ready(async function () {
    await detect_metamask();
    init_smart_contract();
    display_info();
    setInterval(() => {
        if (display_info) {
            display_info();
        }
    }, 2000);

    $("#btnDeposit").click(on_btn_deposit);
    $('#btnGetBankerBalance').click(on_btn_getbanker_balance);
    $('#btnGetPlayerBalance').click(on_btn_getplayer_balance);
    $('#btnWithDraw').click(on_btn_withdraw);
    $('#btnBet').click(on_btn_betting_number);
});

function on_btn_betting_number(){
    let eth_fund= getHTMLTag('txtHowMuch');
    let bet_num= getHTMLTag('txtBetNum');
    if(eth_fund<=0){
        alert('Invalid betting fund');
        return;
    }
    if((bet_num<1)||(bet_num>3)){
        alert('Invalid betting number.It should be 1-3');
        return;
    }
    let $btn = $(this);
    $btn.button('loading');
    betYourNum(bet_num,eth_fund).then((res) => {
        if(res.ret.receipt.status){
            let fund_wei = res.ret.event_logs[0].events[3].value;
            let result_num = res.ret.event_logs[0].events[2].value;
            let y_num = res.ret.event_logs[0].events[1].value;
            let addr=res.ret.event_logs[0].events[0].value;
    
            let msg = "Result : ";
            let crlf="\r\n"
            if(y_num==result_num){
                msg=msg+"you win"+crlf;
            }else{
                msg=msg+"you lose"+crlf;
            }
            msg=msg+"your address="+addr+crlf;
            msg=msg+"your betting number="+y_num+crlf;
            msg=msg+"contract result number="+result_num+crlf;
            msg=msg+"your betting fund= "+ web3.utils.fromWei(fund_wei);
            alert(msg);
        }else{
            alert('Receipt status : '+ res.ret.receipt.status);
        }
       
        console.log(res);
        $btn.button('reset');     
    }).catch((err)=>{
        alert('Error')
        $btn.button('reset');
        console.error(err);
    });

}
function on_btn_withdraw(){
    let $btn = $(this);
    $btn.button('loading');
    let howmuch_eth = getHTMLTag('txtWithDraw');
    if(howmuch_eth<=0){
        alert('Invalid withdraw number');
    }else{
        withdraw(howmuch_eth).then((res) => {
            alert('send Tx Ok. Receipt status : '+ res.ret.receipt.status);
            console.log(res);
            $btn.button('reset');     
        }).catch((err)=>{
            alert('Error')
            $btn.button('reset');
            console.error(err);
        });
    }
}
function on_btn_getplayer_balance() {
    let $btn = $(this);
    $btn.button('loading');
    getBalanceOfPlayer().then((w) => {
        w = web3.utils.fromWei(w.toString())
        setHTMLTag('txtPlayer', w.toString());
        $btn.button('reset');     
    }).catch((err)=>{
        $btn.button('reset');
        console.error(err);
    });
}
function on_btn_getbanker_balance() {
    let $btn = $(this);
    $btn.button('loading');
    getBalanceOfDealer().then((w) => {
        w = web3.utils.fromWei(w.toString())
        setHTMLTag('txtBanker', w.toString());
        $btn.button('reset');     
    }).catch((err)=>{
        $btn.button('reset');
        console.error(err);
    });
}
function on_btn_deposit() {
    let $btn = $(this);
    $btn.button('loading');
    let howmuch_eth = getHTMLTag('txtDeposit');
    if (howmuch_eth <= 0) {
        alert('Not support negative deposit number');
    } else {
        deposit(howmuch_eth).then((ret) => {
            $btn.button('reset');
            alert('Deposit Successfully ' + howmuch_eth + ' ETH');
            console.log(ret);
            display_info();
        }).catch((err) => {
            $btn.button('reset');
            alert('Deposit Failed ');
            console.log(err);
        });
    }
}

function display_info() {
    if (web3 == 'undefined') return;
    let _player = web3.currentProvider.selectedAddress;
    //_selected_addr=_from;
    setHTMLTag('txt_web3api', web3.version);
    setHTMLTag('txt_yaddr', _player);

    web3.eth.getBalance(contract_addr).then((w) => {
        w = web3.utils.fromWei(w.toString())
        setHTMLTag('txt_balance_contract', w.toString())
    })

    web3.eth.getBalance(_player).then((w) => {
        w = web3.utils.fromWei(w.toString())
        setHTMLTag('txt_ybalance', w.toString());
    })

    setHTMLTag('txt_contract', contract_addr)

    web3.eth.getBlockNumber().then((data) => {
        setHTMLTag('txt_blocknum', data);
    })

    setHTMLTag('txt_network', web3.currentProvider.networkVersion);
    web3.eth.net.getNetworkType().then((data) => {
        setHTMLTag('txt_type', data);
    })

    getBalanceOfDealer().then((w) => {
        w = web3.utils.fromWei(w.toString())
        setHTMLTag('txtBanker', w.toString());
    }).catch(console.error);

    getBalanceOfPlayer().then((w) => {
        w = web3.utils.fromWei(w.toString())
        setHTMLTag('txtPlayer', w.toString());
    }).catch(console.error);
}

