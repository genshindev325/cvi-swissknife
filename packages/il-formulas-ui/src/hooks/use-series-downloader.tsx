import { useContext } from 'react'
import { seriesDownloaderContext } from '../context/series-downloader-context'

export function useSeriesDownloader() {
  return useContext(seriesDownloaderContext)
}
