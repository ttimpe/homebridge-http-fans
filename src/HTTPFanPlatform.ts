import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';

import HTTPFan from './HTTPFan'
import HTTPFanAccessory from './HTTPFanAccessory'
import HTTPFanService from './HTTPFanService'

export default class HTTPFanPlatform implements DynamicPlatformPlugin {
	public readonly Service: typeof Service = this.api.hap.Service;
	public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

	public accessories: PlatformAccessory[] = []
	public fanAccessories: HTTPFanAccessory[] = []

	public service: HTTPFanService

	private timer: any
	constructor(public readonly log: Logger, public readonly config: PlatformConfig, public readonly api: API) {
		api.on('didFinishLaunching', () => {
			this.didFinishLaunching();
		})
	}

	didFinishLaunching() {
		this.service = new HTTPFanService()
		this.createAccessories()		
		this.timer = setInterval(() => this.updateValues(), 10000)

	}

	async updateValues() {
		await this.service.fetchUpdates()
		for (var i=0; i<this.fanAccessories.length; i++) {
			this.fanAccessories[i].fanService.updateCharacteristic(this.Characteristic.Active, (this.fanAccessories[i].fan.speed != 0))
			this.fanAccessories[i].fanService.updateCharacteristic(this.Characteristic.RotationSpeed, this.fanAccessories[i].fan.speed)
			this.fanAccessories[i].fanService.updateCharacteristic(this.Characteristic.RotationDirection, this.fanAccessories[i].fan.clockwiseRotation)

		}
	}

	async createAccessories() {
		await this.service.getDevices()

		for (var i=0; i<this.service.fans.length; i++) {
				
				const uuid = this.api.hap.uuid.generate('homebridge-http-fans-' + this.service.fans[i].pin)
				let accessory = this.accessories.find(accessory => accessory.UUID === uuid)

				if (accessory) {
					this.log.info('Restoring cached accessory', accessory.displayName)
					this.api.updatePlatformAccessories([accessory])
				} else {
					this.log.info('Adding new device:', this.service.fans[i].name)
					accessory = new this.api.platformAccessory(this.service.fans[i].name, uuid)
					
					this.api.registerPlatformAccessories('homebridge-http-fans', 'HTTPFans', [accessory])
				}
				let fanAccessory = new HTTPFanAccessory(this, accessory, this.log, this.service.fans[i], this.service)
				this.fanAccessories.push(fanAccessory)
 
			}

	
		
	}
		configureAccessory(accessory: PlatformAccessory) {
		this.accessories.push(accessory)
	}
}