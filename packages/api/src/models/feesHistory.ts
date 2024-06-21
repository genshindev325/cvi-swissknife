import type { Model } from 'sequelize'
import { DataTypes } from 'sequelize'
import sequelize from '../services/sequelize'

export interface FeesHistory {
  blockNumber: number
  timestamp: number
  tokenAddress: string
  token: string
  amount: string
  account: string
  chain: string
  chain_id: number
  hash: string
}

export const FeesHistoryModel = sequelize.define<Model<FeesHistory>>(
  'FeesHistory',
  {
    blockNumber: DataTypes.INTEGER,
    timestamp: DataTypes.INTEGER,
    tokenAddress: DataTypes.STRING,
    token: DataTypes.STRING,
    amount: DataTypes.STRING,
    account: DataTypes.STRING,
    chain: DataTypes.STRING,
    chain_id: DataTypes.INTEGER,
    hash: DataTypes.STRING,
  },
  {
    tableName: 'fees_historical_data',
  },
)
