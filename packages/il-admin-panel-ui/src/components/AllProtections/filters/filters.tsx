import type { FC } from 'react'
import { useAppSelector } from '../../../redux'
import { AccountTypesCheckBox } from './AccountTypeCheckbox'
import { EmbedDiscountsCheckBox } from './EmbedDiscountsCheckBox'
import { ProtectedAmountRange } from './ProtectedAmountRange'
import { ProtectionsDateRange } from './ProtectionsDateRange'
import { StatusCheckBox } from './ProtectionsStatusCheckBox'
import { SelectedPairsCheckBox } from './SupportedPairsCheckbox'
import { SelectedPeriodsCheckBox } from './SupportedPeriodsCheckbox'

type Props = {}

export const Filters: FC<Props> = () => {
  const fullMode = useAppSelector(state => state.fullMode)

  return (
    <div>
      <ProtectedAmountRange />
      <ProtectionsDateRange />

      {fullMode && <AccountTypesCheckBox />}
      <SelectedPairsCheckBox />
      <SelectedPeriodsCheckBox />
      <StatusCheckBox />
      <EmbedDiscountsCheckBox />
    </div>
  )
}
