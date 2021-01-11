/// <reference types="indy-sdk" />
import { OutboundMessage } from '../../types';
import { ConnectionRecord } from '../../storage/ConnectionRecord';
import { KeylistUpdateMessage } from '../coordinatemediation/KeylistUpdateMessage';
import { ForwardMessage } from './ForwardMessage';
import { InboundMessageContext } from '../../agent/models/InboundMessageContext';
export interface RoutingTable {
    [recipientKey: string]: ConnectionRecord | undefined;
}
declare class ProviderRoutingService {
    private routingTable;
    /**
     * @todo use connection from message context
     */
    updateRoutes(messageContext: InboundMessageContext<KeylistUpdateMessage>, connection: ConnectionRecord): void;
    forward(messageContext: InboundMessageContext<ForwardMessage>): OutboundMessage<ForwardMessage>;
    getRoutes(): RoutingTable;
    findRecipient(recipientKey: Verkey): ConnectionRecord;
    saveRoute(recipientKey: Verkey, connection: ConnectionRecord): void;
    removeRoute(recipientKey: Verkey, connection: ConnectionRecord): void;
}
export { ProviderRoutingService };
