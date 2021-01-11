import { ConnectionRecord, ConnectionStorageProps } from '../../storage/ConnectionRecord';
export declare function getMockConnection({ state, role, id, did, verkey, didDoc, tags, invitation, theirDid, theirDidDoc, }?: Partial<ConnectionStorageProps>): ConnectionRecord;
