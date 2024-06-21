# contracts-deploy

# Running IL product tests

```
yarn il:coverage
```

then open the HTML Coverage report located in directory:

coverage/index.html

# What Typescript Types and ABI File to use:

- ABI: use `getContractsFile` to get the correct abis-file for the current blockchain and network
  What it does?
  1. for Mainnet ABIs: `packages/lw-sdk/src/chain_id_<chain-id>__blockchain_<blockchain>__network_live.json`
  2. for Staging ABIs: find the following file in AWS S3: `chain_id_<chain-id>__blockchain_<blockchain>__network_staging.json`
  3. for Dev ABIs: the following file will be avilable only when running hardhat-nodes using docker-compose `packages/lw-sdk/src/chain_id_<chain-id>__blockchain_<blockchain>__network_dev.json`

1. You develop while running docker-compose of hardhat locally:

   1. Create branch from origin/main
   2. run `yarn start:hardhat-nodes`
   3. Typescript: use GitContractTypes.<contract-name>.ts

2. You want to connect to contracts located in K8S hardhat Staging:

   1. Create branch from origin/main
   2. use GitContractTypes.<contract-name>.ts

3. You want to connect to contracts located in mainnet:
   1. Create branch from origin/main
   2. use <Blockchain-Name><MainnetTypes>.<contract-name>.ts

# History task

```sh
yarn workspace  @coti-cvi/contracts-deploy deployment-history --network PolygonMainnet
```

# How to develop:

1. run `yarn compilations-headquarters` (from root package.json)

# Deploy/Upgrade protocol

[Protocol document](https://docs.google.com/document/d/1sQlq1kLY8HaPkhmucUqVdI55GJ-OUjkuljWB_9hXxnE/edit)

# How to deploy to mainnet:

1. run deploy task with the relevent tags for example 'il-contracts' for contract upgrades or 'il-contracts-set-state' for state update (can be run together or one by one)

```sh
yarn workspace  @coti-cvi/contracts-deploy deploy --tags il-contracts --network PolygonMainnet --description 'Collateral per pair'

# set state is run for example if there is a new pair
yarn workspace  @coti-cvi/contracts-deploy deploy --tags il-contracts-set-state --network PolygonMainnet --description 'Collateral per pair'

# or both together
yarn workspace  @coti-cvi/contracts-deploy deploy --tags il-contracts,il-contracts-set-state --network PolygonMainnet --description 'Collateral per pair'
```

2. defender site - approve proposals in the right order (from bottom right to top left)

3. gnosis safe site -  
   a. approve the rest (only possible after at least one person is approved on defender)  
   b. simulate batch transaction  
   c. execute batch transaction

4. in case upgrades were deployed - need to run deploy (without tags) again after they were executed in gnosis safe to integrate them into deployments

```sh
yarn workspace  @coti-cvi/contracts-deploy deploy --tags none --network PolygonMainnet --description 'Collateral per pair'
```

5. to verify contracts on etherscan need to run deploy with contract tags again with VERIFY=true env var
   - can be done in the initial deployment but its slow so preferably run after

```sh
VERIFY=true yarn workspace  @coti-cvi/contracts-deploy deploy --tags il-contracts --network PolygonMainnet --description 'Collateral per pair'
```

# Theta vault initial liquidity:

Basically run the dependent deployments in '10_set_initial_liquidity' (waiting when needed),  
The deployments will create proposals in defender and will need to be executed in the right order (always token approve first)
Then run rebase deployment to set vol token price to CVI index

1. `yarn workspace @coti-cvi/contracts-deploy deploy --tags set-cvi-usdc-initial-liquidity-submit-deposit --network ArbitrumMainnet --description 'Theta vault deployment'`
2. wait for 30 minutes before running performUpkeep
3. `yarn workspace @coti-cvi/contracts-deploy deploy --tags set-cvi-usdc-initial-liquidity-deposit-upkeep --network ArbitrumMainnet --description 'Theta vault deployment'`
4. `yarn workspace @coti-cvi/contracts-deploy deploy --tags set-cvi-usdc-initial-liquidity-submit-mint --network ArbitrumMainnet --description 'Theta vault deployment'`
5. wait for 60 minutes before running performUpkeep
6. `yarn workspace @coti-cvi/contracts-deploy deploy --tags set-cvi-usdc-initial-liquidity-mint-upkeep --network ArbitrumMainnet --description 'Theta vault deployment'`
7. `yarn workspace @coti-cvi/contracts-deploy deploy --tags set-cvi-usdc-initial-liquidity-add-liquidity-to-pair --network ArbitrumMainnet --description 'Theta vault deployment'`
8. `yarn workspace @coti-cvi/contracts-deploy deploy --tags cvi-usdc-rebase --network ArbitrumMainnet --description 'Theta vault deployment'`
