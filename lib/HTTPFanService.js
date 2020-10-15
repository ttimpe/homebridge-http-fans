"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios');
const ping = require('ping');
class HTTPFanService {
    constructor() {
        this.API_URL = 'http://192.168.2.18/fans';
    }
    pingtest(host) {
        return new Promise((res, rej) => {
            ping.sys.probe(host, function (isAlive) {
                res(isAlive);
            });
        });
    }
    async getDevices() {
        let output = [];
        let isAlive = await this.pingtest('192.168.2.18');
        if (isAlive) {
            try {
                let res = await axios.get(this.API_URL);
                if (res.status == 200) {
                    output = res.data;
                    for (var i = 0; i < output.length; i++) {
                        output[i].id = i;
                    }
                    return output;
                }
            }
            catch (error) {
                return output;
            }
        }
    }
    async setRotationSpeed(fan, value) {
        let isAlive = await this.pingtest('192.168.2.18');
        if (isAlive) {
            try {
                let res = await axios.get(this.API_URL + '/' + fan.id + '/speed/' + value);
                if (res.status == 200) {
                }
            }
            catch (error) {
            }
        }
    }
    async setClockwiseRotation(fan, value) {
        let isAlive = await this.pingtest('192.168.2.18');
        if (isAlive) {
            try {
                let url = this.API_URL + '/' + fan.id + '/direction/';
                if (value) {
                    url = url + 'clockwise';
                }
                else {
                    url = url + 'counter-clockwise';
                }
                let res = await axios.get(url);
                if (res.status == 200) {
                }
            }
            catch (error) {
            }
        }
    }
}
exports.default = HTTPFanService;