import { Handler, HandlerInboundMessage } from '../Handler';
import { BasicMessageService } from '../../protocols/basicmessage/BasicMessageService';
import { BasicMessage } from '../../protocols/basicmessage/BasicMessage';
export declare class BasicMessageHandler implements Handler {
    private basicMessageService;
    supportedMessages: (typeof BasicMessage)[];
    constructor(basicMessageService: BasicMessageService);
    handle(messageContext: HandlerInboundMessage<BasicMessageHandler>): Promise<void>;
}
