import '@abraham/reflection'

import React from 'react'
import { createRoot } from 'react-dom/client'

import { Ui } from './components'
import './main.css'
import 'react-widgets/scss/styles.scss'

const root = createRoot(document.getElementById('root')!)

root.render(<Ui />)
