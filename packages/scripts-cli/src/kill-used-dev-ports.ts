import { killUsedPorts } from '@coti-cvi/common-be'

export async function killUsedDevPorts(ports: number[]): Promise<void> {
  await killUsedPorts(ports)
}
