import '@abraham/reflection'

import React from 'react'
import { createRoot } from 'react-dom/client'

import { Ui } from './components'
import './main.css'

const root = createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <Ui />
  </React.StrictMode>,
)
