/// <reference types="indy-sdk" />
import { BaseRecord, RecordType } from './BaseRecord';
interface ProvisioningRecordProps {
    id: string;
    createdAt?: number;
    tags?: {
        [keys: string]: string;
    };
    mediatorConnectionId: string;
    mediatorPublicVerkey: Verkey;
}
export declare class ProvisioningRecord extends BaseRecord {
    mediatorConnectionId: string;
    mediatorPublicVerkey: Verkey;
    static readonly type: RecordType;
    readonly type: RecordType;
    constructor(props: ProvisioningRecordProps);
}
export {};
