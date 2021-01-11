import { Handler, HandlerInboundMessage } from '../Handler';
import { ConnectionService } from '../../protocols/connections/ConnectionService';
import { ConnectionRequestMessage } from '../../protocols/connections/ConnectionRequestMessage';
import { AgentConfig } from '../../agent/AgentConfig';
export declare class ConnectionRequestHandler implements Handler {
    private connectionService;
    private agentConfig;
    supportedMessages: (typeof ConnectionRequestMessage)[];
    constructor(connectionService: ConnectionService, agentConfig: AgentConfig);
    handle(messageContext: HandlerInboundMessage<ConnectionRequestHandler>): Promise<import("../../types").OutboundMessage<import("../../protocols/connections/ConnectionResponseMessage").ConnectionResponseMessage> | undefined>;
}
