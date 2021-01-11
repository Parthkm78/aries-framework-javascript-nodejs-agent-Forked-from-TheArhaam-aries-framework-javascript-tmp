/// <reference types="indy-sdk" />
import { BaseRecord, RecordType } from './BaseRecord';
import { CredentialOfferMessage } from '../protocols/credentials/messages/CredentialOfferMessage';
import { CredentialState } from '../protocols/credentials/CredentialState';
export interface CredentialStorageProps {
    id?: string;
    createdAt?: number;
    offer: CredentialOfferMessage;
    state: CredentialState;
    connectionId: string;
    request?: CredReq;
    requestMetadata?: Record<string, unknown>;
    credentialId?: CredentialId;
    tags: Record<string, unknown>;
}
export declare class CredentialRecord extends BaseRecord implements CredentialStorageProps {
    connectionId: string;
    offer: CredentialOfferMessage;
    request?: CredReq;
    requestMetadata?: Record<string, unknown>;
    credentialId?: CredentialId;
    type: RecordType;
    static type: RecordType;
    state: CredentialState;
    constructor(props: CredentialStorageProps);
}
