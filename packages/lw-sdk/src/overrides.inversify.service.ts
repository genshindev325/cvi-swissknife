import type { Overrides } from 'ethers'
import { inject, injectable, optional } from 'inversify'
import type { GasPriceInversifyService } from './gas-price.inversify.service'

@injectable()
export class OverridesInversifyService {
  private readonly overrides: Overrides = {}

  constructor(
    @inject('GasPriceInversifyService') @optional() public readonly gasPriceService?: GasPriceInversifyService,
  ) {}

  public get = async (overrides?: Overrides): Promise<Overrides> => {
    const runningOverrides = this.overrides
    if (this.gasPriceService) {
      Object.assign(runningOverrides, await this.gasPriceService.getGas())
    }
    return { ...runningOverrides, ...overrides }
  }
}
