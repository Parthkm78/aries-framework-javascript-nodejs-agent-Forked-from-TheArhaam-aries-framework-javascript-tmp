"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialUtils = void 0;
const js_sha256_1 = require("js-sha256");
const bn_js_1 = __importDefault(require("bn.js"));
class CredentialUtils {
    /**
     * Converts int value to string
     * Converts string value:
     * - hash with sha256,
     * - convert to byte array and reverse it
     * - convert it to BigInteger and return as a string
     * @param credentialPreview
     *
     * @returns CredValues
     */
    static convertPreviewToValues(credentialPreview) {
        return credentialPreview.attributes.reduce((credentialValues, attribute) => {
            return Object.assign({ [attribute.name]: {
                    raw: attribute.value,
                    encoded: CredentialUtils.encode(attribute.value),
                } }, credentialValues);
        }, {});
    }
    static encode(value) {
        if (!isNaN(value)) {
            return value.toString();
        }
        return new bn_js_1.default(js_sha256_1.sha256.array(value)).toString();
    }
}
exports.CredentialUtils = CredentialUtils;
