import { OutboundMessage, OutboundPackage } from '../types';
import { Handler } from '../handlers/Handler';
import { MessageSender } from './MessageSender';
import { AgentMessage } from './AgentMessage';
import { InboundMessageContext } from './models/InboundMessageContext';
declare class Dispatcher {
    private handlers;
    private messageSender;
    constructor(messageSender: MessageSender);
    registerHandler(handler: Handler): void;
    dispatch(messageContext: InboundMessageContext): Promise<OutboundMessage | OutboundPackage | undefined>;
    private getHandlerForType;
    getMessageClassForType(messageType: string): typeof AgentMessage | undefined;
}
export { Dispatcher };
