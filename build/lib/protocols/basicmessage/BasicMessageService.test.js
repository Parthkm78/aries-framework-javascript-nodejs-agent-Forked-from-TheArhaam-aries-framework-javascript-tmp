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
const indy_sdk_1 = __importDefault(require("indy-sdk"));
const IndyWallet_1 = require("../../wallet/IndyWallet");
const Repository_1 = require("../../storage/Repository");
const IndyStorageService_1 = require("../../storage/IndyStorageService");
const BasicMessageService_1 = require("./BasicMessageService");
const BasicMessageRecord_1 = require("../../storage/BasicMessageRecord");
const BasicMessage_1 = require("./BasicMessage");
const InboundMessageContext_1 = require("../../agent/models/InboundMessageContext");
describe('BasicMessageService', () => {
    const walletConfig = { id: 'test-wallet' + '-BasicMessageServiceTest' };
    const walletCredentials = { key: 'key' };
    const mockConnectionRecord = {
        id: 'd3849ac3-c981-455b-a1aa-a10bea6cead8',
        verkey: '71X9Y1aSPK11ariWUYQCYMjSewf2Kw2JFGeygEf9uZd9',
        did: 'did:sov:C2SsBf5QUQpqSAQfhu3sd2',
        didDoc: {},
        tags: {},
    };
    let wallet;
    let storageService;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        wallet = new IndyWallet_1.IndyWallet(walletConfig, walletCredentials, indy_sdk_1.default);
        yield wallet.init();
        storageService = new IndyStorageService_1.IndyStorageService(wallet);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield wallet.close();
        yield wallet.delete();
    }));
    describe('save', () => {
        let basicMessageRepository;
        let basicMessageService;
        beforeEach(() => {
            basicMessageRepository = new Repository_1.Repository(BasicMessageRecord_1.BasicMessageRecord, storageService);
            basicMessageService = new BasicMessageService_1.BasicMessageService(basicMessageRepository);
        });
        it(`emits newMessage with connection verkey and message itself`, () => __awaiter(void 0, void 0, void 0, function* () {
            const eventListenerMock = jest.fn();
            basicMessageService.on(BasicMessageService_1.EventType.MessageReceived, eventListenerMock);
            const basicMessage = new BasicMessage_1.BasicMessage({
                id: '123',
                content: 'message',
            });
            const messageContext = new InboundMessageContext_1.InboundMessageContext(basicMessage, {
                senderVerkey: 'senderKey',
                recipientVerkey: 'recipientKey',
            });
            // TODO
            // Currently, it's not so easy to create instance of ConnectionRecord object.
            // We use simple `mockConnectionRecord` as ConnectionRecord type
            yield basicMessageService.save(messageContext, mockConnectionRecord);
            expect(eventListenerMock).toHaveBeenCalledWith({
                verkey: mockConnectionRecord.verkey,
                message: messageContext.message,
            });
        }));
    });
});
