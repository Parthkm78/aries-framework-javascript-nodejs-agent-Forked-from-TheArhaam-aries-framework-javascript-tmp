import { OutboundMessage, OutboundPackage } from '../types';
import { OutboundTransporter } from '../transport/OutboundTransporter';
import { EnvelopeService } from './EnvelopeService';
import { AgentMessage } from './AgentMessage';
import { Constructor } from '../utils/mixins';
import { InboundMessageContext } from './models/InboundMessageContext';
declare class MessageSender {
    private envelopeService;
    private outboundTransporter;
    constructor(envelopeService: EnvelopeService, outboundTransporter: OutboundTransporter);
    packMessage(outboundMessage: OutboundMessage): Promise<OutboundPackage>;
    sendMessage(outboundMessage: OutboundMessage): Promise<void>;
    sendAndReceiveMessage<T extends AgentMessage>(outboundMessage: OutboundMessage, ReceivedMessageClass: Constructor<T>): Promise<InboundMessageContext<T>>;
}
export { MessageSender };
