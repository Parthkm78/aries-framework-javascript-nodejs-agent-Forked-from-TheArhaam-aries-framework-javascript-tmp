/// <reference types="indy-sdk" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { AgentConfig } from '../agent/AgentConfig';
import { ConnectionService } from '../protocols/connections/ConnectionService';
import { ConsumerRoutingService } from '../protocols/routing/ConsumerRoutingService';
import { ConnectionRecord } from '../storage/ConnectionRecord';
import { MessageSender } from '../agent/MessageSender';
export declare class ConnectionsModule {
    private agentConfig;
    private connectionService;
    private consumerRoutingService;
    private messageSender;
    constructor(agentConfig: AgentConfig, connectionService: ConnectionService, consumerRoutingService: ConsumerRoutingService, messageSender: MessageSender);
    createConnection(config?: {
        autoAcceptConnection?: boolean;
        alias?: string;
    }): Promise<ConnectionRecord>;
    /**
     * Receive connection invitation and create connection. If auto accepting is enabled
     * via either the config passed in the function or the global agent config, a connection
     * request message will be send.
     *
     * @param invitationJson json object containing the invitation to receive
     * @param config config for handling of invitation
     * @returns new connection record
     */
    receiveInvitation(invitationJson: Record<string, unknown>, config?: {
        autoAcceptConnection?: boolean;
        alias?: string;
    }): Promise<ConnectionRecord>;
    /**
     * Accept a connection invitation (by sending a connection request message) for the connection with the specified connection id.
     * This is not needed when auto accepting of connections is enabled.
     *
     * @param connectionId the id of the connection for which to accept the invitation
     * @returns connection record
     */
    acceptInvitation(connectionId: string): Promise<ConnectionRecord>;
    /**
     * Accept a connection request (by sending a connection response message) for the connection with the specified connection id.
     * This is not needed when auto accepting of connection is enabled.
     *
     * @param connectionId the id of the connection for which to accept the request
     * @returns connection record
     */
    acceptRequest(connectionId: string): Promise<ConnectionRecord>;
    /**
     * Accept a connection response (by sending a trust ping message) for the connection with the specified connection id.
     * This is not needed when auto accepting of connection is enabled.
     *
     * @param connectionId the id of the connection for which to accept the response
     * @returns connection record
     */
    acceptResponse(connectionId: string): Promise<ConnectionRecord>;
    returnWhenIsConnected(connectionId: string): Promise<ConnectionRecord>;
    getAll(): Promise<ConnectionRecord[]>;
    find(connectionId: string): Promise<ConnectionRecord | null>;
    findConnectionByVerkey(verkey: Verkey): Promise<ConnectionRecord | null>;
    findConnectionByTheirKey(verkey: Verkey): Promise<ConnectionRecord | null>;
    events(): EventEmitter;
}
