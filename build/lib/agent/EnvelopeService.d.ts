import { OutboundMessage, OutboundPackage, UnpackedMessageContext } from '../types';
import { Wallet } from '../wallet/Wallet';
declare class EnvelopeService {
    private wallet;
    constructor(wallet: Wallet);
    packMessage(outboundMessage: OutboundMessage): Promise<OutboundPackage>;
    unpackMessage(packedMessage: JsonWebKey): Promise<UnpackedMessageContext>;
}
export { EnvelopeService };
