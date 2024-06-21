const _ = require('lodash')
const config = _.cloneDeep(require('../../.eslintrc.js'))

config.rules['no-console'] = 'error'

module.exports = config
