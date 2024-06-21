import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import React, { useMemo, useState } from 'react'
import { actions, useAppDispatch, useAppSelector } from '../../redux'
import { ExpandTable } from './ExpandTable'
import { ProtectionHistoryForAccount } from './ProtectionHistoryForAccount'
import { CSVLink } from 'react-csv'
import { catDecimalsWithRound, secondsToString, Stator, TokenName } from '@coti-cvi/lw-sdk'
import sum from 'lodash/sum'
import DisplayNumber from '../../../../beta-cvi-ui/src/components/DisplayNumber/DisplayNumber'
import type { ProtectionInfoDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/il-backend-swagger-client'
import { Link } from 'react-router-dom'
import { GetSvg } from '../../../../beta-cvi-ui/src/utils/GetSvg'
import { Checkbox } from '@mui/material'
import {
  filteredWalletProtectionsSelector,
  filteredWalletProtectionsWithoutSelectedProtectionIdsSelector,
} from '../../redux/selectors'

type Props = {}

interface Data {
  dropdown?: string
  wallet: string
  isAddressInternal: boolean
  activeProtections: number
  expiredProtections: number
  actions?: boolean
  premiumsCostsUsdc: number
  maxAmountToBePaidUsdc: number
  protections: ProtectionInfoDto[]
  isSelected: boolean
}

const Row = ({ walletProtections }: { walletProtections: Data }) => {
  const [open, setOpen] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const selectedProtectionIds = useAppSelector(state => state.selected.protectionIds)

  const onImpersonate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    window.open(`https://armadillo.is?impersonate=${walletProtections.wallet}`, '_blank')
  }

  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }} tabIndex={-1} key={walletProtections.wallet}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" padding="none">
          <div className="flex gap-2">
            <Checkbox
              checked={walletProtections.isSelected}
              onChange={(_, checked) => {
                const r = checked
                  ? [
                      ...selectedProtectionIds.filter(s =>
                        walletProtections.protections.every(p => p.boughtEvent.args.id !== s),
                      ),
                      ...walletProtections.protections.map(p => p.boughtEvent.args.id),
                    ]
                  : selectedProtectionIds.filter(s =>
                      walletProtections.protections.every(p => p.boughtEvent.args.id !== s),
                    )
                dispatch(actions.setSelectedProtectionIds(r))
              }}
            />
            {walletProtections.wallet}
            <Link to={`/wallet/${walletProtections.wallet}`}>
              <GetSvg svgName="link" className="fill-white" />
            </Link>
          </div>
        </TableCell>
        <TableCell align="left">{walletProtections.activeProtections}</TableCell>
        <TableCell align="left">{walletProtections.expiredProtections}</TableCell>
        <TableCell align="left">
          <DisplayNumber
            state={Stator.resolve(catDecimalsWithRound(walletProtections.premiumsCostsUsdc, 2))}
            tokenNameClassName="text-white"
            tokenNumberClassName="text-white"
            tokenName={TokenName.USDC}
          />
        </TableCell>
        <TableCell align="left">
          <DisplayNumber
            state={Stator.resolve(catDecimalsWithRound(walletProtections.maxAmountToBePaidUsdc, 2))}
            tokenNameClassName="text-white"
            tokenNumberClassName="text-white"
            tokenName={TokenName.USDC}
          />
        </TableCell>
        <TableCell align="right">
          <button
            type="button"
            className="bg-common-lightGreen rounded-lg p-2 font-bold hover:scale-105 text-md"
            onClick={e => onImpersonate(e)}
          >
            Impersonate mode
          </button>
        </TableCell>
      </TableRow>
      <ProtectionHistoryForAccount open={open} protectionsInfo={walletProtections.protections} />
    </>
  )
}

type CsvItem = {
  wallet: string
  organic?: 'organic' | 'coti'
  protection_id: string
  start_date: string
  end_date: string
  pair: string
  protected_amount_usdc: number
  premium_cost_usdc: number
  policy_period: string
  max_amount_to_be_paid_usdc: number
  status: 'active' | 'expired'
  payout_paid_or_due: number
  il_percentage: number
  collateral_after_buy: number
  protection_bought_block_number?: number
  protection_bought_transaction_hash?: string
  protection_expired_block_number?: number
  protection_expired_transaction_hash?: string
  collateral_after_expired: number | '-'
  premium_cost_percentage: number
  embed_discount_type: string
  embed_used_discount_usdc?: number
}

