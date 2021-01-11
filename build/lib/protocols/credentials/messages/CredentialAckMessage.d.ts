import { AgentMessage } from '../../../agent/AgentMessage';
import { MessageType } from './MessageType';
interface CredentialAckMessageOptions {
    id?: string;
}
export declare class CredentialAckMessage extends AgentMessage {
    constructor(options: CredentialAckMessageOptions);
    readonly type = MessageType.CredentialAck;
    static readonly type = MessageType.CredentialAck;
}
export {};
