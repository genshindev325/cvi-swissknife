import chaiModule from 'chai'
import { chaiEthers } from 'chai-ethers'

chaiModule.use(chaiEthers)

const { expect, should, use, util, assert, config, Assertion, AssertionError, version } = chaiModule

export { expect, should, use, util, assert, config, Assertion, AssertionError, version }
