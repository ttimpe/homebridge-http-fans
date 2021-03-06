const axios = require('axios')
const ping = require('ping')

import HTTPFan from './HTTPFan'

export default class HTTPFanService {
	private API_URL: string = 'http://192.168.2.18/fans'
	public fans: HTTPFan[] = []
	constructor() {

	}

	pingtest(host: string): any {
		return new Promise((res, rej) => {
			ping.sys.probe(host, function (isAlive: boolean) {
				res(isAlive)
			});
		})
	}

	async getDevices() {
		let output: HTTPFan[] = []
		let isAlive: boolean = await this.pingtest('192.168.2.18')
		console.log('arduino is alive: ', isAlive)
		if (isAlive) {
			try {
				let res = await axios.get(this.API_URL)
				if (res.status == 200) {
					output = res.data as HTTPFan[]
					for (var i=0; i<output.length; i++) {
						output[i].id = i;
					}
					this.fans = output;
				}
			} catch (error) {
				console.log('Got error while trying to fetch fans', error)
			} 
		}
	}


	async fetchUpdates() {
		let isAlive: boolean = await this.pingtest('192.168.2.18')
		console.log('arduino is alive: ', isAlive)
		if (isAlive) {
			try {
				let res = await axios.get(this.API_URL)
				if (res.status == 200) {
					var updated = res.data as HTTPFan[]
					for (var i=0; i<this.fans.length; i++) {
						this.fans[i].power = updated[i].power
						this.fans[i].speed = updated[i].speed
						this.fans[i].clockwiseRotation = updated[i].clockwiseRotation
					}
				}
			} catch (error) {
				console.log('Got error while trying to fetch fans', error)
			} 
		}
	}

	async setRotationSpeed(fan: HTTPFan, value: number) {
		let isAlive: boolean = await this.pingtest('192.168.2.18')
		console.log('[HTTPFans] setRotationSpeed: arduino is alive: ', isAlive)

		if (isAlive) {
			try {
				let url = this.API_URL + '/' + fan.id + '/speed/' + value
				console.log('Setting rotation speed with URL', url)
				let res = await axios.get(url)
				if (res.status == 200) {
				}
			} catch (error) {
				console.debug('Got error while setClockwiseRotation', error)

			}
		}
	}
	async setClockwiseRotation(fan: HTTPFan, value: boolean) {
		let isAlive: boolean = await this.pingtest('192.168.2.18')
		console.log('[HTTPFans] setClockwiseRotation: arduino is alive: ', isAlive)

		if (isAlive) {
			try {
				let url = this.API_URL + '/' + fan.id + '/direction/';
				if (value) {
					url = url + 'clockwise';
				} else {
					url = url + 'counter-clockwise';
				}
				console.log('setClockwiseRotation with url', url)

				let res = await axios.get(url)
				if (res.status == 200) {

				}
			} catch (error) {
				console.debug('Got error while setClockwiseRotation', error)
			}
		}
	}

	async setPowerState(fan: HTTPFan, value: boolean) {
		let isAlive: boolean = await this.pingtest('192.168.2.18')
		console.log('[HTTPFans] setPowerState: arduino is alive: ', isAlive)

		if (isAlive) {
			try {
				let url = this.API_URL + '/' + fan.id + '/power/';
				if (value) {
					url = url + 'on';
				} else {
					url = url + 'off';
				}
				console.log('setPowerState with url', url)

				let res = await axios.get(url)
				if (res.status == 200) {

				}
			} catch (error) {
				console.debug('Got error while setPowerState', error)
			}
		}
	}
}