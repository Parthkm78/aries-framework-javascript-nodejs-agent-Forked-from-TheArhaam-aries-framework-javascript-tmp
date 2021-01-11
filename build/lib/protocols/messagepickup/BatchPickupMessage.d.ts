import { AgentMessage } from '../../agent/AgentMessage';
import { MessageType } from './messages';
export interface BatchPickupMessageOptions {
    id?: string;
    batchSize: number;
}
/**
 * A message to request to have multiple waiting messages sent inside a `batch` message.
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0212-pickup/README.md#batch-pickup
 */
export declare class BatchPickupMessage extends AgentMessage {
    /**
     * Create new BatchPickupMessage instance.
     *
     * @param options
     */
    constructor(options: BatchPickupMessageOptions);
    readonly type = MessageType.BatchPickup;
    static readonly type = MessageType.BatchPickup;
    batchSize: number;
}
