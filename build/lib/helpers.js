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
exports.Default = exports.encodeInvitationToUrl = exports.decodeInvitationFromUrl = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const ConnectionInvitationMessage_1 = require("./protocols/connections/ConnectionInvitationMessage");
const JsonEncoder_1 = require("./utils/JsonEncoder");
const JsonTransformer_1 = require("./utils/JsonTransformer");
/**
 * Create a `ConnectionInvitationMessage` instance from the `c_i` parameter of an URL
 *
 * @param invitationUrl invitation url containing c_i parameter
 *
 * @throws Error when url can not be decoded to JSON, or decoded message is not a valid `ConnectionInvitationMessage`
 */
function decodeInvitationFromUrl(invitationUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: properly extract c_i param from invitation URL
        const [, encodedInvitation] = invitationUrl.split('c_i=');
        const invitationJson = JsonEncoder_1.JsonEncoder.fromBase64(encodedInvitation);
        const invitation = JsonTransformer_1.JsonTransformer.fromJSON(invitationJson, ConnectionInvitationMessage_1.ConnectionInvitationMessage);
        // TODO: should validation happen here?
        yield class_validator_1.validateOrReject(invitation);
        return invitation;
    });
}
exports.decodeInvitationFromUrl = decodeInvitationFromUrl;
/**
 * Create an invitation url from this instance
 *
 * @param invitation invitation message
 * @param domain domain name to use for invitation url
 */
function encodeInvitationToUrl(invitation, domain = 'https://example.com/ssi') {
    const invitationJson = JsonTransformer_1.JsonTransformer.toJSON(invitation);
    const encodedInvitation = JsonEncoder_1.JsonEncoder.toBase64URL(invitationJson);
    const invitationUrl = `${domain}?c_i=${encodedInvitation}`;
    return invitationUrl;
}
exports.encodeInvitationToUrl = encodeInvitationToUrl;
/**
 * Provide a default value for a parameter when using class-transformer
 *
 * Class transfomer doesn't use the default value of a property when transforming an
 * object using `plainToClass`. This decorator allows to set a default value when no value is
 * present during transformation.
 *
 * @param defaultValue the default value to use when there is no value present during transformation
 * @see https://github.com/typestack/class-transformer/issues/129#issuecomment-425843700
 *
 * @example
 * import { plainToClass } from 'class-transformer'
 *
 * class Test {
 *  // doesn't work
 *  myProp = true;
 *
 *  // does work
 *  ＠Default(true)
 *  myDefaultProp: boolean;
 * }
 *
 * plainToClass(Test, {})
 * // results in
 * {
 *   "myProp": undefined,
 *   "myDefaultProp": true
 * }
 */
function Default(defaultValue) {
    return class_transformer_1.Transform((value) => (value !== null && value !== undefined ? value : defaultValue));
}
exports.Default = Default;
