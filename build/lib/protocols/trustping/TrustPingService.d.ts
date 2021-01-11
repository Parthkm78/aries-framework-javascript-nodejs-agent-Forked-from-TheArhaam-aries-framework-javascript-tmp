import { ConnectionRecord } from '../../storage/ConnectionRecord';
import { TrustPingMessage } from './TrustPingMessage';
import { TrustPingResponseMessage } from './TrustPingResponseMessage';
import { InboundMessageContext } from '../../agent/models/InboundMessageContext';
/**
 * @todo use connection from message context
 */
export declare class TrustPingService {
    processPing({ message }: InboundMessageContext<TrustPingMessage>, connection: ConnectionRecord): import("../../types").OutboundMessage<TrustPingResponseMessage> | undefined;
    processPingResponse(inboundMessage: InboundMessageContext<TrustPingResponseMessage>): void;
}
