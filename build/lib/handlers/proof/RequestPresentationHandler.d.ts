import { Handler, HandlerInboundMessage } from '../Handler';
import { ProofService } from '../../protocols/proof/ProofService';
import { RequestPresentationMessage } from '../../protocols/proof/messages/RequestPresentationMessage';
/**
 * The funtionalities of this class is used to handle proof request
 */
export declare class RequestPresentationHandler implements Handler {
    private proofService;
    supportedMessages: (typeof RequestPresentationMessage)[];
    constructor(proofService: ProofService);
    /**
     * This Method is used to process incoming proof request
     * @param messageContext T
     */
    handle(messageContext: HandlerInboundMessage<RequestPresentationHandler>): Promise<void>;
}
