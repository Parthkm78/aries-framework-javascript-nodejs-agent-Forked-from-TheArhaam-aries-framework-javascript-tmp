
import { Type, Expose } from 'class-transformer';
import { Equals, IsString } from 'class-validator';
import { AgentMessage } from '../../../agent/AgentMessage';
import { MessageType } from './messages';
import { JsonTransformer } from '../../../utils/JsonTransformer';

export interface AttributePredicateData {
  name: string,
  credDefId: string,
  mimeType: string,
  value: string,
  referent: string,
  predicate: string,
  threshold: string
}

/**
 * Message part of connection protocol used to complete the connection
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0037-present-proof/README.md#presentation-preview
 */
export class AttributePredicateMessage {
  /**
   * Create new ConnectionResponseMessage instance.
   * @param options
   */
  public constructor(options: AttributePredicateData) {

    if (options) {
      this.name = options.name;
      this.credDefId = options.credDefId;
      this.mimeType = options.mimeType || '';
      this.value = options.value || '';
      this.referent = options.referent || '';
      this.predicate = options.predicate || '';
      this.threshold = options.threshold || '';
    }
  }

  public toJSON(): Record<string, unknown> {
    return JsonTransformer.toJSON(this);
  }

  @IsString()
  public name?: string;

  @IsString()
  public credDefId?: string;

  @IsString()
  public mimeType?: string;

  @IsString()
  public value?: string;

  @IsString()
  public referent?: string;

  @IsString()
  public predicate?: string;

  @IsString()
  public threshold?: string;
}

export interface PresentationPreviewData {
  comment?: string
  attributes: AttributePredicateData,
  predicates: AttributePredicateData
}
export class PresentationPreviewMessage extends AgentMessage {

  public constructor(options: PresentationPreviewData) {

    super();
    if (options) {
      this.comment = options.comment;
      this.attributes = options.attributes;
      this.predicates = options.predicates;
    }
  }

  @Equals(PresentationPreviewMessage.type)
  public readonly type = PresentationPreviewMessage.type;
  public static readonly type = MessageType.PresentationPreview;

  @IsString()
  public comment?: string;

  @IsString()
  @Expose({ name: 'proof_preview_attribute' })
  public attributes!: AttributePredicateData;

  @IsString()
  @Expose({ name: 'prrof_preview_predicates' })
  public predicates!: AttributePredicateData;
}