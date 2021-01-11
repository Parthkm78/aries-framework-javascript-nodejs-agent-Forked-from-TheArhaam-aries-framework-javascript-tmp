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
exports.Agent = void 0;
const logger_1 = __importDefault(require("../logger"));
const IndyWallet_1 = require("../wallet/IndyWallet");
const ConnectionService_1 = require("../protocols/connections/ConnectionService");
const ProofService_1 = require("../protocols/proof/ProofService");
const ProviderRoutingService_1 = require("../protocols/routing/ProviderRoutingService");
const ConsumerRoutingService_1 = require("../protocols/routing/ConsumerRoutingService");
const BasicMessageService_1 = require("../protocols/basicmessage/BasicMessageService");
const TrustPingService_1 = require("../protocols/trustping/TrustPingService");
const MessagePickupService_1 = require("../protocols/messagepickup/MessagePickupService");
const MessageReceiver_1 = require("./MessageReceiver");
const EnvelopeService_1 = require("./EnvelopeService");
const LedgerService_1 = require("./LedgerService");
const Dispatcher_1 = require("./Dispatcher");
const MessageSender_1 = require("./MessageSender");
const ConnectionRequestHandler_1 = require("../handlers/connections/ConnectionRequestHandler");
const ConnectionResponseHandler_1 = require("../handlers/connections/ConnectionResponseHandler");
const AckMessageHandler_1 = require("../handlers/acks/AckMessageHandler");
const BasicMessageHandler_1 = require("../handlers/basicmessage/BasicMessageHandler");
const ForwardHandler_1 = require("../handlers/routing/ForwardHandler");
const TrustPingMessageHandler_1 = require("../handlers/trustping/TrustPingMessageHandler");
const TrustPingResponseMessageHandler_1 = require("../handlers/trustping/TrustPingResponseMessageHandler");
const MessagePickupHandler_1 = require("../handlers/messagepickup/MessagePickupHandler");
const KeylistUpdateHandler_1 = require("../handlers/coordinatemediation/KeylistUpdateHandler");
const BasicMessageRecord_1 = require("../storage/BasicMessageRecord");
const Repository_1 = require("../storage/Repository");
const IndyStorageService_1 = require("../storage/IndyStorageService");
const ConnectionRecord_1 = require("../storage/ConnectionRecord");
const AgentConfig_1 = require("./AgentConfig");
const ProvisioningRecord_1 = require("../storage/ProvisioningRecord");
const ProvisioningService_1 = require("./ProvisioningService");
const ConnectionsModule_1 = require("../modules/ConnectionsModule");
const RoutingModule_1 = require("../modules/RoutingModule");
const BasicMessagesModule_1 = require("../modules/BasicMessagesModule");
const LedgerModule_1 = require("../modules/LedgerModule");
const CredentialsModule_1 = require("../modules/CredentialsModule");
const ProofsModule_1 = require("../modules/ProofsModule");
const CredentialService_1 = require("../protocols/credentials/CredentialService");
const CredentialRecord_1 = require("../storage/CredentialRecord");
const CredentialOfferHandler_1 = require("../handlers/credentials/CredentialOfferHandler");
const CredentialRequestHandler_1 = require("../handlers/credentials/CredentialRequestHandler");
const CredentialResponseHandler_1 = require("../handlers/credentials/CredentialResponseHandler");
const CredentialAckHandler_1 = require("../handlers/credentials/CredentialAckHandler");
const RequestPresentationHandler_1 = require("../handlers/proof/RequestPresentationHandler");
const PresentProofMessageHandler_1 = require("../handlers/proof/PresentProofMessageHandler");
const ProofRecord_1 = require("../storage/ProofRecord");
class Agent {
    constructor(initialConfig, inboundTransporter, outboundTransporter, indy, messageRepository) {
        logger_1.default.logJson('Creating agent with config', initialConfig);
        this.wallet = new IndyWallet_1.IndyWallet(initialConfig.walletConfig, initialConfig.walletCredentials, indy);
        const envelopeService = new EnvelopeService_1.EnvelopeService(this.wallet);
        this.agentConfig = new AgentConfig_1.AgentConfig(initialConfig);
        this.messageSender = new MessageSender_1.MessageSender(envelopeService, outboundTransporter);
        this.dispatcher = new Dispatcher_1.Dispatcher(this.messageSender);
        this.inboundTransporter = inboundTransporter;
        const storageService = new IndyStorageService_1.IndyStorageService(this.wallet);
        this.basicMessageRepository = new Repository_1.Repository(BasicMessageRecord_1.BasicMessageRecord, storageService);
        this.connectionRepository = new Repository_1.Repository(ConnectionRecord_1.ConnectionRecord, storageService);
        this.provisioningRepository = new Repository_1.Repository(ProvisioningRecord_1.ProvisioningRecord, storageService);
        this.credentialRepository = new Repository_1.Repository(CredentialRecord_1.CredentialRecord, storageService);
        this.proofRepository = new Repository_1.Repository(ProofRecord_1.ProofRecord, storageService);
        this.provisioningService = new ProvisioningService_1.ProvisioningService(this.provisioningRepository);
        this.connectionService = new ConnectionService_1.ConnectionService(this.wallet, this.agentConfig, this.connectionRepository);
        this.basicMessageService = new BasicMessageService_1.BasicMessageService(this.basicMessageRepository);
        this.providerRoutingService = new ProviderRoutingService_1.ProviderRoutingService();
        this.consumerRoutingService = new ConsumerRoutingService_1.ConsumerRoutingService(this.messageSender, this.agentConfig);
        this.trustPingService = new TrustPingService_1.TrustPingService();
        this.messagePickupService = new MessagePickupService_1.MessagePickupService(messageRepository);
        this.ledgerService = new LedgerService_1.LedgerService(this.wallet, indy);
        this.credentialService = new CredentialService_1.CredentialService(this.wallet, this.credentialRepository);
        this.proofService = new ProofService_1.ProofService(this.wallet, this.proofRepository);
        this.messageReceiver = new MessageReceiver_1.MessageReceiver(this.agentConfig, envelopeService, this.connectionService, this.dispatcher);
        this.registerHandlers();
        this.registerModules();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.wallet.init();
            const { publicDidSeed, genesisPath, poolName } = this.agentConfig;
            if (publicDidSeed) {
                // If an agent has publicDid it will be used as routing key.
                yield this.wallet.initPublicDid({ seed: publicDidSeed });
            }
            // If the genesisPath is provided in the config, we will automatically handle ledger connection
            // otherwise the framework consumer needs to do this manually
            if (genesisPath) {
                yield this.ledger.connect(poolName, {
                    genesis_txn: genesisPath,
                });
            }
            return this.inboundTransporter.start(this);
        });
    }
    getPublicDid() {
        return this.wallet.getPublicDid();
    }
    getMediatorUrl() {
        return this.agentConfig.mediatorUrl;
    }
    receiveMessage(inboundPackedMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.messageReceiver.receiveMessage(inboundPackedMessage);
        });
    }
    closeAndDeleteWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.wallet.close();
            yield this.wallet.delete();
        });
    }
    registerHandlers() {
        this.dispatcher.registerHandler(new ConnectionRequestHandler_1.ConnectionRequestHandler(this.connectionService, this.agentConfig));
        this.dispatcher.registerHandler(new ConnectionResponseHandler_1.ConnectionResponseHandler(this.connectionService, this.agentConfig));
        this.dispatcher.registerHandler(new AckMessageHandler_1.AckMessageHandler(this.connectionService));
        this.dispatcher.registerHandler(new BasicMessageHandler_1.BasicMessageHandler(this.basicMessageService));
        this.dispatcher.registerHandler(new KeylistUpdateHandler_1.KeylistUpdateHandler(this.providerRoutingService));
        this.dispatcher.registerHandler(new ForwardHandler_1.ForwardHandler(this.providerRoutingService));
        this.dispatcher.registerHandler(new TrustPingMessageHandler_1.TrustPingMessageHandler(this.trustPingService, this.connectionService));
        this.dispatcher.registerHandler(new TrustPingResponseMessageHandler_1.TrustPingResponseMessageHandler(this.trustPingService));
        this.dispatcher.registerHandler(new MessagePickupHandler_1.MessagePickupHandler(this.messagePickupService));
        this.dispatcher.registerHandler(new CredentialOfferHandler_1.CredentialOfferHandler(this.credentialService));
        this.dispatcher.registerHandler(new CredentialRequestHandler_1.CredentialRequestHandler(this.credentialService));
        this.dispatcher.registerHandler(new CredentialResponseHandler_1.CredentialResponseHandler(this.credentialService, this.ledgerService));
        this.dispatcher.registerHandler(new CredentialAckHandler_1.CredentialAckHandler(this.credentialService));
        this.dispatcher.registerHandler(new RequestPresentationHandler_1.RequestPresentationHandler(this.proofService));
        this.dispatcher.registerHandler(new PresentProofMessageHandler_1.PresentProofMessageHandler(this.proofService));
    }
    registerModules() {
        this.connections = new ConnectionsModule_1.ConnectionsModule(this.agentConfig, this.connectionService, this.consumerRoutingService, this.messageSender);
        this.proof = new ProofsModule_1.ProofsModule(this.proofService, this.messageSender, this.credentialService, this.ledgerService);
        this.routing = new RoutingModule_1.RoutingModule(this.agentConfig, this.providerRoutingService, this.provisioningService, this.messagePickupService, this.connectionService, this.messageSender);
        this.basicMessages = new BasicMessagesModule_1.BasicMessagesModule(this.basicMessageService, this.messageSender);
        this.ledger = new LedgerModule_1.LedgerModule(this.wallet, this.ledgerService);
        this.credentials = new CredentialsModule_1.CredentialsModule(this.connectionService, this.credentialService, this.ledgerService, this.messageSender);
    }
}
exports.Agent = Agent;
