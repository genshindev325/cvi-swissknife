import { Stator, TokenName } from '@coti-cvi/lw-sdk'
import classNames from 'classnames'
import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { selectors, useAppSelector } from '../../../redux'
import DisplayNumber from '../../DisplayNumber/DisplayNumber'
import InnerContainer from '../../InnerContainer/InnerContainer'
import ProgressBar from '../../ProgressBar/ProgressBar'
import VaultContainer from '../VaultContainer'
import { CviName } from '../../../types/common.types'
import { useAddress } from '../../../hooks/use-address'
type Props = {
  vaultName: string
  comingSoon?: boolean
}

const MainVault: FC<Props> = ({ vaultName, comingSoon }) => {
  const { address } = useAddress()
  const tvlUsdc = useAppSelector(state => state.state.cvi.tv.tvlUsdc)
  const maxCapacityUsdc = useAppSelector(state => state.state.cvi.tv.maxCapacityUsdc)
  const positionOfAddress = useAppSelector(state => state.state.cvi.tv.positionOfAddress)
  const themeWebSite = useAppSelector(state => state.state.themeWeb)
  const apr = useAppSelector(state => state.state.cvi.tv.apr)
  const tvProgressBarPersentage = useAppSelector(selectors.tvProgressBarPersentage)

  return (
    <div className={classNames({ 'relative mx-6 md:mx-0': true /* remove after cvi X1 is release */ })}>
      <VaultContainer type="main" className=" px-6 pb-6 " vaultName={vaultName}>
        {comingSoon && (
          <p className="absolute z-20 top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-lg text-white">
            COMING SOON
          </p>
        )}
        <div
          className={classNames({
            'flex flex-col gap-4': true,
            'pointer-events-none relative bg-dark-700 opacity-20': comingSoon, // remove after cvi X1 is release
          })}
        >
          <span className="text-xs leading-5 text-common-lightGray">
            {`Deposit USDC to earn funding fees from CVI${
              vaultName.toUpperCase() === '1X' ? '' : vaultName.toUpperCase()
            }  token holders as well as swap fees from the CVI${
              vaultName.toUpperCase() === '1X' ? '' : vaultName.toUpperCase()
            } DEX pool`}
          </span>
          <InnerContainer className="bg-dark-300">
            <div>
              {' '}
              <span className="flex flex-col gap-1  ">
                <span className="flex flex-row gap-1 text-common-lightGray text-sm">
                  APR{' '}
                  {/* <span data-tip data-for="vaultARP">
                    <GetSvg svgName="tooltip" className=" cursor-pointer" />
                  </span>
                  <ReactTooltip
                    id="vaultARP"
                    place="bottom"
                    effect="solid"
                    data-html={true}
                    insecure={true}
                    multiline={true}
                    className="default-react-tooltip-style "
                    delayHide={0}
                  >
                    ARP
                  </ReactTooltip> */}
                </span>

                <DisplayNumber
                  state={apr}
                  tokenNumberClassName="text-2xl font-bold "
                  tokenNameClassName="text-2xl font-normal flex items-center"
                  percentage
                  customDecimal={2}
                />
              </span>
            </div>
          </InnerContainer>
          <InnerContainer className="bg-dark-300">
            <div className="flex flex-col gap-2">
              <span className="flex flex-row justify-between text-sm">
                <span className="text-common-lightGray">Current deposits (TVL)</span>
                <DisplayNumber
                  state={Stator.map(tvlUsdc, num => num)}
                  tokenName={TokenName.USDC}
                  millify={{ precision: 2 }}
                  tokenNameClassName={'text-common-lightGray'}
                />
              </span>

              <ProgressBar bgColor="#007acb" progress={tvProgressBarPersentage.data ?? 0} active={true} />

              <span className="flex flex-row justify-between text-sm">
                <span className="text-common-lightGray">Max capacity</span>
                <DisplayNumber
                  state={maxCapacityUsdc.data}
                  tokenName={TokenName.USDC}
                  millify
                  tokenNameClassName={'text-common-lightGray'}
                />
              </span>
            </div>
          </InnerContainer>
          <InnerContainer className="bg-dark-300">
            <span className="flex flex-col gap-2">
              <span className="flex flex-row justify-between text-sm text-common-lightGray">
                Your position
                <span className="flex flex-row gap-1  items-center text-xs text-common-lightGray">
                  Your vault share{' '}
                  <b className="text-white">
                    {address ? (
                      <DisplayNumber
                        state={
                          comingSoon ? Stator.resolve(0) : Stator.map(positionOfAddress, data => data.sharePercentage)
                        }
                        customDecimal={2}
                        percentage
                      />
                    ) : (
                      '--'
                    )}
                  </b>
                </span>
              </span>
              {address ? (
                <DisplayNumber
                  state={
                    comingSoon ? Stator.resolve(0) : Stator.map(positionOfAddress, data => data.positionBalanceUsdc)
                  }
                  tokenNameClassName="font-normal text-lg text-common-lightGray"
                  tokenNumberClassName="font-bold text-lg"
                  tokenName={TokenName.USDC}
                  useNumberGrouping
                />
              ) : (
                '--'
              )}
            </span>
          </InnerContainer>

          <Link
            to={`${vaultName === '1x' ? CviName['1x'] : CviName['2x']}`}
            className={`${themeWebSite} ${classNames({
              'rounded-lg  uppercase text-base w-full font-bold cursor-pointer h-14 drop-shadow-lg flex justify-center items-center bg-custom-cancel-bg hover:border border-custom-cancel-bg  hover:bg-custom-cancel-bg-opacity-25   active:bg-custom-win-bg-opacity-20 active:text-common-lightGray':
                true,
            })}`}
            onClick={() => {
              if (window.gtag) {
                window.gtag('event', 'enter_vault', {
                  page_title: 'enter_vault',
                  enter_vault_title: 'Click on enter vault',
                  description: 'The user clicked on enter vault button',
                  page_path: window.location.pathname,
                })
              }
            }}
          >
            ENTER VAULT
          </Link>
        </div>
      </VaultContainer>
    </div>
  )
}

export default MainVault
