import React from 'react'
import { render } from 'ink'
import { Router } from './router/Router'
import { Route } from './router/Route'
import { Home } from './pages/Home'
import { Pods } from './pages/Pods'
import { Pod } from './pages/Pod'
import { GitInfo } from './components/GitInfo'
import { Back } from './router/Back'
import { loadRepoPath } from './k8s/utils'
import { GitContextProvider } from '../context/GitProvider'

const Render = () => {
  return (
    <GitContextProvider>
      <Router pages={[{ path: '/' }, { path: '/pods' }, { path: '/pod/:id' }]}>
        <Route path="/" component={<Home />} />
        <Route path="/pods" component={<Pods />} />
        <Route path="/pod/:id" component={<Pod />} />
        <GitInfo />
        <Back />
      </Router>
    </GitContextProvider>
  )
}

export async function renderKubernetesCli() {
  await loadRepoPath()
  render(<Render />)
}
