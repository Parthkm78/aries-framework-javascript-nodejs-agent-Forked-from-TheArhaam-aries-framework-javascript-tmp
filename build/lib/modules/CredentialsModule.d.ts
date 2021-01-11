import { ConnectionRecord } from '../storage/ConnectionRecord';
import { CredentialRecord } from '../storage/CredentialRecord';
import { CredentialService, CredentialOfferTemplate } from '../protocols/credentials/CredentialService';
import { MessageSender } from '../agent/MessageSender';
import { ConnectionService } from '../protocols/connections/ConnectionService';
import { LedgerService } from '../agent/LedgerService';
export declare class CredentialsModule {
    private connectionService;
    private credentialService;
    private ledgerService;
    private messageSender;
    constructor(connectionService: ConnectionService, credentialService: CredentialService, ledgerService: LedgerService, messageSender: MessageSender);
    issueCredential(connection: ConnectionRecord, credentialTemplate: CredentialOfferTemplate): Promise<void>;
    acceptCredential(credential: CredentialRecord): Promise<void>;
    getCredentials(): Promise<CredentialRecord[]>;
    find(id: string): Promise<CredentialRecord>;
}
