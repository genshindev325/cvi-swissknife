import axios from 'axios'
import { inject, injectable } from 'inversify'
import type { GlobalEventsInversifyService } from './global-events.inversify.service'

@injectable()
export class IpGeoLocationInversifyService {
  constructor(
    @inject('GlobalEventsInversifyService') public readonly globalEventsInversifyService: GlobalEventsInversifyService,
  ) {}

  public async isCurrentIpApproved(): Promise<boolean> {
    try {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

      if (isLocalhost) {
        return true
      }

      const r = await axios.get<{
        ip_address: string
        city: null
        city_geoname_id: null
        region: null
        region_iso_code: null
        region_geoname_id: null
        postal_code: null
        country: string
        country_code: string // ISO 3166 (Alpha-2 code) <<<<<<<<<<<<-------------------
        country_geoname_id: number
        country_is_eu: boolean
        continent: string
        continent_code: string
        continent_geoname_id: number
        longitude: number
        latitude: number
        security: {
          is_vpn: boolean
        }
        timezone: {
          name: string
          abbreviation: string
          gmt_offset: number
          current_time: string
          is_dst: boolean
        }
        flag: {
          emoji: string
          unicode: string
          png: string
          svg: string
        }
        currency: {
          currency_name: string
          currency_code: string
        }
        connection: {
          autonomous_system_number: number
          autonomous_system_organization: string
          connection_type: string
          isp_name: string
          organization_name: string
        }
        // https://app.abstractapi.com/api/ip-geolocation/tester
      }>('https://ipgeolocation.abstractapi.com/v1/?api_key=bdaf26c1d1e04718ac1034144cd4ebb5')

      const whitelistIps = ['192.115.120.233', '62.90.236.5', '84.110.125.250']

      if (whitelistIps.some(ip => ip === r.data.ip_address)) {
        return true
      }

      // ISO 3166 (Alpha-2 code): https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
      const unapprovedCodes: string[] = [
        // 10/11/2022 - COTI LIST OF BLOCKED COUNTRIES - Albania, Barbados, Burkina Faso, BVI, Cambodia, Canada, Cayman Islands, Democratic People's Republic of Korea (DPRK), Gibraltar, Haiti, Iran, Israel, Jamaica, Jordan, Lebanon, Mali, Morocco, Myanmar, Nicaragua, Pakistan, Panama, Puerto Rico, Russia, Senegal, South Sudan, Syria, Uganda, United States of America (USA) and U.S territories, Yemen.
        'AL',
        'BB',
        'BF',
        'VG',
        'KH',
        'CA',
        'KY',
        'KP',
        'GI',
        'HT',
        'IR',
        'IL',
        'JM',
        'JO',
        'LB',
        'ML',
        'MA',
        'MM',
        'NI',
        'PK',
        'PA',
        'PR',
        'RU',
        'SN',
        'SS',
        'SY',
        'UG',
        'US',
        'YE',
      ]
      return !unapprovedCodes.map(c => c.toUpperCase()).includes(r.data.country_code.toUpperCase())
    } catch (error) {
      this.globalEventsInversifyService.eventEmitter.emit('errors', error)
      return true
    }
  }
}
