import { AgentMessage } from '../../agent/AgentMessage';
import { MessageType } from './messages';
import { DidDoc } from './domain/DidDoc';
import { Connection } from './domain/Connection';
export interface ConnectionRequestMessageOptions {
    id?: string;
    label: string;
    did: string;
    didDoc?: DidDoc;
}
/**
 * Message to communicate the DID document to the other agent when creating a connectino
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0160-connection-protocol/README.md#1-connection-request
 */
export declare class ConnectionRequestMessage extends AgentMessage {
    /**
     * Create new ConnectionRequestMessage instance.
     * @param options
     */
    constructor(options: ConnectionRequestMessageOptions);
    readonly type = MessageType.ConnectionRequest;
    static readonly type = MessageType.ConnectionRequest;
    label: string;
    connection: Connection;
}
