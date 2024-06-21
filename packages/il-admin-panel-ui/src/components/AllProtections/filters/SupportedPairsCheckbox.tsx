import { Box, Checkbox, FormControlLabel } from '@mui/material'
import type { ArmadilloSupportedPair } from '@coti-cvi/lw-sdk'
import { actions, useAppDispatch, useAppSelector } from '../../../redux'

const pairToString = (pair: ArmadilloSupportedPair) => `${pair.tokenName1}-${pair.tokenName2}`

export const SelectedPairsCheckBox = () => {
  const dispatch = useAppDispatch()
  const selectedPairs = useAppSelector(state => state.selected.pairs)
  const supportedPairs = useAppSelector(state => state.supportedPairs)

  return (
    <Box>
      <div className="justify-center flex items-center my-1 gap-4 flex-wrap ">
        <div className="flex">
          <h1 className="justify-center">Filter activity by pairs:</h1>
        </div>

        {supportedPairs.map(pair => (
          <div key={pairToString(pair)} className="text-white flex">
            <Box>
              <FormControlLabel
                label={pairToString(pair)}
                control={
                  <Checkbox
                    checked={selectedPairs.some(
                      p =>
                        (p.tokenName1 === pair.tokenName1 && p.tokenName2 === pair.tokenName2) ||
                        (p.tokenName2 === pair.tokenName1 && p.tokenName1 === pair.tokenName2),
                    )}
                    onChange={(_, checked) => {
                      dispatch(
                        actions.setSelectedPairs(
                          checked ? [...selectedPairs, pair] : selectedPairs.filter(p => p !== pair),
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
