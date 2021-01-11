import { AgentMessage } from '../../agent/AgentMessage';
import { MessageType } from './messages';
export interface InlineInvitationData {
    recipientKeys: string[];
    serviceEndpoint: string;
    routingKeys?: string[];
}
export interface DIDInvitationData {
    did: string;
}
/**
 * Message to invite another agent to create a connection
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0160-connection-protocol/README.md#0-invitation-to-connect
 */
export declare class ConnectionInvitationMessage extends AgentMessage {
    /**
     * Create new ConnectionInvitationMessage instance.
     * @param options
     */
    constructor(options: {
        id?: string;
        label: string;
    } & (DIDInvitationData | InlineInvitationData));
    readonly type = MessageType.ConnectionInvitation;
    static readonly type = MessageType.ConnectionInvitation;
    label: string;
    did?: string;
    recipientKeys?: string[];
    serviceEndpoint?: string;
    routingKeys?: string[];
}
