import type { ProtectionInfoDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/il-backend-swagger-client'
import type { ArmadilloSupportedTokenName } from '@coti-cvi/lw-sdk'
import { catDecimalsWithRound, Stator, TokenName } from '@coti-cvi/lw-sdk'
import { Box, Checkbox, Collapse, TableCell, TableRow, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import DisplayNumber from '../../../../beta-cvi-ui/src/components/DisplayNumber/DisplayNumber'
import PoolPair from '../../../../beta-cvi-ui/src/components/PoolPair/PoolPair'
import { GetSvg } from '../../../../beta-cvi-ui/src/utils/GetSvg'
import { actions, useAppDispatch, useAppSelector } from '../../redux'
import { ExpandTable } from './ExpandTable'

type RowData = {
  protectionInfo: ProtectionInfoDto
  protectionStartTimestamp: string
  protectionEndTimestamp: string
  protectionId: string
  status: 'Active' | 'Expired'
  pair: string
  tokenName1: ArmadilloSupportedTokenName
  tokenName2: ArmadilloSupportedTokenName
  lpTokensWorthAtBuyTimeUSD: number
  premiumCostUSD: number
  protectionWorthNow: number
  currentILsPercentage?: number
  policyPeriodSeconds: number
  currentProtectionWorthUsdc: number
  embedDiscount?: number
}

const Row = ({ row: { protectionInfo, ...row } }: { row: RowData }) => {
  const dispatch = useAppDispatch()
  const selectedProtectionIds = useAppSelector(state => state.selected.protectionIds)

  const url_points = `http://il-backend-polygon-mainnet.cvi-team.com/accounts/due-payouts-for-a-protection-id?protection-id=${row.protectionId}&points-to-calculate=25`

  return (
    <TableRow>
      <TableCell>
        <div className="flex">
          <Checkbox
            checked={selectedProtectionIds.includes(protectionInfo.boughtEvent.args.id)}
            onChange={(_, checked) =>
              dispatch(
                actions.setSelectedProtectionIds(
                  checked
                    ? [
                        ...selectedProtectionIds.filter(s => protectionInfo.boughtEvent.args.id !== s),
                        protectionInfo.boughtEvent.args.id,
                      ]
                    : selectedProtectionIds.filter(s => protectionInfo.boughtEvent.args.id !== s),
                ),
              )
            }
          />
          <a
            href=""
            onClick={e => {
              navigator.clipboard.writeText(`curl --location --request GET '${url_points}' | jq`)
              e.preventDefault()
            }}
            title="Copy to clipboard 25-points timeline of protection"
          >
            {row.protectionId}
          </a>
          <Link to={`/protection/${protectionInfo.boughtEvent.args.id}`}>
            <GetSvg svgName="link" className="fill-white" />
          </Link>
        </div>
      </TableCell>
      <TableCell>{row.protectionStartTimestamp}</TableCell>
      <TableCell>{row.protectionEndTimestamp}</TableCell>
      <TableCell>
        {row.status} ({(row.policyPeriodSeconds / (60 * 60 * 24)).toFixed(0)} days)
      </TableCell>
      <TableCell>
        <PoolPair tokenName1={row.tokenName1} tokenName2={row.tokenName2} />
      </TableCell>
      <TableCell>
        <DisplayNumber
          state={Stator.resolve(row.lpTokensWorthAtBuyTimeUSD)}
          tokenNameClassName="text-white"
          tokenNumberClassName="text-white"
          dollar={true}
        />
      </TableCell>
      <TableCell>
        <DisplayNumber
          state={Stator.resolve(row.premiumCostUSD)}
          tokenName={TokenName.USDC}
          tokenNameClassName="text-white"
          tokenNumberClassName="text-white"
          moreInfoInBrackets={`${catDecimalsWithRound((row.premiumCostUSD / row.lpTokensWorthAtBuyTimeUSD) * 100, 2)}%`}
        />
      </TableCell>
      <TableCell>
        <DisplayNumber
          state={Stator.resolve(row.embedDiscount ?? 0)}
          tokenName={TokenName.USDC}
          tokenNameClassName="text-white"
          tokenNumberClassName="text-white"
          moreInfoInBrackets={
            row.embedDiscount && `${catDecimalsWithRound(((row.embedDiscount ?? 0) / row.premiumCostUSD) * 100, 2)}%`
          }
        />
      </TableCell>
      <TableCell>
        {row.currentILsPercentage === undefined ? `-` : catDecimalsWithRound(row.currentILsPercentage, 2)}%
      </TableCell>
      <TableCell align="right">
        <DisplayNumber
          state={Stator.resolve(row.currentProtectionWorthUsdc)}
          moreInfoInBrackets={
            protectionInfo.status.payoutOrDuePayoutUsdc === 0 &&
            protectionInfo.status.withoutMinPayout.payoutOrDuePayoutUsdc
          }
          tokenName={TokenName.USDC}
          tokenNameClassName="text-white"
          tokenNumberClassName="text-white"
        />
      </TableCell>
    </TableRow>
  )
}

type Props = {
  protectionsInfo: ProtectionInfoDto[]
  open: boolean
}

export const ProtectionHistoryForAccount = ({ open, protectionsInfo }: Props) => {
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
              All active and expired protections for this account:
            </Typography>

            <ExpandTable
              headCells={[
                {
                  id: 'protectionId',
                  align: 'left',
                  numeric: true,
                  disablePadding: false,
                  label: 'Id',
                },
                {
                  id: 'protectionStartTimestamp',
                  align: 'left',
                  numeric: true,
                  disablePadding: true,
                  label: 'Start Date',
                },
                {
                  id: 'protectionEndTimestamp',
                  align: 'left',
                  numeric: true,
                  disablePadding: false,
                  label: 'End date',
                },
                {
                  id: 'status',
                  align: 'left',
                  numeric: false,
                  disablePadding: false,
                  label: 'Status',
                },
                {
                  id: 'pair',
                  align: 'left',
                  numeric: false,
                  disablePadding: false,
                  label: 'Pair',
                },
                {
                  id: 'lpTokensWorthAtBuyTimeUSD',
                  align: 'left',
                  numeric: true,
                  disablePadding: false,
                  label: 'Protected Amount',
                },
                {
                  id: 'premiumCostUSD',
                  align: 'left',
                  numeric: true,
                  disablePadding: false,
                  label: 'Premium $ (%)',
                },
                {
                  id: 'embedDiscount',
                  align: 'left',
                  numeric: true,
                  disablePadding: false,
                  label: 'Embed Discount $',
                },
                {
                  id: 'protectionWorthNow',
                  align: 'left',
                  numeric: true,
                  disablePadding: false,
                  label: 'IL (%)',
                },
                {
                  id: 'currentILsPercentage',
                  align: 'right',
                  numeric: true,
                  disablePadding: false,
                  label: 'Payout',
                },
              ]}
              rows={protectionsInfo.map<RowData>(protectionInfoDto => {
                const protectionStartTimestamp = new Date(
                  protectionInfoDto.boughtEvent.args.protectionStartTimestamp * 1000,
                ).toISOString()
                const protectionEndTimestamp = new Date(
                  protectionInfoDto.boughtEvent.args.protectionEndTimestamp * 1000,
                ).toISOString()

                return {
                  protectionInfo: protectionInfoDto,
                  currentILsPercentage: protectionInfoDto.status.ilPercentage ?? undefined,
                  currentProtectionWorthUsdc: protectionInfoDto.status.payoutOrDuePayoutUsdc,
                  lpTokensWorthAtBuyTimeUSD: protectionInfoDto.metadata.lpTokensWorthAtBuyTimeUsdc,
                  pair: `${protectionInfoDto.boughtEvent.args.tokenName1.ArmadilloSupportedTokenName}-${protectionInfoDto.boughtEvent.args.tokenName2.ArmadilloSupportedTokenName}`,
                  policyPeriodSeconds: protectionInfoDto.boughtEvent.args.policyPeriodSeconds,
                  premiumCostUSD: protectionInfoDto.boughtEvent.args.premiumCostUSD,
                  protectionId: protectionInfoDto.boughtEvent.args.id,
                  status: protectionInfoDto.expiredEvent ? 'Expired' : 'Active',
                  tokenName1: protectionInfoDto.boughtEvent.args.tokenName1.ArmadilloSupportedTokenName,
                  tokenName2: protectionInfoDto.boughtEvent.args.tokenName2.ArmadilloSupportedTokenName,
                  protectionWorthNow: protectionInfoDto.status.payoutOrDuePayoutUsdc,
                  protectionStartTimestamp: `${protectionStartTimestamp.split('T')[0]} ${
                    protectionStartTimestamp.split('T')[1].split('.')[0]
                  }`,
                  protectionEndTimestamp: `${protectionEndTimestamp.split('T')[0]} ${
                    protectionEndTimestamp.split('T')[1].split('.')[0]
                  }`,
                }
              })}
              renderRow={row => <Row key={row.protectionId} row={row} />}
            />
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  )
}
