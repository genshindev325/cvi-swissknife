import { getNamedAccounts, periods, isNum } from '@coti-cvi/lw-sdk'
import type { InverifyContext } from '../context/inversify-context'
import type { MenuItem, Reject } from '../types'
import { BACK, CLI_CLOSED_ERROR_MESSAGE, DEFAULT_REJECTS, DEV_ACCOUNTS } from './constants'

type StandardEnum<T> = {
  [id: string]: T | string
  [nu: number]: string
}

export interface IThingThatUsesASortOrder<T extends StandardEnum<unknown>> {
  sortOrder: T
}

export class Wrappers {
  constructor(
    private readonly inverifyContext: Required<InverifyContext>,
    public readonly shouldClose: () => boolean,
    public readonly writeOutput: (value: string, options?: { overrideLineNumberFromEnd?: number }) => void,
    private readonly askQuestion: (question: string) => Promise<string>,
    public readonly clearOutput: (options?: { lines?: number }) => void,
  ) {}

  public question = async (question: string, rejects: Reject[] = DEFAULT_REJECTS): Promise<string> => {
    const answer = await this.askQuestion(`${rejects.map(r => `(${r.equal}) ${r.error}`).join(', ')} - ${question}`)
    const r = rejects.find(r => r.equal === answer)
    if (r) {
      throw new Error(r.error)
    }
    return answer
  }

  public select = async (choose: string, choices: string[], rejects?: Reject[], autoPick = true): Promise<number> => {
    if (autoPick) {
      if (choices.length == 0) {
        throw new Error('No choices')
      }
      if (choices.length == 1) {
        return 0
      }
    }
    while (!this.shouldClose()) {
      const q = `choose ${choose}: ${choices.map((c, i) => `\n(${i}) ${c}`)}`
      const answer = await this.question(q, rejects)
      const valid = answer.length > 0 && !isNaN(+answer) && +answer >= 0 && +answer < choices.length
      if (valid) {
        return +answer
      }
      this.writeOutput(`invalid input (${answer}). try again...`)
    }
    throw new Error(CLI_CLOSED_ERROR_MESSAGE)
  }

  public selectItem = async <T extends Object>(
    choose: string,
    collection: T[],
    printer: (item: T) => string | Promise<string> = (item: T) => item.toString(),
    rejects?: Reject[],
    autoPick?: boolean,
  ): Promise<T> => {
    const items = await Promise.all(collection.map(printer))
    const index = await this.select(choose, items, rejects, autoPick)
    return collection[index]
  }

  public selectValue = async <TKey extends string, TValue>(
    choose: string,
    objects: { [key in TKey]: TValue },
    printer: (item: [TKey, TValue]) => string | Promise<string> = i => `${i[0]} - ${JSON.stringify(i[1])}`,
    rejects?: Reject[],
  ): Promise<TValue> => {
    const selected = await this.selectItem(choose, Object.entries(objects) as [TKey, TValue][], printer, rejects)
    return selected[1]
  }

  public selectEnum = async <TEnumKey extends string, TEnumValue extends string | number>(
    choose: string,
    enumVariable: { [key in TEnumKey]: TEnumValue },
    printer?: (item: TEnumKey) => string | Promise<string>,
    rejects?: Reject[],
  ) => {
    const keys = Object.keys(enumVariable).filter(e => !isNum(e)) as TEnumKey[]
    const selectedKey = await this.selectItem(choose, keys, printer, rejects)
    return enumVariable[selectedKey]
  }

  public selectReadonly = async <T extends readonly string[]>(
    choose: string,
    items: T,
    printer: (item: typeof items[number]) => string = (item: typeof items[number]) => item.toString(),
    rejects?: Reject[],
  ): Promise<typeof items[number]> => {
    const values = Object.values(items).map(printer)
    const index = await this.select(choose, values, rejects)
    return items[index]
  }

  public selectAccount = async (choose = '', rejects?: Reject[]): Promise<string> => {
    const accounts = [...DEV_ACCOUNTS, ...getNamedAccounts({ chainId: this.inverifyContext.chainId })]
    const choices = accounts.map(a => `(${a.name}) ${a.address}`)
    const desc = 'named account, input an address or leave empty for signer'
    const q = `choose ${choose} (${desc}) ${choices.map((c, i) => `\n(${i}) ${c}`)}`
    const answer = await this.question(q, rejects)
    const valid = answer.length > 0 && !isNaN(+answer) && +answer >= 0 && +answer < choices.length
    const signerAddress = this.inverifyContext.signerInversifyService.address
    return valid ? accounts[+answer].address : answer.length === 0 ? signerAddress : answer
  }

  public selectTimePeriod = async (choose = '') => {
    return this.selectItem<[period: string, amount: number]>('select time period' + choose, periods, i => i[0])
  }

  public selectMenu = async (items: { [key: string]: MenuItem }, rejects: Reject[] = [BACK]) => {
    const validEntries = Object.entries(items).filter(([_, i]) => (i.condition ? i.condition() : true))
    const menu = validEntries.map(([k, i]) => `\n(${k}) ${i.description}`)
    while (!this.shouldClose()) {
      const selection = await this.question(menu.join(', '), rejects)
      if (validEntries.map(([k, _]) => k).includes(selection)) {
        await items[selection].action()
      } else {
        this.writeOutput(`invalid input (${selection}). try again...`)
      }
    }
    throw new Error(CLI_CLOSED_ERROR_MESSAGE)
  }
}
