export declare enum RecordType {
    BaseRecord = "BaseRecord",
    ConnectionRecord = "ConnectionRecord",
    BasicMessageRecord = "BasicMessageRecord",
    ProvisioningRecord = "ProvisioningRecord",
    CredentialRecord = "CredentialRecord",
    ProofRecord = "PresentationRecord"
}
export declare type Tags = Record<string, string | undefined>;
export declare abstract class BaseRecord {
    createdAt: number;
    updatedAt?: number;
    id: string;
    tags: Tags;
    static readonly type: RecordType;
    readonly type: RecordType;
    constructor(id: string, createdAt: number);
    getValue(): string;
    static fromPersistence<T>(typeClass: {
        new (...args: unknown[]): T;
    }, props: Record<string, any>): T;
}
