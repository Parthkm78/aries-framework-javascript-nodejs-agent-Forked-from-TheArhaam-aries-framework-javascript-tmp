/// <reference types="indy-sdk" />
import { AgentConfig } from '../agent/AgentConfig';
import { ProvisioningService } from '../agent/ProvisioningService';
import { ConnectionService } from '../protocols/connections/ConnectionService';
import { MessagePickupService } from '../protocols/messagepickup/MessagePickupService';
import { MessageSender } from '../agent/MessageSender';
import { ProviderRoutingService } from '../protocols/routing/ProviderRoutingService';
export declare class RoutingModule {
    private agentConfig;
    private providerRoutingService;
    private provisioningService;
    private messagePickupService;
    private connectionService;
    private messageSender;
    constructor(agentConfig: AgentConfig, providerRoutingService: ProviderRoutingService, provisioningService: ProvisioningService, messagePickupService: MessagePickupService, connectionService: ConnectionService, messageSender: MessageSender);
    provision(mediatorConfiguration: MediatorConfiguration): Promise<import("..").ConnectionRecord>;
    downloadMessages(): Promise<any[]>;
    getInboundConnection(): import("../types").InboundConnection | undefined;
    getRoutingTable(): import("../protocols/routing/ProviderRoutingService").RoutingTable;
}
interface MediatorConfiguration {
    verkey: Verkey;
    invitationUrl: string;
    alias?: string;
}
export {};
