import { AgentMessage } from '../../../agent/AgentMessage';
import { Attachment } from '../../../decorators/attachment/Attachment';
import { MessageType } from './MessageType';
interface CredentialResponseMessageOptions {
    id?: string;
    comment?: string;
    attachments: Attachment[];
}
export declare class CredentialResponseMessage extends AgentMessage {
    constructor(options: CredentialResponseMessageOptions);
    readonly type = MessageType.CredentialResponse;
    static readonly type = MessageType.CredentialResponse;
    comment?: string;
    attachments: Attachment[];
}
export {};
