"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StubWallet = void 0;
class StubWallet {
    init() {
        return Promise.resolve();
    }
    close() {
        throw new Error('Method not implemented.');
    }
    delete() {
        throw new Error('Method not implemented.');
    }
    initPublicDid(didConfig) {
        throw new Error('Method not implemented.');
    }
    getPublicDid() {
        throw new Error('Method not implemented.');
    }
    createDid(didConfig) {
        throw new Error('Method not implemented.');
    }
    createCredentialDefinition(issuerDid, schema, tag, signatureType, config) {
        throw new Error('Method not implemented.');
    }
    createCredentialOffer(credDefId) {
        return Promise.resolve({
            schema_id: 'aaa',
            cred_def_id: credDefId,
            // Fields below can depend on Cred Def type
            nonce: 'nonce',
            key_correctness_proof: {},
        });
    }
    getCredentialsForProofReq(proof) {
        return Promise.resolve({
            attrs: {},
            predicates: {},
        });
    }
    proverCreateMasterSecret(masterSecret) {
        return Promise.resolve('');
    }
    proverCreateProof(proofReq, requestedCredentials, schemas, credentialDefs, revStates) {
        return Promise.resolve({
            requested_proof: {},
            proof: {},
            identifiers: [],
        });
    }
    verifierVerifyProof(proofReq, proof, requestedCredentials, schemas, credentialDefs, revocRegDefs, revocRegs) {
        return Promise.resolve(true);
    }
    createCredentialRequest(proverDid, offer, credDef) {
        return Promise.resolve([
            {
                prover_did: proverDid,
                cred_def_id: credDef.id,
                blinded_ms: {},
                blinded_ms_correctness_proof: {},
                nonce: 'nonce',
            },
            { cred_req: 'meta-data' },
        ]);
    }
    createCredential(credOffer, credReq, credValues) {
        return Promise.resolve([
            {
                schema_id: 'schema_id',
                cred_def_id: 'cred_def_id',
                rev_reg_def_id: 'rev_reg_def_id',
                values: {},
                signature: 'signature',
                signature_correctness_proof: 'signature_correctness_proof',
            },
            '1',
            {},
        ]);
    }
    storeCredential(credentialId) {
        return Promise.resolve(credentialId);
    }
    pack(payload, recipientKeys, senderVk) {
        throw new Error('Method not implemented.');
    }
    unpack(messagePackage) {
        throw new Error('Method not implemented.');
    }
    sign(data, verkey) {
        throw new Error('Method not implemented.');
    }
    verify(signerVerkey, data, signature) {
        throw new Error('Method not implemented.');
    }
    addWalletRecord(type, id, value, tags) {
        throw new Error('Method not implemented.');
    }
    updateWalletRecordValue(type, id, value) {
        throw new Error('Method not implemented.');
    }
    updateWalletRecordTags(type, id, tags) {
        throw new Error('Method not implemented.');
    }
    deleteWalletRecord(type, id) {
        throw new Error('Method not implemented.');
    }
    getWalletRecord(type, id, options) {
        throw new Error('Method not implemented.');
    }
    search(type, query, options) {
        throw new Error('Method not implemented.');
    }
    signRequest(myDid, request) {
        throw new Error('Method not implemented.');
    }
}
exports.StubWallet = StubWallet;
