/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Model } from 'sequelize'
import { Sequelize } from 'sequelize'
import environment from '../utils/environment'

// @ts-ignore
const mysqlConnection = new Sequelize(environment.mysqlTable, environment.mysqlUser, environment.mysqlPass, {
  host: environment.mysqlHost,
  dialect: 'mysql',
  logging: false,
})

export default mysqlConnection

// @ts-ignore
export function stripModel<T>(model: Model<T, T>): T {
  const item: any = model.get()
  delete item.id
  delete item.createdAt
  delete item.updatedAt
  return item
}
