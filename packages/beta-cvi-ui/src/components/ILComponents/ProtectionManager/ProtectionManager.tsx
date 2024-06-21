import type { FC } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import Container from '../../Container/Container'
import ActiveProtection from './ActiveProtection'
import History from './History'
import { useLocation } from 'react-router-dom'
import { ProtectionTabsPaths } from '../../../types/common.types'

const ProtectionManager: FC = () => {
  const [protectionsTableTab, setProtectionsTableTab] = useState('')
  const location = useLocation()

  useEffect(() => {
    if (location.hash.includes(ProtectionTabsPaths.history)) {
      setProtectionsTableTab(ProtectionTabsPaths.history)
    } else {
      setProtectionsTableTab(ProtectionTabsPaths['active-protection'])
    }
  }, [location.hash])

  return (
    <Container
      className="flex-auto min-h-[16rem]"
      title={[
        { name: 'Active protections', path: ProtectionTabsPaths['active-protection'] },
        { name: 'History', path: ProtectionTabsPaths.history },
      ]}
      activeTab={protectionsTableTab}
    >
      <div className="flex gap-8 flex-1 min-h-20">
        {protectionsTableTab === ProtectionTabsPaths['active-protection'] ? <ActiveProtection /> : <History />}
      </div>
    </Container>
  )
}

export default ProtectionManager
