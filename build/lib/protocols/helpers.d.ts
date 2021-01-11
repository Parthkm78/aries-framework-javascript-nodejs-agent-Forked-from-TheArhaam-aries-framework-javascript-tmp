import { ConnectionRecord } from '../storage/ConnectionRecord';
import { AgentMessage } from '../agent/AgentMessage';
import { OutboundMessage } from '../types';
import { ConnectionInvitationMessage } from './connections/ConnectionInvitationMessage';
export declare function createOutboundMessage<T extends AgentMessage = AgentMessage>(connection: ConnectionRecord, payload: T, invitation?: ConnectionInvitationMessage): OutboundMessage<T>;
