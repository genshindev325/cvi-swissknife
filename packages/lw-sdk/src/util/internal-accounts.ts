import { AddressGroup } from '../admin-panels'
import type { CviContractsInversifyService } from '../cvi-contracts'

// QA Shiran addr.
const qaPersonalAccounts = new Set(['0x9956513dc7ba8bbfccd15c75bd1b90adcd0f16b6'].map(addr => addr.toLowerCase()))

// Oded's addresses
const cotiFinanceInternalAccountsOded = new Set(
  [
    '0x3aab67566a45403690bbe09c011bd59fdbb6ed6c',
    '0x1744883f2b2d515454463352cd5ae01bc9c11e32',
    '0xc55399f3ba8e7b2cdffe18cb2e73084b72eaec36',
    '0x7e99d9f34fe85dfcb35f5ac5d762f4e0cd634987',
    '0x9605be4cf2fc0527a21b8f9d94273ce7790dddab',
    '0x8859e298ae1a1bba2dc6f3f1e10d99573a4d081d',
    '0xd48e0f3e5fe5b21952c2a26943e2fe91772dd35f',
    '0x297449726771607bbe3437dd3995d0cb463e333b',
    '0x264926c6d252a70bc39c06919d54eb6f67bd3f56',
    '0xa48ff3e5e3d9e38901e3c2cdba74481b797def02',
    '0x05016c1a53a0d100da5b165093926bdc0f8faed4',
    '0x439e99ceedad3241d44024e3a248c36cc941ac57',
    '0xbccde834a697dca96ee20cf5c6315e06fb9b24e1',
    '0xac73c0bf53c55990d80d870529ec32727fed3812',
    '0x407e4787ecb39f1b3aef1c6b33ce76e7b3e0a35d',
    '0xa621e2010eb75ed9a4dd1155f29904901d78713f',
    '0x353d3fa77727e220c1f1138bc597c22f3f6d3df2',
    '0x76a0fbbede75e828ab94c7e5d520a64d55e72b2c',
    '0x19bcbc33e47d27b5e17e6783f85b0043be01d8e5',
    '0x8f821729b449a9454cc1c370dcdfc53b3b356861',
    '0x5548150c72f6ee3ded40e7470b5ee992c9e6d4ca',
    '0x658cac12d016be53cac0001af99e3a60548f3851',
    '0x3ec3ed32d1d5d5d916fdd53b579a83c7e90d444c',
    '0xb085cba2ddcc6fda9f8ed7d8d8f3c230af305d09',
    '0x2d42401ce1a232a609a2f2094afa30113f08da7b',
    '0x061f26555dfeb67886da09bf681ffb1d92d5c20d',
    '0x50419e3ebeca97926493f9bf7aa78f6114336cce',
    '0x7b5b1102ed3d50dab67d2ca6b11670da11f94252',
    '0xbfa8387aa449f95e300de2aa29491f281a4f2b7f',
    '0xc5255b9ff5c4236ca78f15db4586fcefc6e3d3a0',
    '0x7abc47aecc49b8963f904906c7bf49ce7346bd13',
  ].map(addr => addr.toLowerCase()),
)

