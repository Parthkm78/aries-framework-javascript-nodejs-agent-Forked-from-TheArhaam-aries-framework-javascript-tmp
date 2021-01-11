/// <reference types="indy-sdk" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { BasicMessageService } from '../protocols/basicmessage/BasicMessageService';
import { MessageSender } from '../agent/MessageSender';
import { ConnectionRecord } from '../storage/ConnectionRecord';
export declare class BasicMessagesModule {
    private basicMessageService;
    private messageSender;
    constructor(basicMessageService: BasicMessageService, messageSender: MessageSender);
    sendMessage(connection: ConnectionRecord, message: string): Promise<void>;
    findAllByQuery(query: WalletQuery): Promise<import("..").BasicMessageRecord[]>;
    events(): EventEmitter;
}
