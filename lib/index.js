"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const HTTPFanPlatform_1 = __importDefault(require("./HTTPFanPlatform"));
module.exports = (api) => {
    api.registerPlatform('homebridge-http-fans', 'HTTPFans', HTTPFanPlatform_1.default);
};
