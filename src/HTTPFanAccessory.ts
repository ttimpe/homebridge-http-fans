const ping = require('ping');
const fs = require('fs');

const http = require('http');

import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic, CharacteristicSetCallback, CharacteristicGetCallback, CharacteristicValue } from 'homebridge';
import HTTPFan from './HTTPFan'
import HTTPFanPlatform from './HTTPFanPlatform'
import HTTPFanService from './HTTPFanService'

// --== MAIN CLASS ==--
export default class HTTPFanAccessory {
    public readonly Service: typeof Service = this.platform.api.hap.Service;
    public readonly Characteristic: typeof Characteristic = this.platform.api.hap.Characteristic;

    public fanService: Service

    constructor(public readonly platform: HTTPFanPlatform, public accessory: PlatformAccessory, public readonly log: Logger, public readonly fan: HTTPFan, public readonly service: HTTPFanService) {



        this.init();
    }


    init() {
        // info service


        this.accessory.getService(this.platform.Service.AccessoryInformation)!
        .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Helios')
        .setCharacteristic(this.platform.Characteristic.FirmwareRevision, '1.0.0')
        .setCharacteristic(this.platform.Characteristic.Model, 'Fan')
        .setCharacteristic(this.platform.Characteristic.SerialNumber, 'PIN ' + this.fan.pin)

        // fan service
        this.fanService = this.accessory.getService(this.Service.Fanv2) || this.accessory.addService(this.Service.Fanv2)
        this.fanService
        .getCharacteristic(this.Characteristic.Active)
        .on('get', this.getPowerState.bind(this))
        .on('set', this.setPowerState.bind(this));
        this.fanService
        .getCharacteristic(this.Characteristic.RotationSpeed)
        .on('get', this.getRotationSpeed.bind(this))
        .on('set', this.setRotationSpeed.bind(this));

        this.fanService
        .getCharacteristic(this.Characteristic.RotationDirection) // used to switch beetwen natural and normal mode
        .on('get', this.getRotationDirection.bind(this))
        .on('set', this.setRotationDirection.bind(this));
        this.log.debug('got fan service');

    }


    getPowerState(callback: CharacteristicGetCallback) {
        if (this.fan.power) {
            callback(null, this.Characteristic.Active.ACTIVE);
        } else {
            callback(null, this.Characteristic.Active.INACTIVE);
        }
    }

    setPowerState(state: CharacteristicValue, callback: CharacteristicSetCallback) {
        callback(null, state)
        this.log.debug('called setPowerState')
        if (state == this.Characteristic.Active.ACTIVE) {
            this.service.setPowerState(this.fan, true)
        } else if (state == this.Characteristic.Active.INACTIVE) {
            this.service.setPowerState(this.fan, false)
        }
    }
    getRotationSpeed(callback: CharacteristicGetCallback) {
        this.log.debug('Get rotation speed');
        callback(null, this.fan.speed)
    }

    setRotationSpeed(value: CharacteristicValue, callback: CharacteristicSetCallback) {
        callback(null, value)
        this.log.debug('Called setRotationSpeed')
        this.service.setRotationSpeed(this.fan, parseInt(value.toString()))
    }

    getRotationDirection(callback: CharacteristicGetCallback) {
        this.log.debug('getRotationDirection');

        if (this.fan.clockwiseRotation) {
            callback(null, this.Characteristic.RotationDirection.CLOCKWISE);
        } else {
            callback(null, this.Characteristic.RotationDirection.COUNTER_CLOCKWISE);
        }

    }

    setRotationDirection(direction: CharacteristicValue, callback: CharacteristicSetCallback) {
        callback(null, direction)

        this.log.debug('set rotation direction');
        if (direction == this.Characteristic.RotationDirection.CLOCKWISE) {
            this.service.setClockwiseRotation(this.fan, true)
        } else {
            this.service.setClockwiseRotation(this.fan, false)
        }

    }

}