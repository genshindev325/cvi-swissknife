import { Box, Checkbox, FormControlLabel } from '@mui/material'
import { actions, useAppDispatch, useAppSelector } from '../../../redux'
import type { AccountType } from '../types'

type Props = {}

export const AccountTypesCheckBox = ({}: Props) => {
  const dispatch = useAppDispatch()
  const accountTypes = useAppSelector(state => state.selected.accountTypes)

  return (
    <Box>
      <div className="justify-center flex items-center my-1 gap-4 flex-wrap ">
        <div className="flex">
          <h1 className="justify-center">Filter activity by Account Types:</h1>
        </div>

        <div className="text-white flex">
          <Box>
            <FormControlLabel
              label="Internal accounts"
              control={
                <Checkbox
                  checked={accountTypes.includes('internal')}
                  onChange={(_, checked) => {
                    dispatch(
                      actions.setSelectedAccountTypes(
                        checked
                          ? [...new Set<AccountType>([...accountTypes, 'internal'])]
                          : accountTypes.filter(x => x !== 'internal'),
                      ),
                    )
                  }}
                />
              }
            />
          </Box>
        </div>
        <div className="text-white flex">
          <Box>
            <FormControlLabel
              label="External accounts"
              control={
                <Checkbox
                  checked={accountTypes.includes('external')}
                  onChange={(_, checked) =>
                    dispatch(
                      actions.setSelectedAccountTypes(
                        checked
                          ? [...new Set<AccountType>([...accountTypes, 'external'])]
                          : accountTypes.filter(x => x !== 'external'),
                      ),
                    )
                  }
                />
              }
            />
          </Box>
        </div>
      </div>
    </Box>
  )
}
