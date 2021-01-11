import { TransportDecorator, ReturnRouteTypes } from './TransportDecorator';
import { BaseMessageConstructor } from '../../agent/BaseMessage';
export declare function TransportDecorated<T extends BaseMessageConstructor>(Base: T): {
    new (...args: any[]): {
        transport?: TransportDecorator | undefined;
        setReturnRouting(type: ReturnRouteTypes, thread?: string | undefined): void;
        hasReturnRouting(threadId?: string | undefined): boolean;
        id: string;
        readonly type: string;
        generateId(): string;
    };
} & T;
