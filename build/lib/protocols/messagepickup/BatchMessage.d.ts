import { AgentMessage } from '../../agent/AgentMessage';
import { MessageType } from './messages';
import { WireMessage } from '../../types';
export interface BatchMessageOptions {
    id?: string;
    messages: BatchMessageMessage[];
}
/**
 * A message that contains multiple waiting messages.
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0212-pickup/README.md#batch
 */
export declare class BatchMessage extends AgentMessage {
    constructor(options: BatchMessageOptions);
    readonly type = MessageType.Batch;
    static readonly type = MessageType.Batch;
    messages: BatchMessageMessage[];
}
export declare class BatchMessageMessage {
    constructor(options: {
        id?: string;
        message: WireMessage;
    });
    id: string;
    message: WireMessage;
}
