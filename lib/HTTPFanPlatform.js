"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HTTPFanAccessory_1 = __importDefault(require("./HTTPFanAccessory"));
const HTTPFanService_1 = __importDefault(require("./HTTPFanService"));
class HTTPFanPlatform {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;
        this.accessories = [];
        this.fanAccessories = [];
        api.on('didFinishLaunching', () => {
            this.didFinishLaunching();
        });
    }
    didFinishLaunching() {
        this.service = new HTTPFanService_1.default();
        this.createAccessories();
        this.timer = setInterval(() => this.updateValues(), 10000);
    }
    async updateValues() {
        await this.service.fetchUpdates();
        for (var i = 0; i < this.fanAccessories.length; i++) {
            this.fanAccessories[i].fanService.updateCharacteristic(this.Characteristic.Active, this.fanAccessories[i].fan.power);
            this.fanAccessories[i].fanService.updateCharacteristic(this.Characteristic.RotationSpeed, this.fanAccessories[i].fan.speed);
            this.fanAccessories[i].fanService.updateCharacteristic(this.Characteristic.RotationDirection, this.fanAccessories[i].fan.clockwiseRotation);
        }
    }
    async createAccessories() {
        await this.service.getDevices();
        for (var i = 0; i < this.service.fans.length; i++) {
            const uuid = this.api.hap.uuid.generate('homebridge-http-fans-' + this.service.fans[i].pin);
            let accessory = this.accessories.find(accessory => accessory.UUID === uuid);
            if (accessory) {
                this.log.info('Restoring cached accessory', accessory.displayName);
                this.api.updatePlatformAccessories([accessory]);
            }
            else {
                this.log.info('Adding new device:', this.service.fans[i].name);
                accessory = new this.api.platformAccessory(this.service.fans[i].name, uuid);
                this.api.registerPlatformAccessories('homebridge-http-fans', 'HTTPFans', [accessory]);
            }
            let fanAccessory = new HTTPFanAccessory_1.default(this, accessory, this.log, this.service.fans[i], this.service);
            this.fanAccessories.push(fanAccessory);
        }
    }
    configureAccessory(accessory) {
        this.accessories.push(accessory);
    }
}
exports.default = HTTPFanPlatform;
