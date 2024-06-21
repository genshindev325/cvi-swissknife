import { Box, Checkbox, FormControlLabel } from '@mui/material'
import { actions, useAppDispatch, useAppSelector } from '../../../redux'
import { EMBED_NO_DISCOUNT } from '../types'

export const EmbedDiscountsCheckBox = () => {
  const dispatch = useAppDispatch()
  const selectedEmbedDiscountsTypes = useAppSelector(state => state.selected.embedDiscountsTypes)
  const embedStatistics = useAppSelector(state => state.embedStatistics)

  return (
    <Box>
      <div className="justify-center flex items-center my-1 gap-4 flex-wrap ">
        <div className="flex">
          <h1 className="justify-center">Filter By Embed Discounts:</h1>
        </div>

        {[...embedStatistics, EMBED_NO_DISCOUNT].map(type => (
          <div key={type.typeId} className="text-white flex">
            <Box>
              <FormControlLabel
                label={type.name}
                control={
                  <Checkbox
                    checked={selectedEmbedDiscountsTypes.some(s => s.typeId === type.typeId)}
                    onChange={(_, checked) => {
                      dispatch(
                        actions.setSelectedEmbedDiscountTypes(
                          checked
                            ? [...selectedEmbedDiscountsTypes, type]
                            : selectedEmbedDiscountsTypes.filter(p => p.typeId !== type.typeId),
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
