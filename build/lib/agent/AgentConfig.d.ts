import { InitConfig, InboundConnection } from '../types';
export declare class AgentConfig {
    private initConfig;
    inboundConnection?: InboundConnection;
    constructor(initConfig: InitConfig);
    get label(): string;
    get publicDid(): string | undefined;
    get publicDidSeed(): string | undefined;
    get mediatorUrl(): string | undefined;
    get poolName(): string;
    get genesisPath(): string | undefined;
    establishInbound(inboundConnection: InboundConnection): void;
    get autoAcceptConnections(): boolean;
    getEndpoint(): string;
    getRoutingKeys(): string[];
}
