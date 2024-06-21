import type { PropsWithChildren, FC } from 'react'
import { useMemo } from 'react'
import { useEffect } from 'react'
import { Suspense } from 'react'
import { lazy } from 'react'
import React, { useState } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { ReactNotifications } from 'react-notifications-component'
import Footer from './components/Footer/Footer'
import LatestBlock from './components/LatestBlock/LatestBlock'
import Navbar from './components/Navbar/Navbar'
import ConnectWalletProvider, { WebSite } from './context/ConnectWalletProvider/ConnectWalletProvider'
import IlProtectionPage from './pages/il_protection'
import ThetaVaultsPage from './pages/theta_vaults'
import VolatilityTokensPage from './pages/volatility_tokens'
import CviTradingCompetitionPage from './pages/cvi_trading_compettion'
import Dashboard from './components/Dashboard/Dashboard'
import { Dedupe } from '@sentry/integrations'
import VaultInnerPage from './components/VaultComponents/VaultInnerPage/VaultInnerPage'
import StakingPage from './pages/staking'
import { useAppSelector } from './redux/hooks'
import { loadWebsite } from './redux/store'
import { useLocalStorage } from './hooks/use-local-storage-state'
import { CviEffects, IlEffects } from './effetcs'
import { CHAIN_IDS_INFO, IL_SUPPORTED_CHAIN_IDS, MODE, NetworkName, TV_SUPPORTED_CHAIN_IDS } from '@coti-cvi/lw-sdk'
import { TvInversifyServicesProvider as CviInversifyServicesProvider } from './context/ConnectWalletProvider/TvInversifyServicesProvider'
import { ILInversifyServicesProvider } from './context/ConnectWalletProvider/ILInversifyServicesProvider'
import { CommonEffects } from './effetcs/common-effects'
import { CheckArmadilloEligibleDiscountPage } from './pages/check-armadillo-eligible-discount'
import EmbedNftModal from './components/EmbedNftModal'
import CviIntroModal from './components/IntroPopup/CviIntroModal'
import RestrictionModal from './components/IntroPopup/RestrictionModal'
import CviTermOfUse from './components/TermOfUse/CviTermOfUse'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
// @ts-ignore
import type { Chain } from 'wagmi'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import ConnectWalletModal from './components/Modals/ConnectWalletModal'

import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { useAddress } from './hooks/use-address'
import TheScoopPage from './pages/the_scoop_page'
import classNames from 'classnames'

const ArmadilloTermOfUse_Lazy = lazy(() => import('./components/TermOfUse/ArmadilloTermOfUse'))
// const CviTermOfUse_Lazy = lazy(() => import('./components/TermOfUse/CviTermOfUse'))

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  release: process.env.GIT_COMMIT_HASH,
  integrations: [new Dedupe()],
  maxBreadcrumbs: 50,
})

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

const WithProvider: FC<PropsWithChildren<{ themeWeb: WebSite }>> = ({ themeWeb, children }) => {
  return themeWeb === WebSite.Armadillo ? (
    <ILInversifyServicesProvider>{children}</ILInversifyServicesProvider>
  ) : themeWeb === WebSite.Cvi ? (
    <CviInversifyServicesProvider>{children}</CviInversifyServicesProvider>
  ) : (
    <>{children}</>
  )
}

function WithTheme() {
  const themeWeb = useAppSelector(({ state }) => state.themeWeb)
  const [fullMode] = useLocalStorage('fullMode')
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false)
  const { pathname } = useLocation()
  const { impersonatedMode } = useAddress()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <WithProvider themeWeb={themeWeb}>
      <div
        className={`${themeWeb} ${classNames({
          'flex flex-col min-h-screen  bg-custom-win-bg': true,
        })}`}
      >
        {themeWeb === WebSite.Armadillo ? (
          <IlEffects />
        ) : (
          <>
            <CviEffects />
          </>
        )}
        {themeWeb === WebSite.Armadillo && <EmbedNftModal />}
        <CommonEffects />
        <Navbar navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen} />
        <RestrictionModal />
        <CviIntroModal />
        <Suspense fallback={<div>Loading...</div>}>
          <SentryRoutes>
            <Route
              path="/"
              element={themeWeb === WebSite.Armadillo ? <IlProtectionPage /> : <VolatilityTokensPage />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vaults" element={<ThetaVaultsPage />} />
            <Route path="/vaults/:id" element={<VaultInnerPage />} />
            <Route path="/staking" element={<StakingPage />} />
            <Route path="/leaderboard" element={<CviTradingCompetitionPage />} />
            <Route path="/the-scoop" element={<TheScoopPage />} />
            <Route
              path="/terms"
              element={themeWeb === WebSite.Armadillo ? <ArmadilloTermOfUse_Lazy /> : <CviTermOfUse />}
            />
            {themeWeb === WebSite.Armadillo && (
              <Route path="/whitelist" element={<CheckArmadilloEligibleDiscountPage />} />
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </SentryRoutes>
        </Suspense>
        {fullMode === MODE.ON && <LatestBlock />}
        <Footer />
      </div>
    </WithProvider>
  )
}

const App = () => {
  const isFullMode = useLocalStorage('fullMode')
  const { wagmiClient } = useMemo(() => {
    const chainsInfo = (loadWebsite() === WebSite.Cvi ? TV_SUPPORTED_CHAIN_IDS : IL_SUPPORTED_CHAIN_IDS)
      .map(chainId => CHAIN_IDS_INFO[chainId])
      .filter(chainInfo => isFullMode || chainInfo.networkName === NetworkName.Mainnet)
      .map<Chain>(chainInfo => ({
        id: Number(chainInfo.chainId),
        name: chainInfo.hardhatConfigNetworkName,
        network: chainInfo.networkName,
        nativeCurrency: chainInfo.nativeCurrency,
        blockExplorers:
          chainInfo.blockExplorerUrl === undefined
            ? undefined
            : {
                default: {
                  name: 'Block Explorer',
                  url: chainInfo.blockExplorerUrl,
                },
              },
        rpcUrls: {
          default: chainInfo.cviRpcUrl,
        },
      }))

    const { chains, provider, webSocketProvider } = configureChains(chainsInfo, [
      jsonRpcProvider({
        priority: 0,
        rpc: chain => ({
          http: chain.rpcUrls.default,
        }),
        static: false,
      }),
    ])

    const wagmiClient = createClient({
      autoConnect: true,
      connectors: [
        new MetaMaskConnector({ chains }),
        new CoinbaseWalletConnector({
          chains,
          options: {
            appName: 'cvi-swissnife',
          },
        }),
        new WalletConnectConnector({
          chains,
          options: {
            qrcode: true,
          },
        }),
      ],
      provider,
      webSocketProvider,
    })

    return { wagmiClient }
  }, [isFullMode])

  return (
    <Sentry.ErrorBoundary
      fallback={({ error, componentStack }) => (
        <div className=" text-black flex items-center w-full h-screen justify-center flex-col">
          <div>You have encountered an error</div>
          <div>{error.toString()}</div>
          <div>{componentStack}</div>
        </div>
      )}
    >
      <ReactNotifications />
      <WagmiConfig client={wagmiClient}>
        <Router>
          <ConnectWalletProvider>
            <WithTheme />
            <ConnectWalletModal />
          </ConnectWalletProvider>
        </Router>
      </WagmiConfig>
    </Sentry.ErrorBoundary>
  )
}

export default App
