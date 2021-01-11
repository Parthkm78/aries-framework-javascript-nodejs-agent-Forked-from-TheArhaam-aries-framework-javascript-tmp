import { Handler, HandlerInboundMessage } from '../Handler';
import { CredentialService } from '../../protocols/credentials/CredentialService';
import { CredentialAckMessage } from '../../protocols/credentials/messages/CredentialAckMessage';
export declare class CredentialAckHandler implements Handler {
    private credentialService;
    supportedMessages: (typeof CredentialAckMessage)[];
    constructor(credentialService: CredentialService);
    handle(messageContext: HandlerInboundMessage<CredentialAckHandler>): Promise<void>;
}
