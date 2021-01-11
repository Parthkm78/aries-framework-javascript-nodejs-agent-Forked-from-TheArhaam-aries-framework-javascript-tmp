import { AgentMessage } from '../../../agent/AgentMessage';
import { MessageType } from '../../credentials/messages/MessageType';
import { Attachment } from '../../../decorators/attachment/Attachment';
interface CredentialRequestMessageOptions {
    id?: string;
    comment?: string;
    attachments: Attachment[];
}
export declare class CredentialRequestMessage extends AgentMessage {
    constructor(options: CredentialRequestMessageOptions);
    readonly type = MessageType.CredentialRequest;
    static readonly type = MessageType.CredentialRequest;
    comment?: string;
    attachments: Attachment[];
}
export {};
