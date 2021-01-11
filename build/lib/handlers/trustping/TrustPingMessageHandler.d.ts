import { Handler, HandlerInboundMessage } from '../Handler';
import { TrustPingService } from '../../protocols/trustping/TrustPingService';
import { ConnectionService } from '../../protocols/connections/ConnectionService';
import { TrustPingMessage } from '../../protocols/trustping/TrustPingMessage';
export declare class TrustPingMessageHandler implements Handler {
    private trustPingService;
    private connectionService;
    supportedMessages: (typeof TrustPingMessage)[];
    constructor(trustPingService: TrustPingService, connectionService: ConnectionService);
    handle(messageContext: HandlerInboundMessage<TrustPingMessageHandler>): Promise<import("../../types").OutboundMessage<import("../../protocols/trustping/TrustPingResponseMessage").TrustPingResponseMessage> | undefined>;
}
