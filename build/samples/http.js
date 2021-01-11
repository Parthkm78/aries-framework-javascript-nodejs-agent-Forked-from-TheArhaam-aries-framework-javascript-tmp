"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = exports.get = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const logger_1 = __importDefault(require("../lib/logger"));
function get(url) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.log('HTTP GET request url', url);
        const response = yield node_fetch_1.default(url);
        logger_1.default.log(`HTTP GET response status: ${response.status} - ${response.statusText}`);
        return response.text();
    });
}
exports.get = get;
function post(url, body) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.log('HTTP POST request url', url);
        const response = yield node_fetch_1.default(url, { method: 'POST', body });
        logger_1.default.log(`HTTP POST response status: ${response.status} - ${response.statusText}`);
        return response.text();
    });
}
exports.post = post;
