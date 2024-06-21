import { CustomError, ErrorKind, MODE } from '@coti-cvi/lw-sdk'
import classNames from 'classnames'
import Button from '../Button/Button'
import Container from '../Container/Container'
import { useLocalStorage } from '../../hooks/use-local-storage-state'

import { useState } from 'react'
import { useAddress } from 'beta-cvi-ui/src/hooks/use-address'
import CommonModal from '../Modals/CommonModal'
import { useSearchParams } from 'react-router-dom'
const Dashboard = () => {
  const [fullMode, setFullMode] = useLocalStorage('fullMode')
  const [displaySettings, setDisplaySettings] = useLocalStorage('displaySettings')
  const [debugMode, setDebugMode] = useLocalStorage('debugMode')
  const [openImpesonateModal, setOpenImpesonateModal] = useState<boolean>(false)
  const { address, impersonatedMode } = useAddress()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isImpersonateParamValid, setIsImpersonateParamValid] = useState<boolean>(false)
  const onFullMode = () => {
    setFullMode(fullMode === MODE.OFF ? MODE.ON : MODE.OFF)
  }

  const onHideSettings = () => {
    setDisplaySettings(displaySettings === MODE.OFF ? MODE.ON : MODE.OFF)
  }

  const onThrowError = () => {
    throw new CustomError({
      name: 'Custom Error',
      message: 'This is a custom error',
      errorKind: ErrorKind.SystemError,
      extras: {},
    })
  }
  const impesonateModalhandleChange = (event: { target: { value: string } }) => {
    setSearchParams({ impersonate: event.target.value })
    if (/^0x[a-fA-F0-9]{40}$/.test(event.target.value)) {
      setIsImpersonateParamValid(true)
    }
  }

  const startImpersonateMode = () => {
    window.location.reload()
  }

  return (
    <>
      <div className=" flex-wrap lg:flex-nowrap gap-6 px-6 mt-6">
        <Container title="Dashboard" className="w-full lg:w-6/12 2xl:w-4/12">
          <div className="flex items-center gap-4 pb-4 mb-8 justify-between border-blue-50 border-b border-opacity-20">
            <p className="text-sm">
              Debug Mode: <b className="uppercase">{debugMode ? 'True' : 'False'}</b>
            </p>
            <Button
              type="submit"
              className={classNames({
                ['w-32 h-10']: true,
                ['bg-common-turquoise hover:border-white border-white']: debugMode,
              })}
              titleClassName="text-sm"
              onClick={() => setDebugMode(prev => !prev)}
              title={debugMode ? 'Turn Off' : 'Turn On'}
            />
          </div>
          <div className="flex items-center gap-4 pb-4 mb-8 justify-between border-blue-50 border-b border-opacity-20">
            <p className="text-sm">
              Full Mode: <b className="uppercase">{fullMode}</b>
            </p>
            <Button
              type="submit"
              className={classNames({
                ['w-32 h-10']: true,
                ['bg-common-turquoise hover:border-white border-white']: fullMode === MODE.ON,
              })}
              titleClassName="text-sm"
              onClick={onFullMode}
              title={fullMode === MODE.ON ? 'Turn Off' : 'Turn On'}
            />
          </div>
          <div className="flex items-center gap-4 pb-4 mb-8 justify-between border-blue-50 border-b border-opacity-20">
            <p className="text-sm">
              Impersonate Modal: <b className="uppercase">{impersonatedMode ? 'on' : 'off'}</b>
            </p>
            <Button
              type="submit"
              disabled={impersonatedMode}
              className={classNames({
                ['w-32 h-10']: true,
                ['bg-common-turquoise hover:border-white border-white']: fullMode === MODE.ON,
              })}
              titleClassName="text-sm"
              onClick={() => setOpenImpesonateModal(true)}
              title="open modal"
            />
          </div>

          <div className="flex items-center gap-4 pb-4 mb-8 justify-between border-blue-50 border-b border-opacity-20">
            <p className="text-sm">
              Display settings menu: <b className="uppercase">{displaySettings}</b>
            </p>
            <Button
              type="submit"
              className={classNames({
                ['w-32 h-10']: true,
                ['bg-common-turquoise hover:border-white border-white']: displaySettings === MODE.ON,
              })}
              titleClassName="text-sm"
              onClick={onHideSettings}
              title={displaySettings === MODE.ON ? 'Turn Off' : 'Turn On'}
            />
          </div>

          <div className="flex items-center gap-4 pb-4 mb-8 justify-between border-blue-50 border-b border-opacity-20">
            <p className="text-sm">Test sentry:</p>
            <Button
              type="submit"
              className="w-32 h-10"
              titleClassName="text-sm"
              onClick={onThrowError}
              title={'TEST'}
            />
          </div>
        </Container>
      </div>
      <CommonModal
        type="impersonate"
        showModal={openImpesonateModal}
        setShowModal={() => setOpenImpesonateModal(false)}
      >
        <div className="flex flex-col gap-3 items-center">
          <h1 className="text-lg">Enter Impersonate Account:</h1>
          <input
            type="text"
            className="w-full focus:outline-none text-black h-8 pl-1"
            autoComplete="off"
            placeholder="Enter address to impersonate.."
            value={searchParams.get('impersonate') ?? ''}
            onChange={impesonateModalhandleChange}
          />
          <button
            disabled={!isImpersonateParamValid}
            onClick={startImpersonateMode}
            className={classNames({
              'focus:outline-none   px-4 py-1 rounded-sm': true,
              'bg-custom-500': isImpersonateParamValid,
              'bg-custom-500-opacity-63': !isImpersonateParamValid,
            })}
          >
            start impersonate mode
          </button>
        </div>
      </CommonModal>
    </>
  )
}

export default Dashboard
