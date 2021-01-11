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
exports.ConsumerRoutingService = void 0;
const logger_1 = __importDefault(require("../../logger"));
const helpers_1 = require("../helpers");
const KeylistUpdateMessage_1 = require("../coordinatemediation/KeylistUpdateMessage");
class ConsumerRoutingService {
    constructor(messageSender, agentConfig) {
        this.messageSender = messageSender;
        this.agentConfig = agentConfig;
    }
    createRoute(verkey) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.log('Creating route...');
            if (!this.agentConfig.inboundConnection) {
                logger_1.default.log('There is no mediator. Creating route skipped.');
            }
            else {
                const routingConnection = this.agentConfig.inboundConnection.connection;
                const keylistUpdateMessage = new KeylistUpdateMessage_1.KeylistUpdateMessage({
                    updates: [
                        new KeylistUpdateMessage_1.KeylistUpdate({
                            action: KeylistUpdateMessage_1.KeylistUpdateAction.add,
                            recipientKey: verkey,
                        }),
                    ],
                });
                const outboundMessage = helpers_1.createOutboundMessage(routingConnection, keylistUpdateMessage);
                yield this.messageSender.sendMessage(outboundMessage);
            }
        });
    }
}
exports.ConsumerRoutingService = ConsumerRoutingService;
