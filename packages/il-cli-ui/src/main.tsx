import '@abraham/reflection'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { Main } from './components'
import './main.css'
import { InversifyProvider } from './context/inversify-context'

const root = createRoot(document.getElementById('root')!)

const gitCommitHash = process.env.GIT_COMMIT_HASH!
const gitCommitDateUtc = process.env.GIT_COMMIT_DATE_UTC!
console.log(`gitCommitHash=${gitCommitHash}`)
console.log(`gitCommitDateUtc=${gitCommitDateUtc}`)

root.render(
  <React.StrictMode>
    <InversifyProvider>
      <Main />
    </InversifyProvider>
  </React.StrictMode>,
)
