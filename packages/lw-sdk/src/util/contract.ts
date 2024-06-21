import { ethers } from 'ethers'
import { CustomError, ErrorKind } from '../custom-error'
import type { Contracts } from '../types'

function enhanceErrorHandling<T extends ethers.Contract>({
  contract,
  contractName,
  contractAddress,
}: {
  contract: T
  contractName?: string
  contractAddress: string
}): T {
  for (const funcName of [...Object.keys(contract.functions), 'queryFilter']) {
    const originalFunctionPointer = contract[funcName].bind(contract)
    async function wrapper(...args: unknown[]) {
      try {
        return await originalFunctionPointer(...args)
      } catch (error) {
        throw new CustomError({
          name: 'contract-error',
          errorKind: ErrorKind.SystemError,
          cause: error,
          message:
            contractName === undefined
              ? `Error originated from function: "${funcName}" in contract-address: "${contractAddress}"`
              : `Error originated from function: "${funcName}" in contract: "${contractName}" ("${contractAddress}")`,
          extras: {
            arguments: args,
          },
        })
      }
    }
    // @ts-ignore
    contract[funcName] = wrapper
    if (funcName !== 'queryFilter') {
      contract.functions[funcName] = wrapper
    }
  }
  return contract
}

export const getContractFromDeploymentsFolder = <T extends ethers.Contract>({
  contracts,
  contractName,
  signerOrProvider,
}: {
  contracts: Contracts
  contractName: string
  signerOrProvider: ethers.Signer | ethers.providers.Provider
}): T => {
  const contract = contracts[contractName]
  if (!contract) {
    throw Error(`${contractName} missing from contracts file`)
  }
  if (!contract.address) {
    throw Error(`${contractName} address missing from contract`)
  }
  if (!contract.abi) {
    throw Error(`${contractName} missing abi from contract`)
  }
  const contractInterface = new ethers.utils.Interface(JSON.stringify(contract.abi))
  const contractAddress = contract.address
  return new ethers.Contract(contractAddress, contractInterface, signerOrProvider) as T
  // return enhanceErrorHandling({
  //   contract: new ethers.Contract(contractAddress, contractInterface, signerOrProvider) as T,
  //   contractName,
  //   contractAddress,
  // })
}

export const getContractFromAddressAndAbi = <T extends ethers.Contract>(
  contractAddress: string,
  abi: unknown[],
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
  contractName?: string,
): T => {
  const contractInterface = new ethers.utils.Interface(JSON.stringify(abi))
  return new ethers.Contract(contractAddress, contractInterface, signerOrProvider) as T
  // return enhanceErrorHandling({
  //   contract: new ethers.Contract(contractAddress, contractInterface, signerOrProvider) as T,
  //   contractAddress,
  //   contractName,
  // })
}
