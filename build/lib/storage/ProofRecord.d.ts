import { BaseRecord, RecordType } from './BaseRecord';
import { RequestPresentationMessage } from '../protocols/proof/messages/RequestPresentationMessage';
import { ProofState } from '../protocols/proof/ProofState';
export interface ProofStorageProps {
    id?: string;
    createdAt?: number;
    presentationRequest: RequestPresentationMessage;
    state: ProofState;
    connectionId: string;
    presentationId?: string;
    tags: Record<string, unknown>;
}
export declare class ProofRecord extends BaseRecord implements ProofStorageProps {
    connectionId: string;
    presentationRequest: RequestPresentationMessage;
    presentationId?: string;
    type: RecordType;
    static type: RecordType;
    state: ProofState;
    constructor(props: ProofStorageProps);
}
