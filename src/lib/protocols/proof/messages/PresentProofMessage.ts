import { Equals, IsArray, IsString, ValidateNested, IsOptional } from 'class-validator';
import { AgentMessage } from '../../../agent/AgentMessage';
import { MessageType } from './messages';
import { Attachment } from '../../../decorators/attachment/Attachment';
import { Expose, Type } from 'class-transformer';

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
export class PresentProofMessage extends AgentMessage {
  /**
   * Create new PresentProofMessage instance.
   * @param options
   */
  public constructor(options: PresentProofData) {
    super();

    if (options) {
      this.id = options.id || this.generateId();
      this.comment = options.comment;
      this.attachments = options.attachments;
    }
  }

  @Equals(PresentProofMessage.type)
  public readonly type = PresentProofMessage.type;
  public static readonly type = MessageType.Presentation;

  @IsOptional()
  @IsString()
  public comment?: string;

  @Expose({ name: 'presentation-proof~attach' })
  @Type(() => Attachment)
  @IsArray()
  @ValidateNested({
    each: true,
  })
  public attachments!: Attachment[];
}
