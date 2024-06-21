export type MenuItem = {
  description: string
  action: () => Promise<unknown>
  condition?: () => boolean
}
