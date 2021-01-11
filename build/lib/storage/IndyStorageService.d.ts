/// <reference types="indy-sdk" />
import { StorageService } from './StorageService';
import { BaseRecord } from './BaseRecord';
import { Wallet } from '../wallet/Wallet';
export declare class IndyStorageService<T extends BaseRecord> implements StorageService<T> {
    private wallet;
    private static DEFAULT_QUERY_OPTIONS;
    constructor(wallet: Wallet);
    save(record: T): Promise<void>;
    update(record: T): Promise<void>;
    delete(record: T): Promise<void>;
    find<T>(typeClass: {
        new (...args: unknown[]): T;
    }, id: string, type: string): Promise<T>;
    findAll<T>(typeClass: {
        new (...args: unknown[]): T;
    }, type: string): Promise<T[]>;
    findByQuery<T>(typeClass: {
        new (...args: unknown[]): T;
    }, type: string, query: WalletQuery): Promise<T[]>;
}
