import type { Model } from 'sequelize'
import { DataTypes } from 'sequelize'
import sequelize from '../services/sequelize'

// Using Anton's data, full daily history starting from GMT: Saturday, March 30, 2019 12:00:00 AM
export interface CVIFullDailyHistory {
  timestamp: number
  cvi: number
}

export const CVIFullDailyHistoryModel = sequelize.define<Model<CVIFullDailyHistory>>(
  'CVIFullDailyHistory',
  {
    timestamp: DataTypes.INTEGER,
    cvi: new DataTypes.FLOAT(21, 18),
  },
  {
    tableName: 'cvi_full_daily_historical_data',
  },
)
