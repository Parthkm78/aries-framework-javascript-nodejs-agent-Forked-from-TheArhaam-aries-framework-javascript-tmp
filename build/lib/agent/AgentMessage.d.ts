import { BaseMessage } from './BaseMessage';
declare const AgentMessage_base: import("../utils/mixins").Constructor<{
    thread?: import("../decorators/thread/ThreadDecorator").ThreadDecorator | undefined;
    getThreadId(): string | undefined;
    setThread(options: Partial<import("../decorators/thread/ThreadDecorator").ThreadDecorator>): void;
    id: string;
    readonly type: string;
    generateId(): string;
} & BaseMessage & {
    l10n?: import("../decorators/l10n/L10nDecorator").L10nDecorator | undefined;
    addLocale(locale: string): void;
    getLocale(): string | undefined;
    id: string;
    readonly type: string;
    generateId(): string;
} & {
    transport?: import("../decorators/transport/TransportDecorator").TransportDecorator | undefined;
    setReturnRouting(type: import("../decorators/transport/TransportDecorator").ReturnRouteTypes, thread?: string | undefined): void;
    hasReturnRouting(threadId?: string | undefined): boolean;
    id: string;
    readonly type: string;
    generateId(): string;
} & {
    timing?: import("../decorators/timing/TimingDecorator").TimingDecorator | undefined;
    setTiming(options: Partial<import("../decorators/timing/TimingDecorator").TimingDecorator>): void;
    id: string;
    readonly type: string;
    generateId(): string;
} & {
    pleaseAck?: import("../decorators/ack/AckDecorator").AckDecorator | undefined;
    setPleaseAck(): void;
    getPleaseAck(): import("../decorators/ack/AckDecorator").AckDecorator | undefined;
    requiresAck(): boolean;
    id: string;
    readonly type: string;
    generateId(): string;
}> & BaseMessage;
export declare class AgentMessage extends AgentMessage_base {
    toJSON(): Record<string, unknown>;
    is<C extends typeof AgentMessage>(Class: C): this is InstanceType<C>;
}
export {};
