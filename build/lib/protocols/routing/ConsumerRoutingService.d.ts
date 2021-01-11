/// <reference types="indy-sdk" />
import { AgentConfig } from '../../agent/AgentConfig';
import { MessageSender } from '../../agent/MessageSender';
declare class ConsumerRoutingService {
    private messageSender;
    private agentConfig;
    constructor(messageSender: MessageSender, agentConfig: AgentConfig);
    createRoute(verkey: Verkey): Promise<void>;
}
export { ConsumerRoutingService };
