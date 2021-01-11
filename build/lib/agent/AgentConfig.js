"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentConfig = void 0;
class AgentConfig {
    constructor(initConfig) {
        this.initConfig = initConfig;
    }
    get label() {
        return this.initConfig.label;
    }
    get publicDid() {
        return this.initConfig.publicDid;
    }
    get publicDidSeed() {
        return this.initConfig.publicDidSeed;
    }
    get mediatorUrl() {
        return this.initConfig.mediatorUrl;
    }
    get poolName() {
        var _a;
        return (_a = this.initConfig.poolName) !== null && _a !== void 0 ? _a : 'default-pool';
    }
    get genesisPath() {
        return this.initConfig.genesisPath;
    }
    establishInbound(inboundConnection) {
        this.inboundConnection = inboundConnection;
    }
    get autoAcceptConnections() {
        var _a;
        return (_a = this.initConfig.autoAcceptConnections) !== null && _a !== void 0 ? _a : false;
    }
    getEndpoint() {
        var _a, _b, _c;
        // If a mediator is used, always return that as endpoint
        const mediatorEndpoint = (_c = (_b = (_a = this.inboundConnection) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.theirDidDoc) === null || _c === void 0 ? void 0 : _c.service[0].serviceEndpoint;
        if (mediatorEndpoint)
            return mediatorEndpoint;
        // Otherwise we check if an endpoint is set
        if (this.initConfig.endpoint)
            return `${this.initConfig.endpoint}/msg`;
        // Otherwise we'll try to construct it from the host/port
        let hostEndpoint = this.initConfig.host;
        if (hostEndpoint) {
            if (this.initConfig.port)
                hostEndpoint += `:${this.initConfig.port}`;
            return `${hostEndpoint}/msg`;
        }
        // If we still don't have an endpoint, return didcomm:transport/queue
        // https://github.com/hyperledger/aries-rfcs/issues/405#issuecomment-582612875
        return 'didcomm:transport/queue';
    }
    getRoutingKeys() {
        var _a;
        const verkey = (_a = this.inboundConnection) === null || _a === void 0 ? void 0 : _a.verkey;
        return verkey ? [verkey] : [];
    }
}
exports.AgentConfig = AgentConfig;
