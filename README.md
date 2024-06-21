![Main Build](https://codebuild.eu-west-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoieVJOMm44ZEZNSVY1VjI5SXBsY056MmNDN1JZak5ldC9QK09ENWFvZnFtM2hlU1dpTUVVaHA2WXZJbmw4ZXluRi9DSDVLcDNldDVtSG1oT25NZWpKSU9ZPSIsIml2UGFyYW1ldGVyU3BlYyI6Im9yRTJaUVozZ1pDWFVmYUwiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=main)

# CVI-Swissknife

https://armadillo.is

Internal Tools:

1. https://traders-ui.surge.sh - (Legacy cvi.finance) platform traders info panel
2. https://il-cli-ui.surge.sh - CLI tool available in browser UI format
3. https://hardhat-csm-ui.surge.sh - Manipulate hardhats: move time ahead, Impersonate accounts, Change Oracle values
4. https://il-formulas-ui.surge.sh - Charts relevant to IL premium, numbers etc.
5. https://il-admin-panel-ui.surge.sh - Tool to Administrate and View IL product usage metrics for admins
6. https://il-payout-formula-ui.surge.sh

# Adding support for a new PAIR

il-backend is the service that enables showing meta-data on armadillo.is as far as the maximum IL seen
per pair. When the whole IL project needs support for a new pair, for example, needs support for allow IL
protection for LINK/ETH as well, we need to add this pair and start collecting IL history data for it.

The below guide explains how to support additional pairs:

[Guide for adding support for additional pair/s](ADDING-SUPPORT-FOR-NEW-PAIR.md)

# Packages / Tools

Currently it has the following packages or tools:

- **delta-neutral**: Gets the current platform metrics (like total LONG/Short positions, staked amounts etc) and the current user's ACCOUNTS positions and simulates or tries to find the equilibrium point that will result in a Delta Neutral strategy.

- **traders-ui**: https://traders-ui.surge.sh
- **beta-cvi-ui**: https://beta-cvi-client-coti-cvi.vercel.app

# Installation

```bash
yarn install
```

## Using K8S Helm Staging Nodes

1. Ethereum (chain-id = 31337) - https://hardhat-ethereum.cvi-team.com
2. Polygon (chain-id = 31338) - https://hardhat-polygon.cvi-team.com
3. Arbitrum (chain-id = 31339) - https://hardhat-arbitrum.cvi-team.com

## Run Staging Nodes Locally

To run Ethereum, Polygon and Arbitrum staging nodes locally: run `yarn start:hardhat-nodes`

1. Eth: http://0.0.0.0:8545 (Chain ID=31337)
2. Polygon: http://0.0.0.0:8546 (Chain ID=31338)
3. Arbitrum: http://0.0.0.0:8547 (Chain ID=31339)

---

# Add Liquidity to Armadillo:

1. login to https://gnosis-safe.io/app with your wallet in Polygon mainnet (need to be added manually by admins)
2. click on: "New Transaction"
3. click on: "Contract interaction"
4. go to file: `packages/lw-sdk/deployments/PolygonMainnet/ILProtectionController.json`
5. contract address: <"address">
6. contract ABI: <"abi">
7. Method: "addLiquidity"
8. how much you want to transfer from the Gnosis Safe to the IL liquidity: 1$ -->> 1000000 (6 zeros)
9. Review
10. Sign
11. tell some one else to sign as well (he may need to refresh)
12. execute (you/he may need to refresh again)

# Add Liquidity to CVI Theta Vault:

1. login to https://gnosis-safe.io/app with your wallet in Arbitrum mainnet (need to be added manually by admins)
2. click on: "New Transaction"
3. click on: "Contract interaction"
4. go to file: `packages/lw-sdk/deployments/ArbitrumMainnet/CVIUSDCThetaVault.json`
5. contract address: <"address">
6. contract ABI: <"abi">
7. Method: "submitDepositRequest"
8. how much you want to transfer from the Gnosis Safe to the IL liquidity: 1$ -->> 1000000 (6 zeros)
9. Review
10. Sign
11. tell some one else to sign as well (he may need to refresh)
12. execute (you/he may need to refresh again)

# Chainlink Keepers Registering

Below section describes configured ChainLink Keeprs

## ThetaVault V3 ChainLink Keepers configured on October 2022!!

Configuring Keepers: 0xE791ed54CA549F98122ffe3412E10D2dc11D63E2 is owner (Ami Gnosis Safe Key)...

1.  - https://automation.chain.link/arbitrum/54076871737374261561092539699222305782496286421621941727275875392991188916993 - Performs Upkeep on CVIUSDCRebaser - does VT rebase at 0:00 ETC every day

2.  0xE791ed54CA549F98122ffe3412E10D2dc11D63E2 is owner (Ami Gnosis Safe Key) - https://automation.chain.link/arbitrum/50018013766417637132435096458169271990890860399278336634759091738239353048133 - Performs Upkeep on CVIUSDCThetaVaultRequestFulfiller (AKA 0x72D4c4eC814C68ECD9825C0B0e41f5aA66704Bd7) - every new block (Custom Keeper)

3.  0xE791ed54CA549F98122ffe3412E10D2dc11D63E2 is owner (Ami Gnosis Safe Key) - https://automation.chain.link/arbitrum/20198168252319728848760903952107283696236297951293825648637958790323057786550 - Performs VolTokenUpKeep on CVIUSDCVolTokenRequestFulfiller (AKA 0x6902bB81dC4F30408B801540f5924550cbee8D24) - every new block (Custom Keeper)

# Example URL for accessing a pod internally in K8s (within inside the cluster)

http://il-monitor-polygon-mainnet-0.il-monitor-polygon-mainnet.default.svc.cluster.local:80

# License

This is an Internal Tool of CVI team currently.

---

# increase TV USDC Limit:

1. go to cvi vault in multisig
2. go to new transaction -> custom transaction
3. get the address of `<search: "cviusdcthetavault" in "packages/auto-generated-code/src/single-live-deployment-files/chain_id_42161__blockchain_arbitrum__network_live.json">`
4. get the ABI from the same place and copy it to the ABI section in the UI
5. change the "Contract Method Selector" to: "set deposit cap"
6. set value to `<usdc>000000`
7. click on "add transaction"
8. click on "create-batch"
9. Run simulate
10. click on "Send batch"
11. click on "submit"

# manual rebase:

1. go to cvi vault in multisig
2. go to new transaction -> custom transaction
3. get the address of `<search: "cviusdcrebaser" in "packages/auto-generated-code/src/single-live-deployment-files/chain_id_42161__blockchain_arbitrum__network_live.json">`
4. get the ABI from the same place and copy it to the ABI section in the UI
5. change the "Contract Method Selector" to: "rebase"
6. click on "add transaction"
7. click on "create-batch"
8. Run simulate
9. click on "Send batch"
10. click on "submit"
