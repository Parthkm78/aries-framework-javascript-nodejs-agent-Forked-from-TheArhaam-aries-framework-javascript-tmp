/// <reference types="indy-sdk" />
import { AgentMessage } from '../../agent/AgentMessage';
import { MessageType } from './messages';
export interface KeylistUpdateMessageOptions {
    id?: string;
    updates: KeylistUpdate[];
}
/**
 * Used to notify the mediator of keys in use by the recipient.
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0211-route-coordination/README.md#keylist-update
 */
export declare class KeylistUpdateMessage extends AgentMessage {
    constructor(options: KeylistUpdateMessageOptions);
    readonly type = MessageType.KeylistUpdate;
    static readonly type = MessageType.KeylistUpdate;
    updates: KeylistUpdate[];
}
export declare enum KeylistUpdateAction {
    add = "add",
    remove = "remove"
}
export declare class KeylistUpdate {
    constructor(options: {
        recipientKey: Verkey;
        action: KeylistUpdateAction;
    });
    recipientKey: Verkey;
    action: KeylistUpdateAction;
}
