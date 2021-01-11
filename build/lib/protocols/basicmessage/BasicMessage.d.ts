import { AgentMessage } from '../../agent/AgentMessage';
import { MessageType } from './messages';
export declare class BasicMessage extends AgentMessage {
    /**
     * Create new BasicMessage instance.
     * sentTime will be assigned to new Date if not passed, id will be assigned to uuid/v4 if not passed
     * @param options
     */
    constructor(options: {
        content: string;
        sentTime?: Date;
        id?: string;
        locale?: string;
    });
    readonly type = MessageType.BasicMessage;
    static readonly type = MessageType.BasicMessage;
    sentTime: Date;
    content: string;
}
