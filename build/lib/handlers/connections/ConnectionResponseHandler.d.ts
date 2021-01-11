import { Handler, HandlerInboundMessage } from '../Handler';
import { ConnectionService } from '../../protocols/connections/ConnectionService';
import { ConnectionResponseMessage } from '../../protocols/connections/ConnectionResponseMessage';
import { AgentConfig } from '../../agent/AgentConfig';
export declare class ConnectionResponseHandler implements Handler {
    private connectionService;
    private agentConfig;
    supportedMessages: (typeof ConnectionResponseMessage)[];
    constructor(connectionService: ConnectionService, agentConfig: AgentConfig);
    handle(messageContext: HandlerInboundMessage<ConnectionResponseHandler>): Promise<import("../../types").OutboundMessage<import("../../protocols/trustping/TrustPingMessage").TrustPingMessage> | undefined>;
}
