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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("../lib/logger"));
const lib_1 = require("../lib");
const indy_sdk_1 = __importDefault(require("indy-sdk"));
const InMemoryMessageRepository_1 = require("../lib/storage/InMemoryMessageRepository");
class HttpInboundTransporter {
    constructor(app) {
        this.app = app;
    }
    start(agent) {
        this.app.post('/msg', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const message = req.body;
            const packedMessage = JSON.parse(message);
            const outboundMessage = yield agent.receiveMessage(packedMessage);
            if (outboundMessage) {
                res.status(200).json(outboundMessage.payload).end();
            }
            else {
                res.status(200).end();
            }
        }));
    }
}
class StorageOutboundTransporter {
    constructor(messageRepository) {
        this.messages = {};
        this.messageRepository = messageRepository;
    }
    sendMessage(outboundPackage) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connection, payload } = outboundPackage;
            if (!connection) {
                throw new Error(`Missing connection. I don't know how and where to send the message.`);
            }
            if (!connection.theirKey) {
                throw new Error('Trying to save message without theirKey!');
            }
            logger_1.default.logJson('Storing message', { connection, payload });
            this.messageRepository.save(connection.theirKey, payload);
        });
    }
}
const PORT = config_1.default.port;
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.text());
app.set('json spaces', 2);
const messageRepository = new InMemoryMessageRepository_1.InMemoryMessageRepository();
const messageSender = new StorageOutboundTransporter(messageRepository);
const messageReceiver = new HttpInboundTransporter(app);
const agent = new lib_1.Agent(config_1.default, messageReceiver, messageSender, indy_sdk_1.default, messageRepository);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agentDid = agent.getPublicDid();
    res.send(agentDid);
}));
// Create new invitation as inviter to invitee
app.get('/invitation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield agent.connections.createConnection();
    const { invitation } = connection;
    if (!invitation) {
        throw new Error('There is no invitation in newly created connection!');
    }
    const invitationUrl = lib_1.encodeInvitationToUrl(invitation);
    res.send(invitationUrl);
}));
app.get('/api/connections/:verkey', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO This endpoint is for testing purpose only. Return mediator connection by their verkey.
    const verkey = req.params.verkey;
    const connection = yield agent.connections.findConnectionByTheirKey(verkey);
    res.send(connection);
}));
app.get('/api/connections', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO This endpoint is for testing purpose only. Return mediator connection by their verkey.
    const connections = yield agent.connections.getAll();
    res.json(connections);
}));
app.get('/api/routes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO This endpoint is for testing purpose only. Return mediator connection by their verkey.
    const routes = agent.routing.getRoutingTable();
    res.send(routes);
}));
app.get('/api/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO This endpoint is for testing purpose only.
    res.send(messageSender.messages);
}));
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield agent.init();
    messageReceiver.start(agent);
    logger_1.default.log(`Application started on port ${PORT}`);
}));
