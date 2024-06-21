#! /usr/bin/env node

import '@abraham/reflection'

import path from 'path'
import dotenv from 'dotenv'
import { main } from './cli'
import os from 'os'
import { CustomError } from '@coti-cvi/lw-sdk'

if (require.main === module) {
  dotenv.config({
    path: path.join(os.homedir(), 'cvi-swissknife-cli.env'),
  })
  main(process.argv, process.env).catch(e => {
    CustomError.printErrorToConsole(e)
    process.exitCode = 1
  })
}
