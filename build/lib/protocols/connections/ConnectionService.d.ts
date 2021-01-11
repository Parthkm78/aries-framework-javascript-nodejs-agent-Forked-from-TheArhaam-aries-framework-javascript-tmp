/// <reference types="indy-sdk" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { OutboundMessage } from '../../types';
import { AgentConfig } from '../../agent/AgentConfig';
import { ConnectionState } from './domain/ConnectionState';
import { ConnectionRecord } from '../../storage/ConnectionRecord';
import { Repository } from '../../storage/Repository';
import { Wallet } from '../../wallet/Wallet';
import { ConnectionInvitationMessage } from './ConnectionInvitationMessage';
import { ConnectionRequestMessage } from './ConnectionRequestMessage';
import { ConnectionResponseMessage } from './ConnectionResponseMessage';
import { AckMessage } from './AckMessage';
import { InboundMessageContext } from '../../agent/models/InboundMessageContext';
import { TrustPingMessage } from '../trustping/TrustPingMessage';
declare enum EventType {
    StateChanged = "stateChanged"
}
interface ConnectionStateChangedEvent {
    connection: ConnectionRecord;
    prevState: ConnectionState;
}
declare class ConnectionService extends EventEmitter {
    private wallet;
    private config;
    private connectionRepository;
    constructor(wallet: Wallet, config: AgentConfig, connectionRepository: Repository<ConnectionRecord>);
    /**
     * Create a new connection record containing a connection invitation message
     *
     * @param config config for creation of connection and invitation
     * @returns new connection record
     */
    createConnectionWithInvitation(config?: {
        autoAcceptConnection?: boolean;
        alias?: string;
    }): Promise<ConnectionRecord>;
    /**
     * Process a received invitation message. This will not accept the invitation
     * or send an invitation request message. It will only create a connection record
     * with all the information about the invitation stored. Use {@link ConnectionService#createRequest}
     * after calling this function to create a connection request.
     *
     * @param invitation the invitation message to process
     * @returns new connection record.
     */
    processInvitation(invitation: ConnectionInvitationMessage, config?: {
        autoAcceptConnection?: boolean;
        alias?: string;
    }): Promise<ConnectionRecord>;
    /**
     * Create a connectino request message for the connection with the specified connection id.
     *
     * @param connectionId the id of the connection for which to create a connection request
     * @returns outbound message contaning connection request
     */
    createRequest(connectionId: string): Promise<OutboundMessage<ConnectionRequestMessage>>;
    /**
     * Process a received connection request message. This will not accept the connection request
     * or send a connection response message. It will only update the existing connection record
     * with all the new information from the connection request message. Use {@link ConnectionService#createResponse}
     * after calling this function to create a connection respone.
     *
     * @param messageContext the message context containing a connetion request message
     * @returns updated connection record
     */
    processRequest(messageContext: InboundMessageContext<ConnectionRequestMessage>): Promise<ConnectionRecord>;
    /**
     * Create a connection response message for the connection with the specified connection id.
     *
     * @param connectionId the id of the connection for which to create a connection response
     * @returns outbound message contaning connection response
     */
    createResponse(connectionId: string): Promise<OutboundMessage<ConnectionResponseMessage>>;
    /**
     * Process a received connection response message. This will not accept the connection request
     * or send a connection acknowledgement message. It will only update the existing connection record
     * with all the new information from the connection response message. Use {@link ConnectionService#createTrustPing}
     * after calling this function to create a trust ping message.
     *
     * @param messageContext the message context containing a connetion response message
     * @returns updated connection record
     */
    processResponse(messageContext: InboundMessageContext<ConnectionResponseMessage>): Promise<ConnectionRecord>;
    /**
     * Create a trust ping message for the connection with the specified connection id.
     *
     * @param connectionId the id of the connection for which to create a trust ping message
     * @returns outbound message contaning trust ping message
     */
    createTrustPing(connectionId: string): Promise<OutboundMessage<TrustPingMessage>>;
    /**
     * Process a received ack message. This will update the state of the connection
     * to Completed if this is not already the case.
     *
     * @param messageContext the message context containing an ack message
     * @returns updated connection record
     */
    processAck(messageContext: InboundMessageContext<AckMessage>): Promise<ConnectionRecord>;
    updateState(connectionRecord: ConnectionRecord, newState: ConnectionState): Promise<void>;
    private createConnection;
    getConnections(): Promise<ConnectionRecord[]>;
    find(connectionId: string): Promise<ConnectionRecord | null>;
    findByVerkey(verkey: Verkey): Promise<ConnectionRecord | null>;
    findByTheirKey(verkey: Verkey): Promise<ConnectionRecord | null>;
}
export { ConnectionService, EventType, ConnectionStateChangedEvent };
