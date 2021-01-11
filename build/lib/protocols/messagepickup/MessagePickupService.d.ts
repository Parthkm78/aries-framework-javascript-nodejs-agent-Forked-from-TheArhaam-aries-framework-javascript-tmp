import { InboundConnection } from '../../types';
import { MessageRepository } from '../../storage/MessageRepository';
import { ConnectionRecord } from '../../storage/ConnectionRecord';
import { BatchPickupMessage } from './BatchPickupMessage';
import { BatchMessage } from './BatchMessage';
export declare class MessagePickupService {
    private messageRepository?;
    constructor(messageRepository?: MessageRepository);
    batchPickup(inboundConnection: InboundConnection): Promise<import("../../types").OutboundMessage<BatchPickupMessage>>;
    batch(connection: ConnectionRecord): Promise<import("../../types").OutboundMessage<BatchMessage>>;
}
