import type { Model } from 'sequelize'
import { DataTypes } from 'sequelize'
import sequelize from '../services/sequelize'

export interface CVIHistory {
  round: number
  timestamp: number
  cvi: number
  chain: string
  chain_id: number
  version: number
  address: string
}

export const CVIHistoryModel = sequelize.define<Model<CVIHistory>>(
  'CVIHistory',
  {
    round: DataTypes.INTEGER,
    timestamp: DataTypes.INTEGER,
    cvi: new DataTypes.FLOAT(21, 18),
    chain: DataTypes.STRING,
    chain_id: DataTypes.INTEGER,
    version: DataTypes.INTEGER,
    address: DataTypes.STRING,
  },
  {
    tableName: 'cvi_historical_data',
  },
)
