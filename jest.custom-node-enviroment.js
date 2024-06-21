// eslint-disable-next-line @typescript-eslint/no-var-requires
const NodeEnvironment = require('jest-environment-node').default

module.exports = class MyEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context)
    this.testPath = context.testPath
  }

  async setup() {
    this.global.testPath = this.testPath
    await super.setup()
  }
}
