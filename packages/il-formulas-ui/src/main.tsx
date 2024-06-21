import '@abraham/reflection'
import './main.css'
import 'react-widgets/scss/styles.scss'

import { createRoot } from 'react-dom/client'
import { Main } from './components'
import { InversifyProvider } from './context/inversify-context'
import { store } from './redux'
import { Provider } from 'react-redux'
import { Effects } from './effects'
import { SeriesDownloaderProvider } from './context/series-downloader-context'

const root = createRoot(document.getElementById('root')!)

root.render(
  <Provider store={store}>
    <InversifyProvider>
      <SeriesDownloaderProvider concurrency={5}>
        <Effects />
        <Main />
      </SeriesDownloaderProvider>
    </InversifyProvider>
  </Provider>,
)
