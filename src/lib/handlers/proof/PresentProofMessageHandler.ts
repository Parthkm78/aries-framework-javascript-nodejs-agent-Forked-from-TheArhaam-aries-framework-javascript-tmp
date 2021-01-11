import { Handler, HandlerInboundMessage } from '../Handler';
import { ProofService } from '../../protocols/proof/ProofService';
import { PresentProofMessage } from '../../protocols/proof/messages/PresentProofMessage';
import { JsonEncoder } from '../../utils/JsonEncoder';

/**
 * The funtionalities of this class is used to handle proof request
 */
export class PresentProofMessageHandler implements Handler {
    private proofService: ProofService;
    public supportedMessages = [PresentProofMessage];

    public constructor(proofService1: ProofService) {
        this.proofService = proofService1;
      }
    

    /**
     * This Method is used to process incoming proof request
     * @param messageContext T
     */
    public async handle(messageContext: HandlerInboundMessage<PresentProofMessageHandler>) {
        console.log("Proof Presentaion imcoming req:");
        const presentProofMessage = messageContext.message;
        const connection = messageContext.connection;
    
        if (!connection) {
          throw new Error('There is no connection in message context.');
        }
    
        const [responseAttachment] = messageContext.message.attachments;
    
        if (!responseAttachment.data.base64) {
          throw new Error('Missing required base64 encoded attachment data');
        }
    
        const [credOffer] = JsonEncoder.fromBase64(responseAttachment.data.base64);
        console.log(credOffer);
        //await this.proofService.processPresentation(messageContext);
    }
}
