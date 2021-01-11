/// <reference types="node" />
export declare class BufferEncoder {
    /**
     * Encode buffer into base64 string.
     *
     * @param buffer the buffer to encode into base64 string
     */
    static toBase64(buffer: Buffer): string;
    /**
     * Encode buffer into base64url string.
     *
     * @param buffer the buffer to encode into base64url string
     */
    static toBase64URL(buffer: Buffer): string;
    /**
     * Decode base64 string into buffer. Also supports base64url
     *
     * @param base64 the base64 or base64url string to decode into buffer format
     */
    static fromBase64(base64: string): Buffer;
}