// hardhat derived from mnemonic - 50 first accounts to which we distribute coins on hardhat deploy
const hardHatInternalDerivedList = new Set(
  [
    '0xcedad8c0ae5e0a878c01cc8c81e0ca2dba909ded',
    '0xaf51e83c5090ec95d7399fe0b5a77d59100c31d8',
    '0xf8d74c0cf0aebbd58401f18a1382368eb00efc2d',
    '0xf96d287c32e3a084f58df853a60c4453e4803951',
    '0x12bb75e5938f3d2f11f0ad46b768a7a1b262674a',
    '0x72b31859c516947ce37a13bf0e6d4ad51d151a8e',
    '0x5f83c88b09557e2bb6c6113a77750a709be94573',
    '0x54036f5190a4499c8b02147639442233df26f049',
    '0x977cf01abaa56880e6d13569834587f6b887f2e4',
    '0xcf873380a46b4a85519e7f0c7e85d676efa462ab',
    '0x0a6096eb768c696d437bb26ff6890ee8ca17cab9',
    '0x0b3d7b3f149214f8f5281b5ae613b090fd39bd3f',
    '0x58af860ed232fd3e9b525e599ca59b329b7f5df8',
    '0x1279dbb468aad9d178ad45377c5e7ec8c13b9d6a',
    '0x705d65c9f1d4b8a46049bfe3b3410cf7e5ec9f02',
    '0x3f64ba5e52b881233961f64c1503cda77404b3dc',
    '0x590a84a9b0ba511b83b4de5903cfb726f317a246',
    '0xed891f909e9e67f24e81356fc348350cbba3cc0a',
    '0xb63d2772e0306bb827567f5e25dd40074be266a2',
    '0x3e85947f986c57391147cdf7812b6001039298f3',
    '0x783a6aa7f941a8708ce7dfdcd6ef3dd766c3e7cb',
    '0xf31ad16035645d29bfc4c34013e5fbc037997222',
    '0x73d665dcf8d7c9a9c8797b201fe6191842e04065',
    '0x9fe5217a535185c164a3e6274c917ced15843fcf',
    '0x743ac4caeeb2596230ebe9035081f1dcb1c966ac',
    '0xc44bd81a08c1e8afcaaa959212ff1887dd8c572f',
    '0x1505fb0435dc83e3a0a1f5780a991008382e8262',
    '0x4098340b0a5afee21c65854a799ecb534abb9429',
    '0x5329d6e64c51999b95bed9eafff35d9866df4167',
    '0xf24ed4335f0a17b5188b6f43fcacb7f518e4dbd6',
    '0xd0d03246cd4d292a194bd6170ba3112cda284efb',
    '0x6a0e41ed632eeffcf073d9e9962a81ca0658e56c',
    '0x26100ba520d890f8f912a65e14758e24a0aed988',
    '0x6b8ec1ae6c4615c51206ce53ccaf87a17c850f1c',
    '0xff81905faebade4e503ba51c2d951ed615b8f265',
    '0x571ff89d1299a1e94b25a3373aa3df1df0fb50a9',
    '0x61d6c3bfa831030335f6735845e98bf49f071800',
    '0x18e5f4583f03e5eed270e298b9460dc2b9d58e33',
    '0x2d38d175eb8ae89e25f82ad2dc956789e858b644',
    '0xf0c9800072a5704889f225d53e356e788e22866f',
    '0xc82a70f67d0de75bcafb5ccd40ca9e28357d06e8',
    '0xda1915c54ad8a50eb7b63342ab2cf35e653686e2',
    '0x9f854951564542d11e1aa7740577e4fa5fbc3503',
    '0xcf2c4d984f22dff34c712fac83e57582332bba82',
    '0x1d8a85d4125868745bb9b589d0b918203bfe217c',
    '0x14d74b214f6b98a2e119d8e4be5bfdb5bab43890',
    '0xccf7fa0a5991ef49de8b02bcb421a33d7d11c4f5',
    '0xbb3231bd72417355438b997f180a1de0f9d86981',
    '0xc627a1de61a758560da136347e546c028b6f6a39',
    '0x40c50a80b499e9367a7360789981db36d9a67a04',
    '0xdf9622a7cf0e5f08dfb74b39741f774ce7655033',
    '0x187a12f82bcaa8e6f29a950b99bc3b164a5c278c',
    '0x2f02e5b098863e2c5386c16ebcdf7ab847cfa49f',
    '0x5f71b4007c279f026660bc473100a9fc80412b80',
  ].map(addr => addr.toLowerCase()),
)