export const AllProtectionsTable = ({}: Props) => {
  const dispatch = useAppDispatch()
  const walletsProtections = useAppSelector(state => state.walletsProtections)
  const filteredWalletsProtections = useAppSelector(filteredWalletProtectionsSelector)
  const filteredWalletProtectionsWithoutSelectedProtectionIds = useAppSelector(
    filteredWalletProtectionsWithoutSelectedProtectionIdsSelector,
  )
  const fullMode = useAppSelector(state => state.fullMode)
  const selectedProtectionIds = useAppSelector(state => state.selected.protectionIds)

  const rows = filteredWalletProtectionsWithoutSelectedProtectionIds.map<Data>(p => ({
    wallet: p.wallet,
    isAddressInternal: p.isInternalWallet,
    activeProtections: p.protections.filter(r => !r.protectionInfo.expiredEvent).length,
    expiredProtections: p.protections.filter(r => r.protectionInfo.expiredEvent).length,
    premiumsCostsUsdc: sum(p.protections.map(p => p.protectionInfo.boughtEvent.args.premiumCostUSD)),
    maxAmountToBePaidUsdc: sum(p.protections.map(p => p.protectionInfo.metadata.maxAmountToBePaidUsdc)),
    protections: p.protections.map(p => p.protectionInfo),
    isSelected: p.protections.every(p => selectedProtectionIds.includes(p.protectionId)),
  }))
  const areAllProtectionsSelected =
    selectedProtectionIds.length === walletsProtections.flatMap(p => p.protections).length

  const csvArray = useMemo(() => {
    return filteredWalletsProtections.flatMap<CsvItem>(walletProtections =>
      walletProtections.protections.map<CsvItem>(protection => {
        const startDate = new Date(protection.protectionInfo.boughtEvent.args.protectionStartTimestamp * 1000)
        const endDate = new Date(protection.protectionInfo.boughtEvent.args.protectionEndTimestamp * 1000)

        return {
          protection_id: protection.protectionInfo.boughtEvent.args.id,
          wallet: walletProtections.wallet,
          organic: walletProtections.isInternalWallet ? 'coti' : 'organic',
          premium_cost_usdc: catDecimalsWithRound(protection.protectionInfo.boughtEvent.args.premiumCostUSD, 6),
          protected_amount_usdc: catDecimalsWithRound(protection.protectionInfo.metadata.lpTokensWorthAtBuyTimeUsdc, 0),
          premium_cost_percentage: catDecimalsWithRound(
            (protection.protectionInfo.boughtEvent.args.premiumCostUSD /
              protection.protectionInfo.metadata.lpTokensWorthAtBuyTimeUsdc) *
              100,
            6,
          ),
          start_date: `${startDate.toISOString().split('T')[0]} ${startDate.toISOString().split('T')[1].split('.')[0]}`,
          end_date: `${endDate.toISOString().split('T')[0]} ${endDate.toISOString().split('T')[1].split('.')[0]}`,
          pair: `${protection.protectionInfo.boughtEvent.args.tokenName1.ArmadilloSupportedTokenName}-${protection.protectionInfo.boughtEvent.args.tokenName2.ArmadilloSupportedTokenName}`,
          policy_period: secondsToString(
            protection.protectionInfo.boughtEvent.args.protectionEndTimestamp -
              protection.protectionInfo.boughtEvent.args.protectionStartTimestamp,
          ),
          max_amount_to_be_paid_usdc: catDecimalsWithRound(protection.protectionInfo.metadata.maxAmountToBePaidUsdc, 6),
          status: protection.protectionInfo.expiredEvent ? 'expired' : 'active',
          payout_paid_or_due: catDecimalsWithRound(protection.protectionInfo.status.payoutOrDuePayoutUsdc, 6),
          il_percentage: catDecimalsWithRound(protection.protectionInfo.status.ilPercentage, 6),
          collateral_after_buy: catDecimalsWithRound(protection.protectionInfo.boughtEvent.args.collateral, 0),
          protection_bought_block_number: protection.protectionInfo.boughtEvent.blockNumber,
          protection_bought_transaction_hash: protection.protectionInfo.boughtEvent.transactionHash,
          protection_expired_block_number: protection.protectionInfo.expiredEvent?.blockNumber,
          protection_expired_transaction_hash: protection.protectionInfo.expiredEvent?.transactionHash,
          collateral_after_expired: protection.protectionInfo.expiredEvent?.args.collateral
            ? catDecimalsWithRound(protection.protectionInfo.expiredEvent.args.collateral, 0)
            : '-',
          embed_discount_type: protection.protectionInfo.metadata.embedDiscount?.discountTypeName ?? 'None',
          embed_used_discount_usdc: protection.protectionInfo.metadata.embedDiscount?.discountUsdc ?? 0,
        }
      }),
    )
  }, [filteredWalletsProtections])

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <ExpandTable
          headCells={[
            {
              id: 'dropdown',
              emptyCell: true,
            },
            {
              id: 'wallet',
              align: 'left',
              numeric: false,
              disablePadding: true,
              label: (
                <span>
                  <Checkbox
                    checked={areAllProtectionsSelected}
                    onChange={(_, checked) =>
                      dispatch(
                        actions.setSelectedProtectionIds(
                          checked
                            ? filteredWalletsProtections.flatMap(p => p.protections).map(p => p.protectionId)
                            : [],
                        ),
                      )
                    }
                  />
                  <span>Accounts ({filteredWalletsProtections.length})</span>,
                </span>
              ),
            },
            {
              id: 'activeProtections',
              align: 'left',
              numeric: true,
              disablePadding: false,
              label: `Active protections (${
                filteredWalletsProtections.flatMap(p => p.protections.filter(p => !p.protectionInfo.expiredEvent))
                  .length
              })`,
            },
            {
              id: 'expiredProtections',
              align: 'left',
              numeric: true,
              disablePadding: false,
              label: `Expired protections (${
                filteredWalletsProtections.flatMap(p => p.protections.filter(p => p.protectionInfo.expiredEvent)).length
              })`,
            },
            {
              id: 'premiumsCostsUsdc',
              align: 'left',
              numeric: true,
              disablePadding: false,
              label: `Premiums ($)`,
            },
            {
              id: 'maxAmountToBePaidUsdc',
              align: 'left',
              numeric: true,
              disablePadding: false,
              label: `Max to be Paid ($)`,
            },
            {
              id: 'actions',
              align: 'right',
              numeric: false,
              disablePadding: false,
              label: `Actions`,
            },
          ]}
          rows={rows}
          renderRow={walletProtections => <Row key={walletProtections.wallet} walletProtections={walletProtections} />}
        />
      </Paper>
      <div className="flex justify-end">
        <CSVLink
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          filename="armadillo-export.csv"
          data={!fullMode ? csvArray.map(({ organic, ...keepAttrs }) => keepAttrs) : csvArray}
        >
          Download CSV
        </CSVLink>
      </div>
    </Box>
  )
}
