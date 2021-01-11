import { Handler, HandlerInboundMessage } from '../Handler';
import { CredentialService } from '../../protocols/credentials/CredentialService';
import { CredentialRequestMessage } from '../../protocols/credentials/messages/CredentialRequestMessage';
export declare class CredentialRequestHandler implements Handler {
    private credentialService;
    supportedMessages: (typeof CredentialRequestMessage)[];
    constructor(credentialService: CredentialService);
    handle(messageContext: HandlerInboundMessage<CredentialRequestHandler>): Promise<import("../../types").OutboundMessage<import("../../protocols/credentials/messages/CredentialResponseMessage").CredentialResponseMessage>>;
}
