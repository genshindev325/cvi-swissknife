import { Box, Checkbox, FormControlLabel } from '@mui/material'
import { PRODUCTION_MINIMUM_IL_PROTECTION_PERIOD_SECONDS } from '../../../constants'
import { actions, useAppDispatch, useAppSelector } from '../../../redux'

export const SelectedPeriodsCheckBox = () => {
  const dispatch = useAppDispatch()
  const fullMode = useAppSelector(state => state.fullMode)
  const supportedPeriods = useAppSelector(state => state.supportedPeriods)
  const selectedPeriods = useAppSelector(state => state.selected.periods)

  const finalSupportedPeriods = fullMode
    ? supportedPeriods
    : supportedPeriods.filter(s => s.periodSeconds >= PRODUCTION_MINIMUM_IL_PROTECTION_PERIOD_SECONDS)

  return (
    <Box>
      <div className="justify-center flex items-center my-1 gap-4 flex-wrap ">
        <div className="flex">
          <h1 className="justify-center">Filter activity by periods:</h1>
        </div>

        {finalSupportedPeriods
          .slice()
          .sort((a, b) => a.periodSeconds - b.periodSeconds)
          .map(period => (
            <div key={period.periodSeconds} className="text-white flex">
              <Box>
                <FormControlLabel
                  label={period.periodSecondsFormat}
                  control={
                    <Checkbox
                      checked={selectedPeriods.some(r => r.periodSeconds === period.periodSeconds)}
                      onChange={(_, checked) => {
                        dispatch(
                          actions.setSelectedPeriods(
                            checked
                              ? [...selectedPeriods, period]
                              : selectedPeriods.filter(p => p.periodSeconds !== period.periodSeconds),
                          ),
                        )
                      }}
                    />
                  }
                />
              </Box>
            </div>
          ))}
      </div>
    </Box>
  )
}
