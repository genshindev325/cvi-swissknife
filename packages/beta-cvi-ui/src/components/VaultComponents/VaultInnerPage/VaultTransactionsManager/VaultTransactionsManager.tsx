import React from 'react'
import VaultTransactions from './VaultTransactions'

function VaultTransactionsManager() {
  return (
    <div className="flex flex-col md:gap-4 w-full text-white">
      <span className="text-lg">Vault transactions</span>
      <VaultTransactions />
    </div>
  )
}

export default VaultTransactionsManager
