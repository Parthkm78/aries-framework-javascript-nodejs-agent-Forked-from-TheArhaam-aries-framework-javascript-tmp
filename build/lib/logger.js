"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('aries-framework-javascript');
exports.default = {
    log: (...args) => {
        debug('', ...args);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logJson: (message, json) => {
        debug(`---------- ${message} ---------- \n`, JSON.stringify(json, null, 2), '\n');
    },
};
