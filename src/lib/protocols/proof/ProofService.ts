import { EventEmitter } from 'events';
import { RequestPresentationMessage } from './messages/RequestPresentationMessage';
import { ConnectionRecord } from '../../storage/ConnectionRecord';
import { Attachment, AttachmentData } from '../../decorators/attachment/Attachment';
import { JsonEncoder } from '../../utils/JsonEncoder';
import { Repository } from '../../storage/Repository';
import { ProofRecord } from '../../storage/ProofRecord';
import { ProofState } from './ProofState';
import { ProofRequestMessage } from './messages/ProofRequestMessage';
import { Wallet } from '../../wallet/Wallet';
import { InboundMessageContext } from '../../agent/models/InboundMessageContext';
import { LedgerService } from '../../agent/LedgerService';
import { ProofUtils } from './ProofUtils';
import { PresentProofMessage } from './messages/PresentProofMessage';

export enum EventType {
  StateChanged = 'stateChanged',
}

export class ProofService extends EventEmitter {
  private wallet: Wallet;
  private proofRepository: Repository<ProofRecord>;

  public constructor(wallet: Wallet, proofRepository: Repository<ProofRecord>) {
    super();
    this.wallet = wallet;
    this.proofRepository = proofRepository;
  }

  /**
   * Create a new Proof Request
   *
   * @param connection Connection to which agent wants to send proof request
   * @param ProofRequestTemplate Template for Proof Request
   * @returns Proof Request message
   */
  public async createRequest(
    connection: ConnectionRecord,
    proofRequestTemplate: ProofRequestTemplate
  ): Promise<RequestPresentationMessage> {
    const { comment, proofRequest } = proofRequestTemplate;
    const attachment = new Attachment({
      mimeType: 'application/json',
      data: new AttachmentData({
        base64: JsonEncoder.toBase64(proofRequest),
      }),
    });

    const requestPresentationMessage = new RequestPresentationMessage({
      comment,
      attachments: [attachment],
    });

    //save in repository
    const proofRecord = new ProofRecord({
      connectionId: connection.id,
      presentationRequest: requestPresentationMessage,
      state: ProofState.RequestSent,
      tags: { threadId: requestPresentationMessage.id },
    });

    await this.proofRepository.save(proofRecord);
    this.emit(EventType.StateChanged, { proofRecord, prevState: ProofState.RequestSent });

    return requestPresentationMessage;
  }

  /**
   * Process incoming Proof request.
   *
   * @param messageContext
   */
  public async processRequest(
    messageContext: InboundMessageContext<RequestPresentationMessage>
  ): Promise<ProofRecord> {
    const proofRequest = messageContext.message;
    const connection = messageContext.connection;

    if (!connection) {
      throw new Error('There is no connection in message context.');
    }

    const [responseAttachment] = messageContext.message.attachments;

    if (!responseAttachment.data.base64) {
      throw new Error('Missing required base64 encoded attachment data');
    }


    const proofRecord = new ProofRecord({
      connectionId: connection.id,
      presentationRequest: proofRequest,
      state: ProofState.RequestReceived,
      tags: { threadId: proofRequest.id },
    });
    //save in repository
    await this.proofRepository.save(proofRecord);
    this.emit(EventType.StateChanged, { proofRecord, prevState: ProofState.RequestReceived });

    //TODO : process for genrating proof
    return proofRecord;
  }
  public async proverCreateMasterSecret(masterSecret: string): Promise<string> {

    return await this.wallet.proverCreateMasterSecret(masterSecret);
  }
  /**
  * This method is used to create Presentation of proof
  * @param proofRequestMessage
  */
  public async createPresentation(proofRequestMessage: ProofRequestMessage, proofCred: ProofCred, ledgerService: LedgerService, options: sendPresentationOptions = {}): Promise<PresentProofMessage> {

    let requestParmsObj = await ProofUtils.constructGenerateProofParms(proofCred.attrs, ledgerService);

    console.log("calling wallet:proverCreateProof:")
    let proof = await this.wallet.proverCreateProof(JSON.stringify(proofRequestMessage), JSON.stringify(requestParmsObj.reqCred), JSON.stringify(requestParmsObj.schemas), JSON.stringify(requestParmsObj.credDefs), '{}');

    const attachment = new Attachment({
      mimeType: 'application/json',
      data: new AttachmentData({
        base64: JsonEncoder.toBase64(proof),
      }),
    });

    // const { comment } = options;
    let comment = "Test";
    const presentProofMessage = new PresentProofMessage({ comment, attachments: [attachment] });
    // presentProofMessage.setThread({ threadId: credential.tags.threadId });

    // credential.requestMetadata = credReqMetadata;
    // await this.updateState(credential, CredentialState.RequestSent);
    return presentProofMessage;

  }

  public async verifyPresentation(proofRequestMessage: ProofRequestMessage, presentProofMessage: PresentProofMessage, proofCred: ProofCred, ledgerService: LedgerService, options: sendPresentationOptions = {}): Promise<boolean> {

    const [responseAttachment] = presentProofMessage.attachments;

    if (!responseAttachment.data.base64) {
      throw new Error('Missing required base64 encoded attachment data');
    }

    const proof = JsonEncoder.fromBase64(responseAttachment.data.base64);

    let requestParmsObj = await ProofUtils.constructGenerateProofParms(proofCred.attrs, ledgerService);

    console.log("calling verify prsentation wallet:")
    return await this.wallet.verifierVerifyProof(JSON.stringify(proofRequestMessage), JSON.stringify(proof), JSON.stringify(requestParmsObj.reqCred), JSON.stringify(requestParmsObj.schemas), JSON.stringify(requestParmsObj.credDefs), '{}', '{}');

  }

  public async updateState(proofRecord: ProofRecord, newState: ProofState) {
    const prevState = proofRecord.state;
    proofRecord.state = newState;
    await this.proofRepository.update(proofRecord);

    this.emit(EventType.StateChanged, { proofRecord, prevState });
  }

  public async getAll(): Promise<ProofRecord[]> {
    return this.proofRepository.findAll();
  }

  public async find(id: string): Promise<ProofRecord> {
    return this.proofRepository.find(id);
  }
}

/*
 * This interface used as Proof Request Template
 */
export interface ProofRequestTemplate {
  comment?: string;
  proofRequest: ProofRequestMessage;
}

interface sendPresentationOptions {
  comment?: string;
}
