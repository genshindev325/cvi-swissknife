import { BigNumber } from 'ethers'
import { roundCryptoValueString, fromNumber, toNumber } from '../../../lw-sdk/src/util/big-number'
import { expect } from '../utils'

describe('big number tests', () => {
  describe('from and to number tests', () => {
    it.skip('toNumber and back - 99999684530995210069410 - decimals 18', () => {
      const value = '99999684530995210069410'
      const number = toNumber(BigNumber.from(value), 18)
      const bigNumber = fromNumber(number, 18)
      expect(bigNumber.toString()).to.equal(value)
    })
  })
  describe('roundCryptoValueString tests', () => {
    describe('numbers test', () => {
      it('0.00056789 - decimals 0', () => {
        expect(roundCryptoValueString('0.00056789', 18)).to.equal('0.00056789')
      })
      it('0.00056789 - decimals 6', () => {
        expect(roundCryptoValueString('0.00056789', 6)).to.equal('0.000567')
      })
      it('0.00056789 - decimals 18', () => {
        expect(roundCryptoValueString('0.00056789', 18)).to.equal('0.00056789')
      })
      it('-0.00056789 - decimals 18', () => {
        expect(roundCryptoValueString('-0.00056789', 18)).to.equal('-0.00056789')
      })
      it('10 - decimals 0', () => {
        expect(roundCryptoValueString('10', 0)).to.equal('10')
      })
      it('10 - decimals 18', () => {
        expect(roundCryptoValueString('10', 18)).to.equal('10')
      })
      it('-10 - decimals 18', () => {
        expect(roundCryptoValueString('-10', 18)).to.equal('-10')
      })
    })
    describe('big numbers test', () => {
      it('35.82375230958602938652341928763 - decimals 0', () => {
        expect(roundCryptoValueString('35.82375230958602938652341928763', 0)).to.equal('35')
      })
      it('35.82375230958602938652341928763 - decimals 6', () => {
        expect(roundCryptoValueString('35.82375230958602938652341928763', 6)).to.equal('35.823752')
      })
      it('35.82375230958602938652341928763 - decimals 18', () => {
        expect(roundCryptoValueString('35.82375230958602938652341928763', 18)).to.equal('35.823752309586029386')
      })
      it('35.82375230958602938652341928763 - decimals 30', () => {
        expect(roundCryptoValueString('35.82375230958602938652341928763', 30)).to.equal(
          '35.82375230958602938652341928763',
        )
      })
    })
    describe('exponents test', () => {
      it('12345e+12 - decimals 0', () => {
        expect(roundCryptoValueString('12345e+12', 0)).to.equal('12345000000000000')
      })
      it('12345e+12 - decimals 6', () => {
        expect(roundCryptoValueString('12345e+12', 6)).to.equal('12345000000000000')
      })
      it('12345e+12 - decimals 18', () => {
        expect(roundCryptoValueString('12345e+12', 18)).to.equal('12345000000000000')
      })
      it('12345e+24 - decimals 6', () => {
        expect(roundCryptoValueString('12345e+24', 6)).to.equal('12345000000000000000000000000')
      })
      it('12345e+24 - decimals 18', () => {
        expect(roundCryptoValueString('12345e+24', 18)).to.equal('12345000000000000000000000000')
      })
      it('12345e-12 - decimals 6', () => {
        expect(roundCryptoValueString('12345e-12', 6)).to.equal('0')
      })
      it('12345e-12 - decimals 10', () => {
        expect(roundCryptoValueString('12345e-12', 10)).to.equal('0.0000000123')
      })
      it('12345e-12 - decimals 18', () => {
        expect(roundCryptoValueString('12345e-12', 18)).to.equal('0.000000012345')
      })
      it('1234567.89e-20 - decimals 0', () => {
        expect(roundCryptoValueString('1234567.89e-20', 0)).to.equal('0')
      })
      it('1234567.89e-20 - decimals 6', () => {
        expect(roundCryptoValueString('1234567.89e-20', 6)).to.equal('0')
      })
      it('1234567.89e-20 - decimals 18', () => {
        expect(roundCryptoValueString('1234567.89e-20', 18)).to.equal('0.000000000000012345')
      })
      it('1234567.89e-20 - decimals 20', () => {
        expect(roundCryptoValueString('1234567.89e-20', 20)).to.equal('0.00000000000001234567')
      })
      it('1234567.89e-20 - decimals 21', () => {
        expect(roundCryptoValueString('1234567.89e-20', 21)).to.equal('0.000000000000012345678')
      })
      it('1234567.89e-20 - decimals 22', () => {
        expect(roundCryptoValueString('1234567.89e-20', 22)).to.equal('0.0000000000000123456789')
      })
      it('1234567.89e-20 - decimals 50', () => {
        expect(roundCryptoValueString('1234567.89e-20', 50)).to.equal('0.0000000000000123456789')
      })
      it('1e-8 - decimals 4', () => {
        expect(roundCryptoValueString('1e-8', 4)).to.equal('0')
      })
      it('1e-8 - decimals 6', () => {
        expect(roundCryptoValueString('1e-8', 6)).to.equal('0')
      })
      it('1e-8 - decimals 10', () => {
        expect(roundCryptoValueString('1e-8', 10)).to.equal('0.00000001')
      })
      it('1e-8 - decimals 18', () => {
        expect(roundCryptoValueString('1e-8', 18)).to.equal('0.00000001')
      })
      it('7.89e-7 - decimals 4', () => {
        expect(roundCryptoValueString('7.89e-7', 4)).to.equal('0')
      })
      it('7.89e-7 - decimals 6', () => {
        expect(roundCryptoValueString('7.89e-7', 6)).to.equal('0')
      })
      it('7.89e-7 - decimals 8', () => {
        expect(roundCryptoValueString('7.89e-7', 8)).to.equal('0.00000078')
      })
      it('7.89e-7 - decimals 10', () => {
        expect(roundCryptoValueString('7.89e-7', 10)).to.equal('0.000000789')
      })
      it('7.89e-7 - decimals 18', () => {
        expect(roundCryptoValueString('7.89e-7', 18)).to.equal('0.000000789')
      })
      it('7.89e-7 - decimals 18', () => {
        expect(roundCryptoValueString('7.89e-7', 18)).to.equal('0.000000789')
      })
    })
  })
})
