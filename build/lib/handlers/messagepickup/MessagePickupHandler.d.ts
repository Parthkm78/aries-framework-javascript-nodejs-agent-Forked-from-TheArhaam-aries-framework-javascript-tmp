import { Handler, HandlerInboundMessage } from '../Handler';
import { MessagePickupService } from '../../protocols/messagepickup/MessagePickupService';
import { BatchPickupMessage } from '../../protocols/messagepickup/BatchPickupMessage';
export declare class MessagePickupHandler implements Handler {
    private messagePickupService;
    supportedMessages: (typeof BatchPickupMessage)[];
    constructor(messagePickupService: MessagePickupService);
    handle(messageContext: HandlerInboundMessage<MessagePickupHandler>): Promise<import("../../types").OutboundMessage<import("../../protocols/messagepickup/BatchMessage").BatchMessage>>;
}
