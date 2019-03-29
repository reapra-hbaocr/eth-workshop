# !/bin/bash
# filename : start_node.sh
datadir='nodedata'
p2pPort=30304
rpcPort=58547
wsPort=58548
netID=2703
cachesize=512
#./geth --datadir $datadir init genesis.json
./geth --networkid $netID --datadir $datadir --cache $cachesize --port $p2pPort \
--rpc --rpcaddr "0.0.0.0"  --rpcport $rpcPort --rpccorsdomain "*" \
--rpcapi "eth,miner,personal,net,web3,clique"  --ws --wsaddr "0.0.0.0"  \
--wsport $wsPort --wsapi "eth,miner,personal,net,web3,clique" --wsorigins "*" \
--targetgaslimit 4700000 --gasprice 0
