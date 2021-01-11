"use strict";
// import { Equals, IsString } from 'class-validator';
// import { Attachment } from '../Attachment';
// import { AgentMessage } from '../../../agent/AgentMessage';
// import { MessageType } from './messages';
// import { Expose, Type } from 'class-transformer';
// export interface PresentationData {
//   id?: string;
//   comment?: string;
//   attachments: Attachment[];
// }
// /**
//  * Message to communicate the DID document to the other agent when creating a connectino
//  *
//  * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0037-present-proof/README.md#presentation
//  */
// export class PresentationMessage extends AgentMessage {
//   /**
//    * Create new ConnectionRequestMessage instance.
//    * @param options
//    */
//   public constructor(options: PresentationData) {
//     super();
//     if (options) {
//       this.id = options.id || this.generateId();
//       this.comment = options.comment;
//       this.attachments = options.attachments;
//     }
//   }
//   @Equals(PresentationMessage.type)
//   public readonly type = PresentationMessage.type;
//   public static readonly type = MessageType.Presentation;
//   @IsString()
//   public comment?: string;
//   @Expose({ name: 'requests~attach' })
//   @Type(() => Attachment)
//   public attachments!: Attachment[];
// }
