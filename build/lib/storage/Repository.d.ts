/// <reference types="indy-sdk" />
import { BaseRecord, RecordType } from './BaseRecord';
import { StorageService } from './StorageService';
export declare class Repository<T extends BaseRecord> {
    private storageService;
    private recordType;
    constructor(recordType: {
        new (...args: any[]): T;
        type: RecordType;
    }, storageService: StorageService<T>);
    save(record: T): Promise<void>;
    update(record: T): Promise<void>;
    delete(record: T): Promise<void>;
    find(id: string): Promise<T>;
    findAll(): Promise<T[]>;
    findByQuery(query: WalletQuery): Promise<T[]>;
}
