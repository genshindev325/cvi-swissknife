import React from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { ReactNotifications } from 'react-notifications-component'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Provider } from 'react-redux'
import { store } from './redux'
import { InversifyProvider } from './inversify-context'
import './App.css'
import { Home } from './components/home'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

// run sentry

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  release: process.env.GIT_COMMIT_HASH,
  integrations: Sentry.defaultIntegrations,
  maxBreadcrumbs: 50,
})

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

const App = () => {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, componentStack }) => (
        <div className="text-white flex items-center w-full h-screen justify-center flex-col">
          <div>You have encountered an error</div>
          <div>{error.toString()}</div>
          <div>{componentStack}</div>
        </div>
      )}
    >
      <Provider store={store}>
        <InversifyProvider>
          <ReactNotifications />
          <ThemeProvider theme={darkTheme}>
            <Router>
              <div className="flex flex-col min-h-screen">
                <SentryRoutes>
                  <Route path="/" element={<Home />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </SentryRoutes>
              </div>
            </Router>
          </ThemeProvider>
        </InversifyProvider>
      </Provider>
    </Sentry.ErrorBoundary>
  )
}

export default App
