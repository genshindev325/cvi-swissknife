/* eslint-disable @typescript-eslint/no-explicit-any */

import async from 'async'

export const asyncQueue = async.queue<() => Promise<any>, any, any>(
  (request, done) =>
    request().then(
      result => done(null, result),
      e => done(e),
    ),
  5,
)
