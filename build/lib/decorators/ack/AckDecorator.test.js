"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsonTransformer_1 = require("../../utils/JsonTransformer");
const mixins_1 = require("../../utils/mixins");
const BaseMessage_1 = require("../../agent/BaseMessage");
const AckDecoratorExtension_1 = require("./AckDecoratorExtension");
describe('Decorators | AckDecoratorExtension', () => {
    class TestMessage extends mixins_1.Compose(BaseMessage_1.BaseMessage, [AckDecoratorExtension_1.AckDecorated]) {
        toJSON() {
            return JsonTransformer_1.JsonTransformer.toJSON(this);
        }
    }
    test('transforms AckDecorator class to JSON', () => {
        const message = new TestMessage();
        message.setPleaseAck();
        expect(message.toJSON()).toEqual({ '~please_ack': {} });
    });
    test('transforms Json to AckDecorator class', () => {
        const transformed = JsonTransformer_1.JsonTransformer.fromJSON({ '~please_ack': {} }, TestMessage);
        expect(transformed).toEqual({ pleaseAck: {} });
        expect(transformed).toBeInstanceOf(TestMessage);
    });
});
