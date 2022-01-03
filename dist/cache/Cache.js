"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CACHE_MANAGER = exports.CACHE_DIR = void 0;
const path_1 = __importDefault(require("path"));
const Config_1 = require("../lib/Config");
const os_1 = require("os");
exports.CACHE_DIR = path_1.default.resolve((0, os_1.homedir)(), "gcache.json");
exports.CACHE_MANAGER = new Config_1.Config(exports.CACHE_DIR, {
    cookies: {
        APISID: "",
        HSID: "",
        SAPISID: "",
        SID: "",
        SSID: "",
    },
    ytcfg: {
        V1: "",
        pageId: "",
    },
    sessionInfo: "",
});