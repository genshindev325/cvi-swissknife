import type { BlockchainName } from '@coti-cvi/lw-sdk'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'

type Props = {
  blockchainName: BlockchainName
}

const BlockchainNameAndIcon = ({ blockchainName }: Props) => {
  return (
    <div className="capitalize flex items-center gap-2">
      <GetSvg svgName={blockchainName} className="w-8 h-8 relative" />
      {blockchainName}
    </div>
  )
}

export default BlockchainNameAndIcon
