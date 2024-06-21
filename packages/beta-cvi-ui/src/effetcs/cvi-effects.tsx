import { StakeEffects } from './stake-effects'
import { TvEffects } from './tv-effects'
import { VtEffects } from './vt-effects'

export function CviEffects() {
  return (
    <>
      <TvEffects />
      <VtEffects />
      <StakeEffects />
    </>
  )
}
