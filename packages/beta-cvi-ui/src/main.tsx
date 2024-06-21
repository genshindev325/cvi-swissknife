/* eslint-disable no-console */
import React from 'react'
import ReactDOM from 'react-dom/client'
import '@abraham/reflection'
import './styles/globals.scss'
import 'react-notifications-component/dist/theme.css'
import App from './App'
import { store } from './redux/store'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
