import { Handler, HandlerInboundMessage } from '../Handler';
import { ProviderRoutingService } from '../../protocols/routing/ProviderRoutingService';
import { ForwardMessage } from '../../protocols/routing/ForwardMessage';
export declare class ForwardHandler implements Handler {
    private routingService;
    supportedMessages: (typeof ForwardMessage)[];
    constructor(routingService: ProviderRoutingService);
    handle(messageContext: HandlerInboundMessage<ForwardHandler>): Promise<import("../../types").OutboundMessage<ForwardMessage>>;
}
