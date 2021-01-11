import { Subject } from 'rxjs';
import { ConnectionRecord } from '../storage/ConnectionRecord';
import { Agent, InboundTransporter, OutboundTransporter } from '..';
import { OutboundPackage, WireMessage } from '../types';
export declare function toBeConnectedWith(received: ConnectionRecord, connection: ConnectionRecord): {
    message: () => string;
    pass: boolean;
};
export declare class SubjectInboundTransporter implements InboundTransporter {
    private subject;
    constructor(subject: Subject<WireMessage>);
    start(agent: Agent): void;
    private subscribe;
}
export declare class SubjectOutboundTransporter implements OutboundTransporter {
    private subject;
    constructor(subject: Subject<WireMessage>);
    sendMessage(outboundPackage: OutboundPackage): Promise<void>;
}