// sent by Oded 26/06 to Ami
const OtherInternalAccountsOded = new Set(
  [
    '0x157fc45fad5a4986f30892406f4fafa5b7aa0e1f', // has protection for protection period less than 14 days
    '0xeb7693a9b457afb359cd2ff4691ff16fd40fd382', // has protection for protection period less than 14 days
    '0x4b94417ed7141cd90c9f769633d01df81c94457a', // has protection for protection period less than 14 days
    '0x3e898091cb15f2c284cf1907cf9a50b8846044ce', // has protection for protection period less than 14 days
    '0x0cfc7e21b96ed24a8d0ff87696482ca5bb71125e', // has protection for protection period less than 14 days
    '0xbb793c954cc6c4c84c65373bfce924c7a0b7108e', // has protection for protection period less than 14 days
    '0x5c3e0c43a13544a81730a2cf5ae94cbc282f2ec2', // has protection for protection period less than 14 days
    '0x5a6a3041482503e17b2c90d3824fe602c864cb50', // YONI AMA
    '0xf3f7152F6B5E63577f8F4dAf65B3AA1e78c8f402', // AMI mob
    '0xD324d6A2C1b880065649501AeAC1094d7152D27D', // il-monitor-recurring-premium-buyer-bot
    '0x1048D6FeCa9fE38F2B2335b3A37b3b9110C4BaD2', // tv depositors
    '0x27C16625442956Cb2C20A5347C5391328eb087DD',
    '0x1048D6FeCa9fE38F2B2335b3A37b3b9110C4BaD2',
  ].map(addr => addr.toLowerCase()),
)

const cviLiquidityProviderArbitrum = '0xB7757a307d86537299a5972d363cc2d2ae49394f'.toLowerCase()

const moreInternalAccounts = new Set(
  [
    '0xA6CfB39C86bbe4cD76bE20Cb406Fd7b3e5f76E55', // stav - CVI-Theta-Test-1-Arb-Mainnet
  ].map(addr => addr.toLowerCase()),
)

export const isInternalEVMAddress = (address: string) => {
  return (
    cviLiquidityProviderArbitrum.toLowerCase() === address.toLowerCase() ||
    moreInternalAccounts.has(address.toLowerCase()) ||
    hardHatInternalDerivedList.has(address.toLowerCase()) ||
    qaPersonalAccounts.has(address.toLowerCase()) ||
    cotiFinanceInternalAccountsOded.has(address.toLowerCase()) ||
    OtherInternalAccountsOded.has(address.toLowerCase()) ||
    [
      '0xB79b2c69C0422ED1cf28FbbE7ee4Db613D7bA2f9',
      '0x5A4c3325E0D918AcABFe00DA77eF85763f1a818f',
      '0xcf95a364b7580D752831b218Cce9501Ec91E1616',
      '0x6D19C31Cc85120e40876E67ec2b409Dd32025384',
      '0x628Ea12FA98C4731Ae8E67294977B1Cc8EAF7161',
    ]
      .map(s => s.toLowerCase())
      .includes(address.toLowerCase())
  )
}
const LOUT_POWER_USER = '0x3e898091cb15f2c284cf1907cf9a50b8846044ce'

const OTHER_POWER_USERS = [
  '0x157fc45fad5a4986f30892406f4fafa5b7aa0e1f',
  '0xeb7693a9b457afb359cd2ff4691ff16fd40fd382',
  '0x4b94417ed7141cd90c9f769633d01df81c94457a',
  '0x0cfc7e21b96ed24a8d0ff87696482ca5bb71125e',
  '0xbb793c954cc6c4c84c65373bfce924c7a0b7108e',
  '0x5c3e0c43a13544a81730a2cf5ae94cbc282f2ec2',
]

const GNOSIS_SAFE: Record<string, string> = {
  '0xB7757a307d86537299a5972d363cc2d2ae49394f': 'Gnosis Safe - Cvi Liquidity', // arbiturm
}

const YONI_ACCOUNTS = new Set(
  ['0xa1501E5351975904C356Fec9184c8C3B99854cbf', '0x6D19C31Cc85120e40876E67ec2b409Dd32025384'].map(a =>
    a.toLowerCase(),
  ),
)
const COSTA_ACCOUNTS = new Set(
  [
    '0x916A78D226e086E64004DDFfbb1187449D69d06f',
    '0x8E5f43CBCAE43a3CEE467CB92D34Af1a57c66173',
    '0xd982EF4b1FA8004b54a515294fa831Abcd1B4285',
  ].map(a => a.toLowerCase()),
)

const cviUsdcArbiturmSushiSwap = '0xC73d2191A1dD0a99B377272899A5569eD83f8cd8'

export const CVI_V3_ARBITRAGE_BOT_ADDRESS = '0x6D5646D8a7536EbA4Ef1fad41A408a603aA0E925'

export const oneInchDexAddresses = ['0x1111111254EEB25477B68fb85Ed929f73A960582']
export const arbSushiswapCviUsdcPoolAddress = '0xeDE0CE8cdc65bcF6422f3Afb9d7cDb3e59C09658'

