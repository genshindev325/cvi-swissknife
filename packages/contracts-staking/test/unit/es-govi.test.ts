import { ethers } from 'hardhat'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { TestHelper, expect, adminRole } from '../utils'
import type { EsGOVI } from '../../../auto-generated-code/src/git-contract-types'
import { address1, address2, getAccessControlRevertStr } from '../../../contracts-il/test/utils'

describe('EsGOVI', () => {
  let helper: TestHelper
  let owner: SignerWithAddress
  let alice: SignerWithAddress

  let esGovi: EsGOVI
  let operatorRole: string

  before(async () => {
    helper = TestHelper.get(ethers)
    ;({ owner, alice } = await helper.getNamedSigners())
  })

  beforeEach(async () => {
    esGovi = await helper.deploy('EsGOVI', owner.address)

    operatorRole = await esGovi.OPERATOR_ROLE()

    await esGovi.connect(owner).grantRole(operatorRole, owner.address)
  })

  describe('initialize', () => {
    it('Should have correct init data', async () => {
      expect(await esGovi.name()).is.equal('Escrowed GOVI')
      expect(await esGovi.symbol()).is.equal('esGOVI')
      expect(await esGovi.owner()).is.equal(owner.address)
      expect(await esGovi.hasRole(adminRole, owner.address)).is.equal(true)
    })
  })

  describe('transfer', () => {
    it('Should transfer tokens', async () => {
      await esGovi.connect(owner).mint(owner.address, 1000)

      expect(await esGovi.balanceOf(alice.address)).is.equal(0)

      await esGovi.connect(owner).transfer(alice.address, 1000)

      expect(await esGovi.balanceOf(owner.address)).is.equal(0)
      expect(await esGovi.balanceOf(alice.address)).is.equal(1000)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(esGovi.connect(alice).transfer(address1, 1)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), operatorRole),
      )
    })
  })

  describe('transferFrom', () => {
    it('Should transfer tokens', async () => {
      await esGovi.connect(owner).mint(alice.address, 1000)

      expect(await esGovi.balanceOf(alice.address)).is.equal(1000)

      await esGovi.connect(owner).transferFrom(alice.address, owner.address, 1000)

      expect(await esGovi.balanceOf(owner.address)).is.equal(1000)
      expect(await esGovi.balanceOf(alice.address)).is.equal(0)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(esGovi.connect(alice).transferFrom(address1, address2, 1)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), operatorRole),
      )
    })
  })

  describe('mint', () => {
    it('Should revert on invalid permissions', async () => {
      await expect(esGovi.connect(alice).mint(address1, 1)).to.be.revertedWith('EsGOVI: forbidden')
    })
  })

  describe('burn', () => {
    it('Should burn tokens', async () => {
      expect(await esGovi.balanceOf(owner.address)).is.equal(0)

      await esGovi.connect(owner).mint(owner.address, 1000)

      expect(await esGovi.balanceOf(owner.address)).is.equal(1000)

      await esGovi.connect(owner).burn(owner.address, 1000)

      expect(await esGovi.balanceOf(owner.address)).is.equal(0)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(esGovi.connect(alice).burn(address1, 1)).to.be.revertedWith('EsGOVI: forbidden')
    })
  })
})
