# !/bin/bash
# filename : init_node.sh
datadir='nodedata'
mkdir -p $datadir
./geth --datadir $datadir init genesis.json


