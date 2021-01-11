/// <reference types="indy-sdk" />
import { CredentialPreview } from './messages/CredentialOfferMessage';
export declare class CredentialUtils {
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
    static convertPreviewToValues(credentialPreview: CredentialPreview): CredValues;
    private static encode;
}
