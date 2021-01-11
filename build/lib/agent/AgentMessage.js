"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentMessage = void 0;
const mixins_1 = require("../utils/mixins");
const ThreadDecoratorExtension_1 = require("../decorators/thread/ThreadDecoratorExtension");
const L10nDecoratorExtension_1 = require("../decorators/l10n/L10nDecoratorExtension");
const TransportDecoratorExtension_1 = require("../decorators/transport/TransportDecoratorExtension");
const TimingDecoratorExtension_1 = require("../decorators/timing/TimingDecoratorExtension");
const BaseMessage_1 = require("./BaseMessage");
const JsonTransformer_1 = require("../utils/JsonTransformer");
const AckDecoratorExtension_1 = require("../decorators/ack/AckDecoratorExtension");
const DefaultDecorators = [ThreadDecoratorExtension_1.ThreadDecorated, L10nDecoratorExtension_1.L10nDecorated, TransportDecoratorExtension_1.TransportDecorated, TimingDecoratorExtension_1.TimingDecorated, AckDecoratorExtension_1.AckDecorated];
class AgentMessage extends mixins_1.Compose(BaseMessage_1.BaseMessage, DefaultDecorators) {
    toJSON() {
        return JsonTransformer_1.JsonTransformer.toJSON(this);
    }
    is(Class) {
        return this.type === Class.type;
    }
}
exports.AgentMessage = AgentMessage;
