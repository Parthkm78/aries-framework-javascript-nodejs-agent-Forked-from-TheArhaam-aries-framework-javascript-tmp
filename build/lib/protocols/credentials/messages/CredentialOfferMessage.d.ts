import { AgentMessage } from '../../../agent/AgentMessage';
import { MessageType } from './MessageType';
import { Attachment } from '../../../decorators/attachment/Attachment';
interface CredentialPreviewOptions {
    attributes: CredentialPreviewAttribute[];
}
/**
 * This is not a message but an inner object for other messages in this protocol. It is used construct a preview of the data for the credential that is to be issued.
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0036-issue-credential/README.md#preview-credential
 */
export declare class CredentialPreview {
    constructor(options: CredentialPreviewOptions);
    readonly type = MessageType.CredentialPreview;
    static readonly type = MessageType.CredentialPreview;
    attributes: CredentialPreviewAttribute[];
    toJSON(): Record<string, unknown>;
}
interface CredentialPreviewAttributeOptions {
    name: string;
    mimeType?: string;
    value: string;
}
export declare class CredentialPreviewAttribute {
    constructor(options: CredentialPreviewAttributeOptions);
    name: string;
    mimeType?: string;
    value: string;
    toJSON(): Record<string, unknown>;
}
export interface CredentialOfferMessageOptions {
    id?: string;
    comment?: string;
    attachments: Attachment[];
    credentialPreview: CredentialPreview;
}
/**
 * Message part of Issue Credential Protocol used to continue or initiate credential exchange by issuer.
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0036-issue-credential/README.md#offer-credential
 */
export declare class CredentialOfferMessage extends AgentMessage {
    constructor(options: CredentialOfferMessageOptions);
    readonly type = MessageType.CredentialOffer;
    static readonly type = MessageType.CredentialOffer;
    comment?: string;
    credentialPreview: CredentialPreview;
    attachments: Attachment[];
}
export {};
