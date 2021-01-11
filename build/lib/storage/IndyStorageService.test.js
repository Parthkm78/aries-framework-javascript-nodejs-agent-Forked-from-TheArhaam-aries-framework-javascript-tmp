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
const Repository_1 = require("./Repository");
const IndyStorageService_1 = require("./IndyStorageService");
const IndyWallet_1 = require("../wallet/IndyWallet");
const BaseRecord_1 = require("./BaseRecord");
const uuid_1 = require("uuid");
const indy_sdk_1 = __importDefault(require("indy-sdk"));
class TestRecord extends BaseRecord_1.BaseRecord {
    constructor(props) {
        var _a, _b;
        super((_a = props.id) !== null && _a !== void 0 ? _a : uuid_1.v4(), (_b = props.createdAt) !== null && _b !== void 0 ? _b : Date.now());
        this.type = TestRecord.type;
        this.foo = props.foo;
        this.tags = props.tags;
    }
}
TestRecord.type = BaseRecord_1.RecordType.BaseRecord;
describe('IndyStorageService', () => {
    let wallet;
    let testRepository;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        wallet = new IndyWallet_1.IndyWallet({ id: 'testWallet' }, { key: 'asbdabsd' }, indy_sdk_1.default);
        const storageService = new IndyStorageService_1.IndyStorageService(wallet);
        testRepository = new Repository_1.Repository(TestRecord, storageService);
        yield wallet.init();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield wallet.close();
        yield wallet.delete();
    }));
    const insertRecord = () => __awaiter(void 0, void 0, void 0, function* () {
        const props = {
            foo: 'bar',
            tags: { myTag: 'foobar' },
        };
        const record = new TestRecord(props);
        yield testRepository.save(record);
        return record;
    });
    test('it is able to save messages', () => __awaiter(void 0, void 0, void 0, function* () {
        yield insertRecord();
    }));
    test('does not change id, createdAt attributes', () => __awaiter(void 0, void 0, void 0, function* () {
        const record = yield insertRecord();
        const found = yield testRepository.find(record.id);
        expect(found.id).toEqual(record.id);
        expect(found.createdAt).toEqual(record.createdAt);
    }));
    test('it is able to get the record', () => __awaiter(void 0, void 0, void 0, function* () {
        const record = yield insertRecord();
        const found = yield testRepository.find(record.id);
        expect(found.id).toStrictEqual(record.id);
    }));
    test('it is able to find all records', () => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < 10; i++) {
            const props = {
                foo: `123123_${i}`,
                tags: {},
            };
            const rec = new TestRecord(props);
            yield testRepository.save(rec);
        }
        const records = yield testRepository.findAll();
        expect(records.length).toStrictEqual(10);
    }));
    test('it is able to update records', () => __awaiter(void 0, void 0, void 0, function* () {
        const record = yield insertRecord();
        record.tags = Object.assign(Object.assign({}, record.tags), { foo: 'bar' });
        record.foo = 'foobaz';
        yield testRepository.update(record);
        const got = yield testRepository.find(record.id);
        expect(got.foo).toStrictEqual(record.foo);
        expect(got.tags).toStrictEqual(record.tags);
    }));
    test('it is able to delete a record', () => __awaiter(void 0, void 0, void 0, function* () {
        const record = yield insertRecord();
        yield testRepository.delete(record);
        expect(() => __awaiter(void 0, void 0, void 0, function* () {
            yield testRepository.find(record.id);
        })).rejects;
    }));
    test('it is able to query a record', () => __awaiter(void 0, void 0, void 0, function* () {
        yield insertRecord();
        const result = yield testRepository.findByQuery({ myTag: 'foobar' });
        expect(result.length).toBe(1);
    }));
});
