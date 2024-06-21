export interface CVIError {
  code: number
  reason: string
}

export const isUsIpError: CVIError = { code: 470, reason: 'Should not allow to serve US IP addresses' }
export const isIsraelIpError: CVIError = { code: 470, reason: 'Should not allow to serve Israel IP addresses' }
export const noLatestCVIDataError: CVIError = { code: 570, reason: 'Could not fetch latest CVI data' }
