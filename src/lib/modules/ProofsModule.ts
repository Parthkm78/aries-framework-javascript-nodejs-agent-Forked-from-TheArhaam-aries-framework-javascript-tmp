import { ConnectionRecord } from '../storage/ConnectionRecord';
import { createOutboundMessage } from '../protocols/helpers';
import { MessageSender } from '../agent/MessageSender';
import { ProofService, ProofRequestTemplate } from '../protocols/proof/ProofService';
import { ProofRecord } from '../storage/ProofRecord';
import { CredentialService } from '../protocols/credentials/CredentialService'
import { ProofRequestMessage } from '../protocols/proof/messages/ProofRequestMessage';
import { LedgerService } from '../agent/LedgerService';
import { PresentProofMessage } from '../protocols/proof/messages/PresentProofMessage';

/**
 * The fuctionalities of this Class is used to Send proof request
 */
export class ProofsModule {
  private proofService: ProofService;
  private messageSender: MessageSender;
  private credentialService: CredentialService;
  private ledgerService: LedgerService;

  public constructor(proofService: ProofService, messageSender: MessageSender, credentialService: CredentialService, ledgerService: LedgerService) {
    this.proofService = proofService;
    this.messageSender = messageSender;
    this.credentialService = credentialService;
    this.ledgerService = ledgerService;
  }

  /**
   * This method is used to send proof request
   * @param connection : Connection to which issuer wants to issue a credential
   * @param ProofRequestTemplate : Template used to send proof request
   */
  public async sendProofRequest(connection: ConnectionRecord, proofRequestTemplate: ProofRequestTemplate) {
    const proofOfferMessage = await this.proofService.createRequest(connection, proofRequestTemplate);
    const outboundMessage = createOutboundMessage(connection, proofOfferMessage);
    await this.messageSender.sendMessage(outboundMessage);
  }

  /**
   * This method is used to send Presentation of proof
   * @param proofRequestMessage
   */
  public async sendPresentation(connection: ConnectionRecord, proofRequestMessage: ProofRequestMessage) {
    const credentials = await this.credentialService.getCredentialsForProofReq(proofRequestMessage);
    console.log("Credentials for proof:" + JSON.stringify(credentials));
    const presentation = await this.proofService.createPresentation(proofRequestMessage, credentials, this.ledgerService);
    console.log("Prrof req:" + JSON.stringify(presentation));
    const outboundMessage = createOutboundMessage(connection, presentation);
    await this.messageSender.sendMessage(outboundMessage);
  }

  public async verifyPresentation(connection: ConnectionRecord, proofRequestMessage: ProofRequestMessage,presentProofMessage:PresentProofMessage) {
    const credentials = await this.credentialService.getCredentialsForProofReq(proofRequestMessage);
    console.log("Credentials for proof:" + JSON.stringify(credentials));
    const result = await this.proofService.verifyPresentation(proofRequestMessage,presentProofMessage, credentials, this.ledgerService);
    console.log("PROOF MODULE:Result:"+result);
    // console.log("Prrof req:" + JSON.stringify(presentation));
    // const outboundMessage = createOutboundMessage(connection, presentation);
    // await this.messageSender.sendMessage(outboundMessage);
  }

  public async proverCreateMasterSecret(masterSecret: string): Promise<string> {

    return await this.proofService.proverCreateMasterSecret(masterSecret);
  }

  public async getProofs(): Promise<ProofRecord[]> {
    return this.proofService.getAll();
  }

  public async find(id: string) {
    return this.proofService.find(id);
  }
}
