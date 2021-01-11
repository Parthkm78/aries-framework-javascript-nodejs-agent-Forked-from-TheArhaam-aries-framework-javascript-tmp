"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const ConnectionInvitationMessage_1 = require("../ConnectionInvitationMessage");
const JsonTransformer_1 = require("../../../utils/JsonTransformer");
describe('ConnectionInvitationMessage', () => {
    it('should allow routingKeys to be left out of inline invitation', () => __awaiter(void 0, void 0, void 0, function* () {
        const json = {
            '@type': ConnectionInvitationMessage_1.ConnectionInvitationMessage.type,
            '@id': '04a2c382-999e-4de9-a1d2-9dec0b2fa5e4',
            recipientKeys: ['recipientKeyOne', 'recipientKeyTwo'],
            serviceEndpoint: 'https://example.com',
            label: 'test',
        };
        const invitation = JsonTransformer_1.JsonTransformer.fromJSON(json, ConnectionInvitationMessage_1.ConnectionInvitationMessage);
        yield expect(class_validator_1.validateOrReject(invitation)).resolves.toBeUndefined();
    }));
    it('should throw error if both did and inline keys / endpoint are missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const json = {
            '@type': ConnectionInvitationMessage_1.ConnectionInvitationMessage.type,
            '@id': '04a2c382-999e-4de9-a1d2-9dec0b2fa5e4',
            label: 'test',
        };
        const invitation = JsonTransformer_1.JsonTransformer.fromJSON(json, ConnectionInvitationMessage_1.ConnectionInvitationMessage);
        yield expect(class_validator_1.validateOrReject(invitation)).rejects.not.toBeNull();
    }));
});
