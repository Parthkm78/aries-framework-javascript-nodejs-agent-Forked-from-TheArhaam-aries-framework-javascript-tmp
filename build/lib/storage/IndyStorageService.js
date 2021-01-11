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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndyStorageService = void 0;
const BaseRecord_1 = require("./BaseRecord");
class IndyStorageService {
    constructor(wallet) {
        this.wallet = wallet;
    }
    save(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, id, tags } = record;
            const value = record.getValue();
            return this.wallet.addWalletRecord(type, id, value, tags);
        });
    }
    update(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, id, tags } = record;
            const value = record.getValue();
            yield this.wallet.updateWalletRecordValue(type, id, value);
            yield this.wallet.updateWalletRecordTags(type, id, tags);
        });
    }
    delete(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, type } = record;
            return this.wallet.deleteWalletRecord(type, id);
        });
    }
    find(typeClass, id, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield this.wallet.getWalletRecord(type, id, IndyStorageService.DEFAULT_QUERY_OPTIONS);
            return BaseRecord_1.BaseRecord.fromPersistence(typeClass, record);
        });
    }
    findAll(typeClass, type) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const recordIterator = yield this.wallet.search(type, {}, IndyStorageService.DEFAULT_QUERY_OPTIONS);
            const records = [];
            try {
                for (var recordIterator_1 = __asyncValues(recordIterator), recordIterator_1_1; recordIterator_1_1 = yield recordIterator_1.next(), !recordIterator_1_1.done;) {
                    const record = recordIterator_1_1.value;
                    records.push(BaseRecord_1.BaseRecord.fromPersistence(typeClass, record));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (recordIterator_1_1 && !recordIterator_1_1.done && (_a = recordIterator_1.return)) yield _a.call(recordIterator_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return records;
        });
    }
    findByQuery(typeClass, type, query) {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const recordIterator = yield this.wallet.search(type, query, IndyStorageService.DEFAULT_QUERY_OPTIONS);
            const records = [];
            try {
                for (var recordIterator_2 = __asyncValues(recordIterator), recordIterator_2_1; recordIterator_2_1 = yield recordIterator_2.next(), !recordIterator_2_1.done;) {
                    const record = recordIterator_2_1.value;
                    records.push(BaseRecord_1.BaseRecord.fromPersistence(typeClass, record));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (recordIterator_2_1 && !recordIterator_2_1.done && (_a = recordIterator_2.return)) yield _a.call(recordIterator_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return records;
        });
    }
}
exports.IndyStorageService = IndyStorageService;
IndyStorageService.DEFAULT_QUERY_OPTIONS = { retrieveType: true, retrieveTags: true };
