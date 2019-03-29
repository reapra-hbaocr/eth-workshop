# !/bin/bash
# filename : start_minter.sh
datadir='nodedata'
p2pPort=30303
rpcPort=58545
wsPort=58546
netID=2703
cachesize=512
sealer='0xc9bbe7aad61bb5b586e73ac55841e988d9920d98'
unlockpass='12345678'
echo $unlockpass> $datadir/minterAccoutPass.txt

#./geth --datadir $datadir init genesis.json
./geth --networkid $netID --datadir $datadir --cache $cachesize --port $p2pPort \
--rpc --rpcaddr "0.0.0.0"  --rpcport $rpcPort --rpccorsdomain "*" \
--rpcapi "eth,miner,personal,net,web3,clique"  --ws --wsaddr "0.0.0.0"  \
--wsport $wsPort --wsapi "eth,miner,personal,net,web3,clique" --wsorigins "*" \
--targetgaslimit 4700000 --gasprice 0 --etherbase $sealer --unlock $sealer \
--password $datadir/minterAccoutPass.txt --mine --minerthreads 1
