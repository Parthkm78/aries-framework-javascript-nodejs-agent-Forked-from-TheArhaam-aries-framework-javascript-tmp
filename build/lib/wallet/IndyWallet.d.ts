/// <reference types="indy-sdk" />
/// <reference types="node" />
import { UnpackedMessageContext } from '../types';
import { Wallet, DidInfo } from './Wallet';
export declare class IndyWallet implements Wallet {
    private wh?;
    private masterSecretId?;
    private walletConfig;
    private walletCredentials;
    private publicDidInfo;
    private indy;
    constructor(walletConfig: WalletConfig, walletCredentials: WalletCredentials, indy: Indy);
    get walletHandle(): number | undefined;
    init(): Promise<void>;
    initPublicDid(didConfig: DidConfig): Promise<void>;
    getPublicDid(): DidInfo | undefined;
    createDid(didConfig?: DidConfig): Promise<[Did, Verkey]>;
    createCredentialDefinition(issuerDid: string, schema: Schema, tag: string, signatureType: string, config?: CredDefConfig): Promise<[CredDefId, CredDef]>;
    createCredentialOffer(credDefId: CredDefId): Promise<CredOffer>;
    /**
     *
     * @param proof This method is used to fetch credentials for proof request
     */
    getCredentialsForProofReq(proof: string): Promise<ProofCred>;
    /**
     *
     * @param proof This method is used to create proof for prover
     */
    proverCreateProof(proofReq: string, requestedCredentials: string, schemas: string, credentialDefs: string, revStates: string): Promise<Proof>;
    proverCreateMasterSecret(masterSecret: string): Promise<string>;
    /**
     *  This method is used to verify the proof
     * @param wh
     * @param proofReq
     * @param proof
     * @param requestedCredentials
     * @param schemas
     * @param credentialDefs
     * @param revocRegDefs
     * @param revocRegs
     */
    verifierVerifyProof(proofReq: string, proof: string, requestedCredentials: string, schemas: string, credentialDefs: string, revocRegDefs: string, revocRegs: string): Promise<boolean>;
    createCredentialRequest(proverDid: string, offer: CredOffer, credDef: CredDef): Promise<[CredReq, CredReqMetadata]>;
    createCredential(credOffer: CredOffer, credReq: CredReq, credValues: CredValues): Promise<[Cred, CredRevocId, RevocRegDelta]>;
    storeCredential(credentialId: CredentialId, credReqMetadata: CredReqMetadata, cred: Cred, credDef: CredDef): Promise<string>;
    pack(payload: Record<string, unknown>, recipientKeys: Verkey[], senderVk: Verkey): Promise<JsonWebKey>;
    unpack(messagePackage: JsonWebKey): Promise<UnpackedMessageContext>;
    sign(data: Buffer, verkey: Verkey): Promise<Buffer>;
    verify(signerVerkey: Verkey, data: Buffer, signature: Buffer): Promise<boolean>;
    close(): Promise<void>;
    delete(): Promise<void>;
    addWalletRecord(type: string, id: string, value: string, tags: Record<string, string>): Promise<void>;
    updateWalletRecordValue(type: string, id: string, value: string): Promise<void>;
    updateWalletRecordTags(type: string, id: string, tags: Record<string, string>): Promise<void>;
    deleteWalletRecord(type: string, id: string): Promise<void>;
    search(type: string, query: WalletQuery, options: WalletSearchOptions): Promise<AsyncGenerator<WalletRecord, void, unknown>>;
    getWalletRecord(type: string, id: string, options: WalletRecordOptions): Promise<WalletRecord>;
    signRequest(myDid: Did, request: LedgerRequest): Promise<SignedLedgerRequest>;
    private keyForLocalDid;
}
