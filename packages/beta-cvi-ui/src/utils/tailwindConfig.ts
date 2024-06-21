import type { Overwrite } from '@coti-cvi/lw-sdk'
import type { TailwindConfig } from 'tailwindcss/tailwind-config'

declare const tailwindConfigReplaceByViteAtCompileTime: Overwrite<
  TailwindConfig,
  {
    theme: {
      screens: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
      }
    }
  }
>

export const tailwindConfig = tailwindConfigReplaceByViteAtCompileTime
