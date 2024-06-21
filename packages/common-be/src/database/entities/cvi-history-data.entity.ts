import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BlockchainName } from '@coti-cvi/lw-sdk'

export enum CviHistoryDataEntityChain {
  Ethereum = 'Ethereum',
  Polygon = 'Polygon',
  Arbitrum = 'Arbitrum',
}

export function chainToBlockchainName(chain: string): BlockchainName {
  if (!Object.values(CviHistoryDataEntityChain).includes(chain as CviHistoryDataEntityChain)) {
    throw new Error(`Unknown chain ${chain}`)
  }
  const c = chain as CviHistoryDataEntityChain
  switch (c) {
    case CviHistoryDataEntityChain.Ethereum:
      return BlockchainName.ETHEREUM
    case CviHistoryDataEntityChain.Arbitrum:
      return BlockchainName.ARBITRUM
    case CviHistoryDataEntityChain.Polygon:
      return BlockchainName.POLYGON
    default:
      throw new Error(`Unknown chain ${chain}`)
  }
}

@Entity({ name: 'cvi_historical_data' })
export class CviHistoryDataEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: number

  @Column({ type: 'int', nullable: false, update: false })
  public readonly round!: number

  @Column({ type: 'int', nullable: false, update: false })
  public readonly timestamp!: number

  @Column({ type: 'float', nullable: false, update: false })
  public readonly cvi!: number

  @Column({ type: 'varchar', nullable: false, update: false, enum: CviHistoryDataEntityChain })
  public readonly chain!: CviHistoryDataEntityChain

  @Column({ type: 'int', nullable: false, update: false })
  public readonly chain_id!: number

  @Column({ type: 'int', nullable: false, update: false })
  public readonly version!: number

  @Column({ type: 'varchar', nullable: false, update: false })
  public readonly address!: string

  @UpdateDateColumn({ type: 'datetime', update: false })
  public readonly updatedAt!: Date

  @CreateDateColumn({ type: 'datetime', update: false })
  public readonly createdAt!: Date
}
