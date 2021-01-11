import { Handler, HandlerInboundMessage } from '../Handler';
import { CredentialService } from '../../protocols/credentials/CredentialService';
import { CredentialOfferMessage } from '../../protocols/credentials/messages/CredentialOfferMessage';
export declare class CredentialOfferHandler implements Handler {
    private credentialService;
    supportedMessages: (typeof CredentialOfferMessage)[];
    constructor(credentialService: CredentialService);
    handle(messageContext: HandlerInboundMessage<CredentialOfferHandler>): Promise<void>;
}
