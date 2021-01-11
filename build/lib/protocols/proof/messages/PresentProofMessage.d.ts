import { AgentMessage } from '../../../agent/AgentMessage';
import { MessageType } from './messages';
import { Attachment } from '../../../decorators/attachment/Attachment';
/**
 * Interface for RequestPresentation
 */
export interface PresentProofData {
    id?: string;
    comment?: string;
    attachments: Attachment[];
}
/**
 * Message to request a proof presentation from another agent
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0037-present-proof/README.md#presentation
 */
export declare class PresentProofMessage extends AgentMessage {
    /**
     * Create new PresentProofMessage instance.
     * @param options
     */
    constructor(options: PresentProofData);
    readonly type = MessageType.Presentation;
    static readonly type = MessageType.Presentation;
    comment?: string;
    attachments: Attachment[];
}
