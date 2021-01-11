"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferEncoder = void 0;
const base64_1 = require("./base64");
const buffer_1 = require("./buffer");
class BufferEncoder {
    /**
     * Encode buffer into base64 string.
     *
     * @param buffer the buffer to encode into base64 string
     */
    static toBase64(buffer) {
        return buffer.toString('base64');
    }
    /**
     * Encode buffer into base64url string.
     *
     * @param buffer the buffer to encode into base64url string
     */
    static toBase64URL(buffer) {
        return base64_1.base64ToBase64URL(BufferEncoder.toBase64(buffer));
    }
    /**
     * Decode base64 string into buffer. Also supports base64url
     *
     * @param base64 the base64 or base64url string to decode into buffer format
     */
    static fromBase64(base64) {
        return buffer_1.Buffer.from(base64, 'base64');
    }
}
exports.BufferEncoder = BufferEncoder;
