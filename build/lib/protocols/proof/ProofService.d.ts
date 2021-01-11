/// <reference types="indy-sdk" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { RequestPresentationMessage } from './messages/RequestPresentationMessage';
import { ConnectionRecord } from '../../storage/ConnectionRecord';
import { Repository } from '../../storage/Repository';
import { ProofRecord } from '../../storage/ProofRecord';
import { ProofState } from './ProofState';
import { ProofRequestMessage } from './messages/ProofRequestMessage';
import { Wallet } from '../../wallet/Wallet';
import { InboundMessageContext } from '../../agent/models/InboundMessageContext';
import { LedgerService } from '../../agent/LedgerService';
import { PresentProofMessage } from './messages/PresentProofMessage';
export declare enum EventType {
    StateChanged = "stateChanged"
}
export declare class ProofService extends EventEmitter {
    private wallet;
    private proofRepository;
    constructor(wallet: Wallet, proofRepository: Repository<ProofRecord>);
    /**
     * Create a new Proof Request
     *
     * @param connection Connection to which agent wants to send proof request
     * @param ProofRequestTemplate Template for Proof Request
     * @returns Proof Request message
     */
    createRequest(connection: ConnectionRecord, proofRequestTemplate: ProofRequestTemplate): Promise<RequestPresentationMessage>;
    /**
     * Process incoming Proof request.
     *
     * @param messageContext
     */
    processRequest(messageContext: InboundMessageContext<RequestPresentationMessage>): Promise<ProofRecord>;
    proverCreateMasterSecret(masterSecret: string): Promise<string>;
    /**
    * This method is used to create Presentation of proof
    * @param proofRequestMessage
    */
    createPresentation(proofRequestMessage: ProofRequestMessage, proofCred: ProofCred, ledgerService: LedgerService, options?: sendPresentationOptions): Promise<PresentProofMessage>;
    verifyPresentation(proofRequestMessage: ProofRequestMessage, presentProofMessage: PresentProofMessage, proofCred: ProofCred, ledgerService: LedgerService, options?: sendPresentationOptions): Promise<boolean>;
    updateState(proofRecord: ProofRecord, newState: ProofState): Promise<void>;
    getAll(): Promise<ProofRecord[]>;
    find(id: string): Promise<ProofRecord>;
}
export interface ProofRequestTemplate {
    comment?: string;
    proofRequest: ProofRequestMessage;
}
interface sendPresentationOptions {
    comment?: string;
}
export {};
