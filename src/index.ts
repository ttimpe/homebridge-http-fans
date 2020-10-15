import { API } from 'homebridge'
import HTTPFanPlatform from './HTTPFanPlatform'

export = (api: API) => {
  api.registerPlatform('homebridge-http-fans', 'HTTPFans', HTTPFanPlatform);
}

