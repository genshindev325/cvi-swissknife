import type { Model } from 'sequelize'
import { DataTypes } from 'sequelize'
import sequelize from '../services/sequelize'

export interface PriceHistory {
  chain: string
  blockNumber: number
  timestamp: number
  token: string
  tokenAddress: string
  price: number
}

export const PriceHistoryModel = sequelize.define<Model<PriceHistory>>(
  'PriceHistory',
  {
    chain: DataTypes.STRING,
    blockNumber: DataTypes.INTEGER,
    timestamp: DataTypes.INTEGER,
    token: DataTypes.STRING,
    tokenAddress: DataTypes.STRING,
    price: DataTypes.FLOAT(23, 14),
  },
  {
    tableName: 'prices_historical_data',
  },
)
