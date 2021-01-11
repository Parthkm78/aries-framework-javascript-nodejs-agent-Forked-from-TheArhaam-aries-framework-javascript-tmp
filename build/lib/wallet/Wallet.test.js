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
const IndyWallet_1 = require("./IndyWallet");
const indy_sdk_1 = __importDefault(require("indy-sdk"));
describe('Wallet', () => {
    const wallet = new IndyWallet_1.IndyWallet({ id: 'test_wallet' }, { key: 'test_key' }, indy_sdk_1.default);
    test('initialize public did', () => __awaiter(void 0, void 0, void 0, function* () {
        yield wallet.init();
        yield wallet.initPublicDid({ seed: '00000000000000000000000Forward01' });
        expect(wallet.getPublicDid()).toEqual({
            did: 'DtWRdd6C5dN5vpcN6XRAvu',
            verkey: '82RBSn3heLgXzZd74UsMC8Q8YRfEEhQoAM7LUqE6bevJ',
        });
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield wallet.close();
        yield wallet.delete();
    }));
});
