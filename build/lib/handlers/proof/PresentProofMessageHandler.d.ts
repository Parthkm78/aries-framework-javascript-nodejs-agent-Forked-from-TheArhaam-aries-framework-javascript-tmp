import { Handler, HandlerInboundMessage } from '../Handler';
import { ProofService } from '../../protocols/proof/ProofService';
import { PresentProofMessage } from '../../protocols/proof/messages/PresentProofMessage';
/**
 * The funtionalities of this class is used to handle proof request
 */
export declare class PresentProofMessageHandler implements Handler {
    private proofService;
    supportedMessages: (typeof PresentProofMessage)[];
    constructor(proofService1: ProofService);
    /**
     * This Method is used to process incoming proof request
     * @param messageContext T
     */
    handle(messageContext: HandlerInboundMessage<PresentProofMessageHandler>): Promise<void>;
}
