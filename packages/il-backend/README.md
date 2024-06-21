### https://il-backend.cvi-team.com

IL backend is the Impermanent Loss product's backend.

It is used for:

- Throttling Zapper API access - Zapper is used to gain Defi liquidity providing positions for a wallet. We access it using SmartProxy (see below)
  to avoid getting HTTP status code 429!

- Perform batch operations such as calculate a specific pair worse IL, gain historic data info etc. We do this by accessing thegraph api and looking
  at uniswap contracts for the pairs we support. See in config under "ilBackend.supportedPairContracts" key!

- Perform upkeep every minute or so, in place of using Chaninlink's upkeep, i.e: a temp. solution, instead of using Chainlink to register our contract
  for the performance of schudeled tasks, il-backend will do this for us in a centralized manner. See https://cryptomarketpool.com/implement-upkeep-using-chainlink-keepers/. This is temporary solution, long-term solution would be to add the contract to Registery.
  Manual solution offered here will have to call checkUpkeep of the relevant IL contract and whenever upkeep is
  needed, it will have to call performUpkeep.

**NOTE:** il-backend accesses Zapper API (https://docs.zapper.fi), which is a public API so everyone using it uses a
hardcoded api_key, there are no subscription plans for it. To avoid "429 too many requests" HTTP responses, we are using
a paid proxy service from https://www.smartproxy.com at 75 USD per month, credentials: finance@coti.io / {0tSkCZ4%0%8r>JZilq2

Use https://dashboard.smartproxy.com with the above credentials for any creation of new proxy end-points, etc.

See the proxy usage in config under "zapper.proxy" key.

**NOTE:** To add a new pair, edit CONTRACT_ADDRESSES. See note below for more info.

**NOTE:** To find that contract of the pair in UniSwap in order to get the contractAddress for CONTRACT_ADDRESSES you can go to Uniswap's factory contract at: https://etherscan.io/address/0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f#readContract, click on "Contract" tab, click on "Read Contract" and use the addresses of the tokens you wish to add contrect for.
