import { AgentMessage } from '../../../agent/AgentMessage';
import { MessageType } from './messages';
export interface AttributePredicateData {
    name: string;
    credDefId: string;
    mimeType: string;
    value: string;
    referent: string;
    predicate: string;
    threshold: string;
}
/**
 * Message part of connection protocol used to complete the connection
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0037-present-proof/README.md#presentation-preview
 */
export declare class AttributePredicateMessage {
    /**
     * Create new ConnectionResponseMessage instance.
     * @param options
     */
    constructor(options: AttributePredicateData);
    toJSON(): Record<string, unknown>;
    name?: string;
    credDefId?: string;
    mimeType?: string;
    value?: string;
    referent?: string;
    predicate?: string;
    threshold?: string;
}
export interface PresentationPreviewData {
    comment?: string;
    attributes: AttributePredicateData;
    predicates: AttributePredicateData;
}
export declare class PresentationPreviewMessage extends AgentMessage {
    constructor(options: PresentationPreviewData);
    readonly type = MessageType.PresentationPreview;
    static readonly type = MessageType.PresentationPreview;
    comment?: string;
    attributes: AttributePredicateData;
    predicates: AttributePredicateData;
}
