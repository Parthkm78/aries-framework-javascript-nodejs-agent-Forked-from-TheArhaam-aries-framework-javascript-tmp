import { DidDoc } from './DidDoc';
export interface ConnectionOptions {
    did: string;
    didDoc?: DidDoc;
}
export declare class Connection {
    constructor(options: ConnectionOptions);
    did: string;
    didDoc?: DidDoc;
}
