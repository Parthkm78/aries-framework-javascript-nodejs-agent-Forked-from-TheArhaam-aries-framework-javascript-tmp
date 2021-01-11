/// <reference types="indy-sdk" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { CredentialRecord } from '../../storage/CredentialRecord';
import { Repository } from '../../storage/Repository';
import { Wallet } from '../../wallet/Wallet';
import { CredentialOfferMessage, CredentialPreview } from './messages/CredentialOfferMessage';
import { InboundMessageContext } from '../../agent/models/InboundMessageContext';
import { ConnectionRecord } from '../../storage/ConnectionRecord';
import { CredentialRequestMessage } from './messages/CredentialRequestMessage';
import { CredentialResponseMessage } from './messages/CredentialResponseMessage';
import { CredentialAckMessage } from './messages/CredentialAckMessage';
import { ProofRequestMessage } from '../proof/messages/ProofRequestMessage';
export declare enum EventType {
    StateChanged = "stateChanged"
}
export declare class CredentialService extends EventEmitter {
    private wallet;
    private credentialRepository;
    constructor(wallet: Wallet, credentialRepository: Repository<CredentialRecord>);
    /**
     * Create a new credential record and credential offer message to be send by issuer to holder.
     *
     * @param connection Connection to which issuer wants to issue a credential
     * @param credentialOfferTemplate Template for credential offer
     * @returns Credential offer message
     */
    createOffer(connection: ConnectionRecord, credentialTemplate: CredentialOfferTemplate): Promise<CredentialOfferMessage>;
    /**
     * Creates a new credential record by holder based on incoming credential offer from issuer.
     *
     * It does not accept the credential offer. Holder needs to call `createCredentialRequest` method
     * to accept the credential offer.
     *
     * @param messageContext
     */
    processOffer(messageContext: InboundMessageContext<CredentialOfferMessage>): Promise<CredentialRecord>;
    /**
     * This method is used to fetch credentials for proofRequest
     * @param proofRequestMessage
     */
    getCredentialsForProofReq(proofRequestMessage: ProofRequestMessage): Promise<ProofCred>;
    /**
     * Creates credential request message by holder to be send to issuer.
     *
     * @param connection Connection between holder and issuer
     * @param credential
     * @param credentialDefinition
     */
    createRequest(connection: ConnectionRecord, credential: CredentialRecord, credentialDefinition: CredDef, options?: CredentialRequestOptions): Promise<CredentialRequestMessage>;
    /**
     * Updates credential record by issuer based on incoming credential request from holder.
     *
     * @param messageContext
     */
    processRequest(messageContext: InboundMessageContext<CredentialRequestMessage>): Promise<CredentialRecord>;
    /**
     * Creates credential request message by issuer to be send to holder.
     *
     * @param credentialId Credential record ID
     * @param credentialResponseOptions
     */
    createResponse(credentialId: string, options?: CredentialResponseOptions): Promise<CredentialResponseMessage>;
    /**
     * Updates credential record by holder based on incoming credential request from issuer.
     *
     * @param messageContext
     * @param credentialDefinition
     */
    processResponse(messageContext: InboundMessageContext<CredentialResponseMessage>, credentialDefinition: CredDef): Promise<CredentialRecord>;
    createAck(credentialId: string): Promise<CredentialAckMessage>;
    processAck(messageContext: InboundMessageContext<CredentialAckMessage>): Promise<CredentialRecord>;
    getAll(): Promise<CredentialRecord[]>;
    find(id: string): Promise<CredentialRecord>;
    private assertState;
    private updateState;
}
export interface CredentialOfferTemplate {
    credentialDefinitionId: CredDefId;
    comment?: string;
    preview: CredentialPreview;
}
interface CredentialRequestOptions {
    comment?: string;
}
interface CredentialResponseOptions {
    comment?: string;
}
export {};
