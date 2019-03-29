
let faucet_acc ="0xCCB066376c64c3EdeEde80FB5D6e929F80E63BB7".toLowerCase();
let host="http://127.0.0.1:9000";
$(document).ready(async function() {
    await detect_metamask();
    display_info();
    setInterval(() => {
        if(display_info){
            display_info();
        }
    }, 5000);

    $("#btn_request_eth").click(on_btn_request_eth_click);
});
function on_btn_request_eth_click(){
    let $btn= $(this);
    $btn.button('loading');
    let _to = web3.currentProvider.selectedAddress;
    data={addr:_to};
    let req_link= host+'/faucet_handler';
    do_http_post(req_link,data).then((res)=>{
        $btn.button('reset');
        display_info();
        window.alert(res.data.msg);
    }).catch((err)=>{
        $btn.button('reset');
        display_info();
        window.alert('Error : ' + err.toString());
    });
}
function display_info() {
    if(web3 == 'undefined' ) return;
    let _to = web3.currentProvider.selectedAddress;
    //_selected_addr=_from;
    setHTMLTag('txt_web3api', web3.version);
    setHTMLTag('txt_caddr', _to);

    web3.eth.getBalance(faucet_acc).then((w) => {
        w=web3.utils.fromWei( w.toString()) 
        setHTMLTag('txt_fbalance', w.toString())
    })

    web3.eth.getBalance(_to).then((w) => {
        w=web3.utils.fromWei( w.toString()) 
        setHTMLTag('txt_cbalance', w.toString());
    })
   
    setHTMLTag('txt_faucet', faucet_acc)
  
    web3.eth.getBlockNumber().then((data) => {
        setHTMLTag('txt_blocknum', data);
    })

    setHTMLTag('txt_network', web3.currentProvider.networkVersion);
    web3.eth.net.getNetworkType().then((data) => {
        setHTMLTag('txt_type', data);
    })
}

