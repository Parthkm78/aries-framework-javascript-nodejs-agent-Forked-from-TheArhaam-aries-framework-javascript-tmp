import { Handler, HandlerInboundMessage } from '../Handler';
import { TrustPingService } from '../../protocols/trustping/TrustPingService';
import { TrustPingResponseMessage } from '../../protocols/trustping/TrustPingResponseMessage';
export declare class TrustPingResponseMessageHandler implements Handler {
    private trustPingService;
    supportedMessages: (typeof TrustPingResponseMessage)[];
    constructor(trustPingService: TrustPingService);
    handle(inboundMessage: HandlerInboundMessage<TrustPingResponseMessageHandler>): Promise<void>;
}
