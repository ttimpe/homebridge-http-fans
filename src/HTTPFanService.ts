const axios = require('axios')
const ping = require('ping')

import HTTPFan from './HTTPFan'

export default class HTTPFanService {
	private API_URL: string = 'http://192.168.2.18/fans'
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
		if (isAlive) {
			try {
				let res = await axios.get(this.API_URL)
				if (res.status == 200) {
					output = res.data as HTTPFan[]
					for (var i=0; i<output.length; i++) {
						output[i].id = i;
					}
					return output
				}
			} catch (error) {
				return output
			} 
		}
	}

	async setRotationSpeed(fan: HTTPFan, value: number) {
		let isAlive: boolean = await this.pingtest('192.168.2.18')
		if (isAlive) {
			try {
				let res = await axios.get(this.API_URL + '/' + fan.id + '/speed/' + value)
				if (res.status == 200) {
				}
			} catch (error) {

			}
		}
	}
	async setClockwiseRotation(fan: HTTPFan, value: boolean) {
		let isAlive: boolean = await this.pingtest('192.168.2.18')
		if (isAlive) {
			try {
				let url = this.API_URL + '/' + fan.id + '/direction/';
				if (value) {
					url = url + 'clockwise';
				} else {
					url = url + 'counter-clockwise';
				}

				let res = await axios.get(url)
				if (res.status == 200) {

				}
			} catch (error) {

			}
		}
	}
}