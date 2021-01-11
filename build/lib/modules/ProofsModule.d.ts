import { ConnectionRecord } from '../storage/ConnectionRecord';
import { MessageSender } from '../agent/MessageSender';
import { ProofService, ProofRequestTemplate } from '../protocols/proof/ProofService';
import { ProofRecord } from '../storage/ProofRecord';
import { CredentialService } from '../protocols/credentials/CredentialService';
import { ProofRequestMessage } from '../protocols/proof/messages/ProofRequestMessage';
import { LedgerService } from '../agent/LedgerService';
import { PresentProofMessage } from '../protocols/proof/messages/PresentProofMessage';
/**
 * The fuctionalities of this Class is used to Send proof request
 */
export declare class ProofsModule {
    private proofService;
    private messageSender;
    private credentialService;
    private ledgerService;
    constructor(proofService: ProofService, messageSender: MessageSender, credentialService: CredentialService, ledgerService: LedgerService);
    /**
     * This method is used to send proof request
     * @param connection : Connection to which issuer wants to issue a credential
     * @param ProofRequestTemplate : Template used to send proof request
     */
    sendProofRequest(connection: ConnectionRecord, proofRequestTemplate: ProofRequestTemplate): Promise<void>;
    /**
     * This method is used to send Presentation of proof
     * @param proofRequestMessage
     */
    sendPresentation(connection: ConnectionRecord, proofRequestMessage: ProofRequestMessage): Promise<void>;
    verifyPresentation(connection: ConnectionRecord, proofRequestMessage: ProofRequestMessage, presentProofMessage: PresentProofMessage): Promise<void>;
    proverCreateMasterSecret(masterSecret: string): Promise<string>;
    getProofs(): Promise<ProofRecord[]>;
    find(id: string): Promise<ProofRecord>;
}
