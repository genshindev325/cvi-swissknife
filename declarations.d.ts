/// <reference types="vite/client" />

declare module 'is-ethereum-address' {
  export default function (address: string): boolean
}

declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}
