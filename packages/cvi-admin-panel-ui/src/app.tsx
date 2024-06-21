import 'reflect-metadata'
import './styles/globals.scss'
import type { FC } from 'react'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { ReactNotifications } from 'react-notifications-component'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import 'react-widgets/scss/styles.scss'
import { Provider } from 'react-redux'
import { InversifyProvider } from './contexts/inversify-context'
import { store } from './redux'
import { General } from './components/general'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import 'beautiful-react-diagrams/styles.css'
import type { UI } from './types'
import { FilteredEventsProvider } from './contexts/filtered-events-context'
import { defaultEventsContext, EventsProvider } from './contexts/events-context'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  release: process.env.GIT_COMMIT_HASH,
  integrations: Sentry.defaultIntegrations,
  maxBreadcrumbs: 50,
})

const persistor = persistStore(store)

type Props = {
  ui: UI
}

export const App: FC<Props> = ({ ui }) => {
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
        <PersistGate loading={null} persistor={persistor}>
          <InversifyProvider>
            <ReactNotifications />
            <ThemeProvider theme={darkTheme}>
              <Router>
                <EventsProvider {...defaultEventsContext}>
                  <FilteredEventsProvider {...defaultEventsContext}>
                    <General ui={ui} />
                  </FilteredEventsProvider>
                </EventsProvider>
              </Router>
            </ThemeProvider>
          </InversifyProvider>
        </PersistGate>
      </Provider>
    </Sentry.ErrorBoundary>
  )
}
