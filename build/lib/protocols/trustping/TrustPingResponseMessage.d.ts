import { AgentMessage } from '../../agent/AgentMessage';
import { MessageType } from './messages';
import { TimingDecorator } from '../../decorators/timing/TimingDecorator';
export interface TrustPingResponseMessageOptions {
    comment?: string;
    id?: string;
    threadId: string;
    timing?: Pick<TimingDecorator, 'inTime' | 'outTime'>;
}
/**
 * Message to respond to a trust ping message
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0048-trust-ping/README.md#messages
 */
export declare class TrustPingResponseMessage extends AgentMessage {
    /**
     * Create new TrustPingResponseMessage instance.
     * responseRequested will be true if not passed
     * @param options
     */
    constructor(options: TrustPingResponseMessageOptions);
    static readonly type = MessageType.TrustPingResponseMessage;
    readonly type = MessageType.TrustPingResponseMessage;
    comment?: string;
}
