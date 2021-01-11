/// <reference types="indy-sdk" />
import { Wallet } from '../wallet/Wallet';
export declare class LedgerService {
    private wallet;
    private indy;
    private poolHandle?;
    private authorAgreement?;
    constructor(wallet: Wallet, indy: Indy);
    connect(poolName: string, poolConfig: PoolConfig): Promise<void>;
    getPublicDid(did: Did): Promise<GetNymResponse>;
    registerSchema(did: Did, schemaTemplate: SchemaTemplate): Promise<[SchemaId, Schema]>;
    getCredentialSchema(schemaId: SchemaId): Promise<Schema>;
    registerCredentialDefinition(did: Did, credentialDefinitionTemplate: CredDefTemplate): Promise<[CredDefId, CredDef]>;
    getCredentialDefinition(credDefId: CredDefId): Promise<CredDef>;
    private appendTaa;
    private getTransactionAuthorAgreement;
    private getFirstAcceptanceMechanism;
}
export interface SchemaTemplate {
    name: string;
    version: string;
    attributes: string[];
}
export interface CredDefTemplate {
    schema: Schema;
    tag: string;
    signatureType: string;
    config: {
        support_revocation: boolean;
    };
}
