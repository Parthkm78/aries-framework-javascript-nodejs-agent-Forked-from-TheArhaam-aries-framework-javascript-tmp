/// <reference types="indy-sdk" />
import { LedgerService, SchemaTemplate, CredDefTemplate } from '../agent/LedgerService';
import { Wallet } from '../wallet/Wallet';
export declare class LedgerModule {
    private ledgerService;
    private wallet;
    constructor(wallet: Wallet, ledgerService: LedgerService);
    connect(poolName: string, poolConfig: PoolConfig): Promise<void>;
    registerPublicDid(): Promise<void>;
    getPublicDid(did: Did): Promise<GetNymResponse>;
    registerCredentialSchema(schema: SchemaTemplate): Promise<[string, Schema]>;
    getSchema(id: SchemaId): Promise<Schema>;
    registerCredentialDefinition(credentialDefinitionTemplate: CredDefTemplate): Promise<[string, CredDef]>;
    proverCreateCredentialReq(credentialDefinitionTemplate: CredDefTemplate): Promise<[string, CredDef]>;
    getCredentialDefinition(id: CredDefId): Promise<CredDef>;
}
