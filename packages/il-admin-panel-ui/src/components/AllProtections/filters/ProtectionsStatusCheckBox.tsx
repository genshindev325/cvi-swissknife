import { Box, Checkbox, FormControlLabel } from '@mui/material'
import { actions, useAppDispatch, useAppSelector } from '../../../redux'
import type { ProtectionStatus } from '../types'

export const StatusCheckBox = () => {
  const dispatch = useAppDispatch()
  const selectedStatuses = useAppSelector(state => state.selected.protectionStatuses)
  const allStatuses: ProtectionStatus[] = ['active', 'expired']

  return (
    <Box>
      <div className="justify-center flex items-center my-1 gap-4 flex-wrap ">
        <div className="flex">
          <h1 className="justify-center">Filter activity by protection Status:</h1>
        </div>

        {allStatuses.map((protectionStatus: ProtectionStatus) => (
          <div key={protectionStatus} className="text-white flex">
            <Box>
              <FormControlLabel
                label={protectionStatus}
                control={
                  <Checkbox
                    checked={selectedStatuses?.includes(protectionStatus)}
                    onChange={(_, checked) => {
                      dispatch(
                        actions.setSelectedProtectionsStatuses(
                          checked
                            ? [...selectedStatuses, protectionStatus]
                            : selectedStatuses.filter(p => p !== protectionStatus),
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