export const getAddressGroupAndName = (
  address: string,
  cviContractsInversifyService: CviContractsInversifyService,
): { addressGroup: AddressGroup; addressName?: string } => {
  if (address.toLowerCase() === '0x0000000000000000000000000000000000000000'.toLowerCase()) {
    return {
      addressGroup: AddressGroup.CVI_CONTRACTS,
      addressName: 'Zero Address',
    }
  }

  if (address.toLowerCase() === LOUT_POWER_USER.toLowerCase()) {
    return {
      addressGroup: AddressGroup.USERS,
      addressName: 'Lout Power User',
    }
  }

  if (OTHER_POWER_USERS.map(a => a.toLowerCase()).includes(address.toLowerCase())) {
    return {
      addressGroup: AddressGroup.USERS,
      addressName: 'Power User',
    }
  }

  if (oneInchDexAddresses.map(a => a.toLowerCase()).includes(address.toLowerCase())) {
    return {
      addressGroup: AddressGroup.DEX_CONTRACTS,
      addressName: 'arb/1inch/CVI-USDC',
    }
  }

  if (['0x521709B3Cd7F07e29722Be0Ba28a8Ce0e806Dbc3'].map(a => a.toLowerCase()).includes(address.toLowerCase())) {
    return {
      addressGroup: AddressGroup.DEX_CONTRACTS,
      addressName: 'arb/1inch/CVI-USDC/not-relevant',
    }
  }

  if (['0x8165c70b01b7807351EF0c5ffD3EF010cAbC16fB'].map(a => a.toLowerCase()).includes(address.toLowerCase())) {
    return {
      addressGroup: AddressGroup.DEX_CONTRACTS,
      addressName: 'arb/sushiswap/lp/not-relevant',
    }
  }

  const contractName = cviContractsInversifyService.getContractName(address.toLowerCase())

  if (contractName) {
    return {
      addressGroup: AddressGroup.CVI_CONTRACTS,
      addressName: contractName,
    }
  }

  if (cviUsdcArbiturmSushiSwap.toLowerCase() === address.toLowerCase()) {
    return {
      addressGroup: AddressGroup.DEX_CONTRACTS,
      addressName: 'arb/sushiswap/CVI-USDC',
    }
  }
  if ('0x905dfCD5649217c42684f23958568e533C711Aa3'.toLowerCase() === address.toLowerCase()) {
    return {
      addressGroup: AddressGroup.DEX_CONTRACTS,
      addressName: 'arb/WETH-USDC',
    }
  }

  if (GNOSIS_SAFE[address]) {
    return {
      addressGroup: AddressGroup.GNOSIS_SAFE,
      addressName: GNOSIS_SAFE[address],
    }
  }

  if (
    cotiFinanceInternalAccountsOded.has(address.toLowerCase()) ||
    OtherInternalAccountsOded.has(address.toLowerCase())
  ) {
    return {
      addressGroup: AddressGroup.COMMUNITY,
      addressName: 'Coti-O',
    }
  }

  if (YONI_ACCOUNTS.has(address.toLowerCase())) {
    return {
      addressGroup: AddressGroup.COMMUNITY,
      addressName: 'Vol Trader', // yoni
    }
  }

  if (COSTA_ACCOUNTS.has(address.toLowerCase())) {
    return {
      addressGroup: AddressGroup.COMMUNITY,
      addressName: 'CVI OG', // costa
    }
  }

  if (['0x72B31859c516947cE37A13bf0e6d4AD51d151A8e'.toLowerCase()].includes(address.toLowerCase())) {
    return {
      addressGroup: AddressGroup.COMMUNITY,
      addressName: 'Shared',
    }
  }

  if ([CVI_V3_ARBITRAGE_BOT_ADDRESS.toLowerCase()].includes(address.toLowerCase())) {
    return {
      addressGroup: AddressGroup.COMMUNITY,
      addressName: 'Arbitrage Bot',
    }
  }

  if (isInternalEVMAddress(address.toLowerCase())) {
    return {
      addressGroup: AddressGroup.COMMUNITY,
    }
  }

  return {
    addressGroup: AddressGroup.USERS,
  }
}
