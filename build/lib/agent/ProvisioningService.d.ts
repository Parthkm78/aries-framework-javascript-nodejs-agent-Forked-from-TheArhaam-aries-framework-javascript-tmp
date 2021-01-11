/// <reference types="indy-sdk" />
import { Repository } from '../storage/Repository';
import { ProvisioningRecord } from '../storage/ProvisioningRecord';
export declare class ProvisioningService {
    private provisioningRepository;
    constructor(provisioningRepository: Repository<ProvisioningRecord>);
    find(): Promise<ProvisioningRecord | null>;
    create({ mediatorConnectionId, mediatorPublicVerkey }: ProvisioningProps): Promise<ProvisioningRecord>;
}
interface ProvisioningProps {
    mediatorConnectionId: string;
    mediatorPublicVerkey: Verkey;
}
export {};
