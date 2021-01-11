/// <reference types="indy-sdk" />
import { AgentMessage } from '../AgentMessage';
import { ConnectionRecord } from '../../storage/ConnectionRecord';
export interface MessageContextParams {
    connection?: ConnectionRecord;
    senderVerkey?: Verkey;
    recipientVerkey?: Verkey;
}
export declare class InboundMessageContext<T extends AgentMessage = AgentMessage> {
    message: T;
    connection?: ConnectionRecord;
    senderVerkey?: Verkey;
    recipientVerkey?: Verkey;
    constructor(message: T, context?: MessageContextParams);
}
