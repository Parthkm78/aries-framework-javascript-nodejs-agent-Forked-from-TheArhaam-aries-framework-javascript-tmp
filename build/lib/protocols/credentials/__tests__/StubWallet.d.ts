/// <reference types="indy-sdk" />
/// <reference types="node" />
import { Wallet, DidInfo } from '../../../wallet/Wallet';
import { UnpackedMessageContext } from '../../../types';
export declare class StubWallet implements Wallet {
    private wh?;
    init(): Promise<void>;
    close(): Promise<void>;
    delete(): Promise<void>;
    initPublicDid(didConfig: DidConfig): Promise<void>;
    getPublicDid(): DidInfo | undefined;
    createDid(didConfig?: DidConfig | undefined): Promise<[string, string]>;
    createCredentialDefinition(issuerDid: string, schema: Schema, tag: string, signatureType: string, config: CredDefConfig): Promise<[string, CredDef]>;
    createCredentialOffer(credDefId: string): Promise<CredOffer>;
    getCredentialsForProofReq(proof: string): Promise<ProofCred>;
    proverCreateMasterSecret(masterSecret: string): Promise<string>;
    proverCreateProof(proofReq: string, requestedCredentials: string, schemas: string, credentialDefs: string, revStates: string): Promise<Proof>;
    verifierVerifyProof(proofReq: string, proof: string, requestedCredentials: string, schemas: string, credentialDefs: string, revocRegDefs: string, revocRegs: string): Promise<boolean>;
    createCredentialRequest(proverDid: string, offer: CredOffer, credDef: CredDef): Promise<[CredReq, CredReqMetadata]>;
    createCredential(credOffer: CredOffer, credReq: CredReq, credValues: CredValues): Promise<[Cred, CredRevocId, RevocRegDelta]>;
    storeCredential(credentialId: CredentialId): Promise<string>;
    pack(payload: Record<string, unknown>, recipientKeys: string[], senderVk: string | null): Promise<JsonWebKey>;
    unpack(messagePackage: JsonWebKey): Promise<UnpackedMessageContext>;
    sign(data: Buffer, verkey: string): Promise<Buffer>;
    verify(signerVerkey: string, data: Buffer, signature: Buffer): Promise<boolean>;
    addWalletRecord(type: string, id: string, value: string, tags: Record<string, string>): Promise<void>;
    updateWalletRecordValue(type: string, id: string, value: string): Promise<void>;
    updateWalletRecordTags(type: string, id: string, tags: Record<string, string>): Promise<void>;
    deleteWalletRecord(type: string, id: string): Promise<void>;
    getWalletRecord(type: string, id: string, options: WalletRecordOptions): Promise<WalletRecord>;
    search(type: string, query: WalletQuery, options: WalletRecordOptions): Promise<AsyncIterable<WalletRecord>>;
    signRequest(myDid: string, request: LedgerRequest): Promise<LedgerRequest>;
}
