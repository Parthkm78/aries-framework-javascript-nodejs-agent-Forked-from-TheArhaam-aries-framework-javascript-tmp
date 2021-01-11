"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CredentialUtils_1 = require("../CredentialUtils");
const CredentialOfferMessage_1 = require("../messages/CredentialOfferMessage");
describe('CredentialUtils', () => {
    describe('convertPreviewToValues', () => {
        test('returns object with raw and encoded attributes', () => {
            const credentialPreview = new CredentialOfferMessage_1.CredentialPreview({
                attributes: [
                    new CredentialOfferMessage_1.CredentialPreviewAttribute({
                        name: 'name',
                        mimeType: 'text/plain',
                        value: '101 Wilson Lane',
                    }),
                    new CredentialOfferMessage_1.CredentialPreviewAttribute({
                        name: 'age',
                        mimeType: 'text/plain',
                        value: '1234',
                    }),
                ],
            });
            expect(CredentialUtils_1.CredentialUtils.convertPreviewToValues(credentialPreview)).toEqual({
                name: {
                    raw: '101 Wilson Lane',
                    encoded: '68086943237164982734333428280784300550565381723532936263016368251445461241953',
                },
                age: { raw: '1234', encoded: '1234' },
            });
        });
    });
});
