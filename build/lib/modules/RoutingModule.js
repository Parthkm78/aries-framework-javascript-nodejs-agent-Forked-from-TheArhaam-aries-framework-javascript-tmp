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
exports.RoutingModule = void 0;
const ConnectionState_1 = require("../protocols/connections/domain/ConnectionState");
const helpers_1 = require("../helpers");
const logger_1 = __importDefault(require("../logger"));
const ConnectionResponseMessage_1 = require("../protocols/connections/ConnectionResponseMessage");
const BatchMessage_1 = require("../protocols/messagepickup/BatchMessage");
class RoutingModule {
    constructor(agentConfig, providerRoutingService, provisioningService, messagePickupService, connectionService, messageSender) {
        this.agentConfig = agentConfig;
        this.providerRoutingService = providerRoutingService;
        this.provisioningService = provisioningService;
        this.messagePickupService = messagePickupService;
        this.connectionService = connectionService;
        this.messageSender = messageSender;
    }
    provision(mediatorConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            let provisioningRecord = yield this.provisioningService.find();
            if (!provisioningRecord) {
                logger_1.default.log('There is no provisioning. Creating connection with mediator...');
                const { verkey, invitationUrl, alias = 'Mediator' } = mediatorConfiguration;
                const mediatorInvitation = yield helpers_1.decodeInvitationFromUrl(invitationUrl);
                const connection = yield this.connectionService.processInvitation(mediatorInvitation, { alias });
                const connectionRequest = yield this.connectionService.createRequest(connection.id);
                const connectionResponse = yield this.messageSender.sendAndReceiveMessage(connectionRequest, ConnectionResponseMessage_1.ConnectionResponseMessage);
                yield this.connectionService.processResponse(connectionResponse);
                const trustPing = yield this.connectionService.createTrustPing(connection.id);
                yield this.messageSender.sendMessage(trustPing);
                const provisioningProps = {
                    mediatorConnectionId: connectionRequest.connection.id,
                    mediatorPublicVerkey: verkey,
                };
                provisioningRecord = yield this.provisioningService.create(provisioningProps);
                logger_1.default.log('Provisioning record has been saved.');
            }
            logger_1.default.log('Provisioning record:', provisioningRecord);
            const agentConnectionAtMediator = yield this.connectionService.find(provisioningRecord.mediatorConnectionId);
            if (!agentConnectionAtMediator) {
                throw new Error('Connection not found!');
            }
            logger_1.default.log('agentConnectionAtMediator', agentConnectionAtMediator);
            if (agentConnectionAtMediator.state !== ConnectionState_1.ConnectionState.Complete) {
                throw new Error('Connection has not been established.');
            }
            this.agentConfig.establishInbound({
                verkey: provisioningRecord.mediatorPublicVerkey,
                connection: agentConnectionAtMediator,
            });
            return agentConnectionAtMediator;
        });
    }
    downloadMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            const inboundConnection = this.getInboundConnection();
            if (inboundConnection) {
                const outboundMessage = yield this.messagePickupService.batchPickup(inboundConnection);
                const batchResponse = yield this.messageSender.sendAndReceiveMessage(outboundMessage, BatchMessage_1.BatchMessage);
                // TODO: do something about the different types of message variable all having a different purpose
                return batchResponse.message.messages.map(msg => msg.message);
            }
            return [];
        });
    }
    getInboundConnection() {
        return this.agentConfig.inboundConnection;
    }
    getRoutingTable() {
        return this.providerRoutingService.getRoutes();
    }
}
exports.RoutingModule = RoutingModule;
