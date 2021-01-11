"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = exports.PublicKey = exports.DidDoc = exports.Authentication = exports.PublicKeyType = void 0;
var PublicKeyType;
(function (PublicKeyType) {
    PublicKeyType["RSA_SIG_2018"] = "RsaVerificationKey2018|RsaSignatureAuthentication2018|publicKeyPem";
    PublicKeyType["ED25519_SIG_2018"] = "Ed25519VerificationKey2018|Ed25519SignatureAuthentication2018|publicKeyBase58";
    PublicKeyType["EDDSA_SA_SIG_SECP256K1"] = "Secp256k1VerificationKey2018|Secp256k1SignatureAuthenticationKey2018|publicKeyHex";
})(PublicKeyType = exports.PublicKeyType || (exports.PublicKeyType = {}));
class Authentication {
    constructor(publicKey, embed = false) {
        this.publicKey = publicKey;
        this.embed = embed;
    }
    toJSON() {
        // verType|authType|specifier
        const [, auth_type] = this.publicKey.type.split('|');
        return this.embed
            ? this.publicKey.toJSON()
            : {
                type: auth_type,
                publicKey: this.publicKey.id,
            };
    }
}
exports.Authentication = Authentication;
class DidDoc {
    constructor(id, authentication, publicKey, service) {
        this['@context'] = 'https://w3id.org/did/v1';
        this.id = id;
        this.publicKey = publicKey;
        this.service = service;
        this.authentication = authentication;
    }
    toJSON() {
        const publicKey = this.publicKey.map(pk => pk.toJSON());
        const authentication = this.authentication.map(auth => auth.toJSON());
        const service = this.service.map(s => s.toJSON());
        return {
            '@context': this['@context'],
            id: this.id,
            publicKey,
            authentication,
            service,
        };
    }
    serialize() {
        return JSON.stringify(this.toJSON());
    }
    static deserialize(doc) {
        const json = JSON.parse(doc);
        const publicKey = json.publicKey.map(pk => {
            return PublicKey.fromJSON(pk);
        });
        const { authentication } = json;
        const auths = [];
        for (const auth of authentication) {
            if ('publicKey' in auth) {
                // reference type
                let found = false;
                for (let i = 0; i < publicKey.length; i++) {
                    if (auth.publicKey === publicKey[i].id) {
                        auths.push(new Authentication(publicKey[i]));
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    throw new Error(`Invalid public key referenced ${auth.publicKey}`);
                }
            }
            else {
                // embedded
                const pk = PublicKey.fromJSON(auth);
                auths.push(new Authentication(pk, true));
            }
        }
        const service = json.service.map(s => Service.fromJSON(s));
        const didDoc = new DidDoc(json.id, auths, publicKey, service);
        return didDoc;
    }
}
exports.DidDoc = DidDoc;
class PublicKey {
    constructor(id, type, controller, value) {
        this.id = id;
        this.type = type;
        this.controller = controller;
        this.value = value;
    }
    serialize() {
        return JSON.stringify(this.toJSON());
    }
    toJSON() {
        const [ver_type, , specifier] = this.type.split('|');
        return {
            id: this.id,
            type: ver_type,
            controller: this.controller,
            [specifier]: this.value,
        };
    }
    static deserialize(pk) {
        const json = JSON.parse(pk);
        return PublicKey.fromJSON(json);
    }
    static fromJSON(pk) {
        const _type = Object.keys(PublicKeyType)
            // eslint-disable-next-line
            // @ts-ignore
            .map(t => [PublicKeyType[t].split('|')[0], t])
            .filter(verkeyType => verkeyType[0] == pk.type)[0][1];
        const specifier = _type.split('|')[2];
        // eslint-disable-next-line
        // @ts-ignore
        return new PublicKey(pk.id, PublicKeyType[_type], pk.controller, pk[`${specifier}`]);
    }
}
exports.PublicKey = PublicKey;
class Service {
    constructor(id, serviceEndpoint, recipientKeys = [], routingKeys = [], priority = 0, type) {
        this.priority = 0;
        this.id = id;
        this.serviceEndpoint = serviceEndpoint;
        this.recipientKeys = recipientKeys;
        this.routingKeys = routingKeys;
        this.priority = priority;
        this.type = type;
    }
    static deserialize(serviceDoc) {
        return Service.fromJSON(JSON.parse(serviceDoc));
    }
    static fromJSON(serviceDoc) {
        const { id, serviceEndpoint, type, priority, recipientKeys, routingKeys } = serviceDoc;
        return new Service(id, serviceEndpoint, recipientKeys, routingKeys, priority || 0, type);
    }
    toJSON() {
        const res = {
            id: this.id,
            type: this.type,
            priority: this.priority,
            serviceEndpoint: this.serviceEndpoint,
        };
        if (this.recipientKeys) {
            res['recipientKeys'] = this.recipientKeys;
        }
        if (this.routingKeys) {
            res['routingKeys'] = this.routingKeys;
        }
        return res;
    }
}
exports.Service = Service;
