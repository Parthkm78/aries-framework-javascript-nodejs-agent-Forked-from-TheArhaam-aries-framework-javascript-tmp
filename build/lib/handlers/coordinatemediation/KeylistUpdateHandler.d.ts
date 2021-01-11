import { Handler, HandlerInboundMessage } from '../Handler';
import { ProviderRoutingService } from '../../protocols/routing/ProviderRoutingService';
import { KeylistUpdateMessage } from '../../protocols/coordinatemediation/KeylistUpdateMessage';
export declare class KeylistUpdateHandler implements Handler {
    private routingService;
    supportedMessages: (typeof KeylistUpdateMessage)[];
    constructor(routingService: ProviderRoutingService);
    handle(messageContext: HandlerInboundMessage<KeylistUpdateHandler>): Promise<void>;
}
