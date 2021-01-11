import { AgentMessage } from '../../../agent/AgentMessage';
import { MessageType } from './messages';
import { Attachment } from '../../../decorators/attachment/Attachment';
/**
 * Interface for RequestPresentation
 */
export interface RequestPresentationData {
    id?: string;
    comment?: string;
    attachments: Attachment[];
}
/**
 * Message to request a proof presentation from another agent
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0037-present-proof/README.md#request-presentation
 */
export declare class RequestPresentationMessage extends AgentMessage {
    /**
     * Create new RequestPresentationMessage instance.
     * @param options
     */
    constructor(options: RequestPresentationData);
    readonly type = MessageType.RequestPresentation;
    static readonly type = MessageType.RequestPresentation;
    comment?: string;
    attachments: Attachment[];
}
