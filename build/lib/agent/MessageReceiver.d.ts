import { AgentConfig } from './AgentConfig';
import { Dispatcher } from './Dispatcher';
import { EnvelopeService } from './EnvelopeService';
import { ConnectionService } from '../protocols/connections/ConnectionService';
import { AgentMessage } from './AgentMessage';
declare class MessageReceiver {
    private config;
    private envelopeService;
    private connectionService;
    private dispatcher;
    constructor(config: AgentConfig, envelopeService: EnvelopeService, connectionService: ConnectionService, dispatcher: Dispatcher);
    /**
     * Receive and handle an inbound DIDComm message. It will unpack the message, transform it
     * to it's corresponding message class and finaly dispatch it to the dispatcher.
     *
     * @param inboundPackedMessage the message to receive and handle
     */
    receiveMessage(inboundPackedMessage: unknown): Promise<import("../types").OutboundPackage | import("../types").OutboundMessage<AgentMessage> | undefined>;
    /**
     * Unpack a message using the envelope service. Will perform extra unpacking steps for forward messages.
     * If message is not packed, it will be returned as is, but in the unpacked message structure
     *
     * @param packedMessage the received, probably packed, message to unpack
     */
    private unpackMessage;
    private isUnpackedMessage;
    /**
     * Transform an unpacked DIDComm message into it's corresponding message class. Will look at all message types in the registered handlers.
     *
     * @param unpackedMessage the unpacked message for which to transform the message in to a class instance
     */
    private transformMessage;
}
export { MessageReceiver };
