/// <reference types="indy-sdk" />
import { BaseRecord, RecordType, Tags } from './BaseRecord';
import { DidDoc } from '../protocols/connections/domain/DidDoc';
import { ConnectionState } from '../protocols/connections/domain/ConnectionState';
import { ConnectionInvitationMessage } from '../protocols/connections/ConnectionInvitationMessage';
import { ConnectionRole } from '../protocols/connections/domain/ConnectionRole';
interface ConnectionProps {
    id?: string;
    createdAt?: number;
    did: Did;
    didDoc: DidDoc;
    verkey: Verkey;
    theirDid?: Did;
    theirDidDoc?: DidDoc;
    invitation?: ConnectionInvitationMessage;
    state: ConnectionState;
    role: ConnectionRole;
    endpoint?: string;
    alias?: string;
    autoAcceptConnection?: boolean;
}
export interface ConnectionTags extends Tags {
    invitationKey?: string;
    threadId?: string;
    verkey?: string;
    theirKey?: string;
}
export interface ConnectionStorageProps extends ConnectionProps {
    tags: ConnectionTags;
}
export declare class ConnectionRecord extends BaseRecord implements ConnectionStorageProps {
    did: Did;
    didDoc: DidDoc;
    verkey: Verkey;
    theirDid?: Did;
    theirDidDoc?: DidDoc;
    private _invitation?;
    state: ConnectionState;
    role: ConnectionRole;
    endpoint?: string;
    alias?: string;
    autoAcceptConnection?: boolean;
    tags: ConnectionTags;
    static readonly type: RecordType;
    readonly type: RecordType;
    constructor(props: ConnectionStorageProps);
    get invitation(): ConnectionInvitationMessage | undefined;
    set invitation(invitation: ConnectionInvitationMessage | undefined);
    get myKey(): string | null;
    get theirKey(): string | null;
}
export {};
