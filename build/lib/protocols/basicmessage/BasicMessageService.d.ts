/// <reference types="indy-sdk" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { OutboundMessage } from '../../types';
import { Repository } from '../../storage/Repository';
import { BasicMessageRecord } from '../../storage/BasicMessageRecord';
import { ConnectionRecord } from '../../storage/ConnectionRecord';
import { BasicMessage } from './BasicMessage';
import { InboundMessageContext } from '../../agent/models/InboundMessageContext';
declare enum EventType {
    MessageReceived = "messageReceived"
}
declare class BasicMessageService extends EventEmitter {
    private basicMessageRepository;
    constructor(basicMessageRepository: Repository<BasicMessageRecord>);
    send(message: string, connection: ConnectionRecord): Promise<OutboundMessage<BasicMessage>>;
    /**
     * @todo use connection from message context
     */
    save({ message }: InboundMessageContext<BasicMessage>, connection: ConnectionRecord): Promise<void>;
    findAllByQuery(query: WalletQuery): Promise<BasicMessageRecord[]>;
}
export { BasicMessageService, EventType };
