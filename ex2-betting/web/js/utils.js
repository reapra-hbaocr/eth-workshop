function setHTMLTagTextColor(tagId, color) {
    document.getElementById(tagId).style.color = color;
}
function setHTMLTag(tagId, info_str) {
    document.getElementById(tagId).innerHTML = info_str;
}
function getHTMLTag(tagId) {
    return document.getElementById(tagId).value;
}
function connect() {
    if (typeof ethereum !== 'undefined') {
        ethereum.enable()
            .catch(console.error)
    }
}

async function detect_metamask(){
    if (window.ethereum) {// Modern dapp browsers...
        window.web3 = new Web3(ethereum);
        try {
            await ethereum.enable();  //  // Request account access if needed.Acccounts now exposed     
        } catch (error) {
            console.log(error);
        }
    } else if (window.web3) {//  Legacy dapp browsers...
        window.web3 = new Web3(web3.currentProvider);
    } else {  // Non-dapp browsers...
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
}

//post link inclue cookies also
function do_http_post(link, js_obj, header_opt) {
    let req_header = {};
    if (header_opt) {
        req_header = {
            headers: header_opt
        };
    } else {
        req_header = {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        };
    }
    return axios.post(link, js_obj, req_header);
}
