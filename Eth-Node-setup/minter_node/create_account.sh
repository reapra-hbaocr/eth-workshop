# !/bin/bash
datadir='nodedata'
mkdir -p $datadir
./geth --datadir $datadir account new