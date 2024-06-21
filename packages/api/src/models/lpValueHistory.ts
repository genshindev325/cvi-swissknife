import type { Model } from 'sequelize'
import { DataTypes } from 'sequelize'
import sequelize from '../services/sequelize'

export interface LPValue {
  chain: string
  token: string
  block: number
  timestamp: number
  value: number
  usdValue: number
}

export const LPValueModel = sequelize.define<Model<LPValue>>(
  'LPValue',
  {
    chain: DataTypes.STRING,
    token: DataTypes.STRING,
    block: DataTypes.INTEGER,
    timestamp: DataTypes.INTEGER,
    value: DataTypes.FLOAT(21, 18),
    usdValue: DataTypes.FLOAT(21, 18),
  },
  {
    tableName: 'lp_values',
  },
)
