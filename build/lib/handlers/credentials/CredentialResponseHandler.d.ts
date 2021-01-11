import { Handler, HandlerInboundMessage } from '../Handler';
import { CredentialService } from '../../protocols/credentials/CredentialService';
import { CredentialResponseMessage } from '../../protocols/credentials/messages/CredentialResponseMessage';
import { LedgerService } from '../../agent/LedgerService';
export declare class CredentialResponseHandler implements Handler {
    private credentialService;
    private ledgerService;
    supportedMessages: (typeof CredentialResponseMessage)[];
    constructor(credentialService: CredentialService, ledgerService: LedgerService);
    handle(messageContext: HandlerInboundMessage<CredentialResponseHandler>): Promise<import("../../types").OutboundMessage<import("../../protocols/credentials/messages/CredentialAckMessage").CredentialAckMessage> | undefined>;
}
