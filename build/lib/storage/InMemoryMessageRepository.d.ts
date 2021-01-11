/// <reference types="indy-sdk" />
import { MessageRepository } from './MessageRepository';
import { WireMessage } from '../types';
export declare class InMemoryMessageRepository implements MessageRepository {
    private messages;
    findByVerkey(theirKey: Verkey): WireMessage[];
    deleteAllByVerkey(theirKey: Verkey): void;
    save(theirKey: Verkey, payload: WireMessage): void;
}
