import { AgentMessage } from '../../agent/AgentMessage';
import { MessageType } from './messages';
import { TimingDecorator } from '../../decorators/timing/TimingDecorator';
export interface TrustPingMessageOptions {
    comment?: string;
    id?: string;
    responseRequested?: boolean;
    timing?: Pick<TimingDecorator, 'outTime' | 'expiresTime' | 'delayMilli'>;
}
/**
 * Message to initiate trust ping interaction
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0048-trust-ping/README.md#messages
 */
export declare class TrustPingMessage extends AgentMessage {
    /**
     * Create new TrustPingMessage instance.
     * responseRequested will be true if not passed
     * @param options
     */
    constructor(options?: TrustPingMessageOptions);
    readonly type = MessageType.TrustPingMessage;
    static readonly type = MessageType.TrustPingMessage;
    comment?: string;
    responseRequested: boolean;
}
