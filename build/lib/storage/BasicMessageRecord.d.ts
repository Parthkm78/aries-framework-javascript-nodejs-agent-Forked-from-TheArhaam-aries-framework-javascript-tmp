import { BaseRecord, RecordType, Tags } from './BaseRecord';
export interface BasicMessageStorageProps {
    id?: string;
    createdAt?: number;
    tags: Tags;
    content: string;
    sentTime: string;
}
export declare class BasicMessageRecord extends BaseRecord implements BasicMessageStorageProps {
    content: string;
    sentTime: string;
    static readonly type: RecordType;
    readonly type: RecordType;
    constructor(props: BasicMessageStorageProps);
}
