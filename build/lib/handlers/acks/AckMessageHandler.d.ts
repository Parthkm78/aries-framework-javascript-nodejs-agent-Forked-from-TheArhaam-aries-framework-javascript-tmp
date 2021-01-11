import { Handler, HandlerInboundMessage } from '../Handler';
import { ConnectionService } from '../../protocols/connections/ConnectionService';
import { AckMessage } from '../../protocols/connections/AckMessage';
export declare class AckMessageHandler implements Handler {
    private connectionService;
    supportedMessages: (typeof AckMessage)[];
    constructor(connectionService: ConnectionService);
    handle(inboundMessage: HandlerInboundMessage<AckMessageHandler>): Promise<void>;
}
