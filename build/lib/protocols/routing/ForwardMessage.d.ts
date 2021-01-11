import { AgentMessage } from '../../agent/AgentMessage';
import { MessageType } from './messages';
export interface ForwardMessageOptions {
    id?: string;
    to: string;
    message: JsonWebKey;
}
/**
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0094-cross-domain-messaging/README.md#corerouting10forward
 */
export declare class ForwardMessage extends AgentMessage {
    /**
     * Create new ForwardMessage instance.
     *
     * @param options
     */
    constructor(options: ForwardMessageOptions);
    readonly type = MessageType.ForwardMessage;
    static readonly type = MessageType.ForwardMessage;
    to: string;
    message: JsonWebKey;
}
