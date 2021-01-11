import { AgentMessage } from '../../agent/AgentMessage';
import { MessageType } from './messages';
import { SignatureDecorator } from '../../decorators/signature/SignatureDecorator';
export interface ConnectionResponseMessageOptions {
    id?: string;
    threadId: string;
    connectionSig: SignatureDecorator;
}
/**
 * Message part of connection protocol used to complete the connection
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0160-connection-protocol/README.md#2-connection-response
 */
export declare class ConnectionResponseMessage extends AgentMessage {
    /**
     * Create new ConnectionResponseMessage instance.
     * @param options
     */
    constructor(options: ConnectionResponseMessageOptions);
    readonly type = MessageType.ConnectionResponse;
    static readonly type = MessageType.ConnectionResponse;
    connectionSig: SignatureDecorator;
}
