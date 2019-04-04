# EthPoANode

## Setup PoA note [full guide here](https://hackernoon.com/setup-your-own-private-proof-of-authority-ethereum-network-with-geth-9a0a3750cda8)

Note the current geth and pupeth (1.8.2) are OsX binaries, if you want to use with another Os,please replace them with the suitable binaries for your Os  

* In PoA, only authorized miners(assume total N miners) can seal the blocks and get block rewards
* In PoA, authorized miners are defined in genesis block(by genesis.json). This file can be genrated by `pupeth` and choose (Clique mode)
* PoA Clique require (N div 2 + 1) authorized miners/sealers work together to confirm the txs( Each sealer is only accepted one time to seal each period of (N div 2 +1) block, that mean if one sealer recently sealed block, it must wait to next (N div 2 +1) block to seal again). That means, you have to clone N/2 + 1 node (Each node stick with 1 authorized miner account) to run ethereum PoA. For example , If you setup 3 authorized miners in the genesis.json --> you should have 3 div 2 + 1 = 2 node online ( each node stick with one miners account) to confirm Txs and seal new block. 
* In PoA,The miner accounts must be available before in keystore, and user must unlock the miners account before starting mining( by passwords)
* This repo using geth https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.8.2-b8b9f7f4.tar.gz

---
## Dirty Tip:

* To prevent the reset number of prefunded ETH to 0 (magic bug), **the pre-funded account must be  different from the sealer**
* PoA of Geth is different from PoA of Parity. so they can not work together
---
## [Geth PoA Algorithm](https://github.com/ethereum/EIPs/issues/225) In short, the facts for a system with N sealers:

* Every block has a preferred sealer (in-turn signing), which will set the block difficulty to 2
* If the preferred sealer does not sign the block, other sealers can jump in (out-of-turn), but they can set the block difficulty only to 1
* The preferred sealer is switching by applying round-robin
* The forks still can happen, the heaviest chain (-> block difficulties added) will win (-> GHOST-protocol)
* Out-of-turn sealers will delay they block proposal, in order to give the in-turn sealer a better chance to get his proposal propagated through the network.
* When a sealer in Clique signs a block, he is not allowed to seal the next floor(N / 2) blocks

---
## [To remove or add sealers on the fly](https://ethereum.stackexchange.com/questions/15541/how-to-add-new-sealer-in-geth-1-6-proof-of-authority?noredirect=1&lq=1) :

* The sealers are preconfigured in extra field of genesis.json when launching the PoA blockchain network. However they can be remove or add new by using the **Clique** protocol ( must be active when run the node along with web3,rpc,admin,clique,...)
* Sealer on a PoA is like a miner on PoW. You start a sealer with geth --mine --unlock "0xa132432bf" with a genesis using the clique consensus. The initial sealers are defined in the genesis block.

  * List sealers **clique.getSigners()**
  * List propositions: **clique.proposals**
  * Discard a proposition: **clique.discard**("0x1234234234234")
  * Add a new sealer: **clique.propose**("0x1234243214312", true)
  * Remove a sealer: **clique.propose**("0x1234243214312", false)
* So if you want to add a new sealer: **you must use geth attach on > 50% of your sealers**. Do a proposition with **clique.propose** . Wait few minutes and check state with **clique.getSigners()**. When the operation is completed, you can discard your proposition with **clique.discard**.
* PS: you must use clique commands on sealers


---
## [Specail case](https://github.com/ethereum/go-ethereum/issues/16641) :

In private PoA (clique) network with 2 instances of 1 sealer, mining produces blocks of equal hash, ERROR messages " Impossible reorg"."2 instances of 1 sealer" means chain was created with 1 sealer. For better network stability one more instance of the sealer is run.
* OK, I tried setting up `--identity` option, the result hash was the same.
**Then using `--extradata`, e.g. `--extradata node2` resulted in different hash produced.** to make the hash different on each instance of sealer


