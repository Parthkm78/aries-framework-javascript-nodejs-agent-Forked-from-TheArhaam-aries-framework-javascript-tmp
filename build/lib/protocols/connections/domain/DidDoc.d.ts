export declare enum PublicKeyType {
    RSA_SIG_2018 = "RsaVerificationKey2018|RsaSignatureAuthentication2018|publicKeyPem",
    ED25519_SIG_2018 = "Ed25519VerificationKey2018|Ed25519SignatureAuthentication2018|publicKeyBase58",
    EDDSA_SA_SIG_SECP256K1 = "Secp256k1VerificationKey2018|Secp256k1SignatureAuthenticationKey2018|publicKeyHex"
}
export declare class Authentication {
    publicKey: PublicKey;
    embed: boolean;
    constructor(publicKey: PublicKey, embed?: boolean);
    toJSON(): {
        [x: string]: string;
        id: string;
        type: string;
        controller: string;
    } | {
        type: string;
        publicKey: string;
    };
}
export declare class DidDoc {
    '@context': string;
    id: string;
    publicKey: PublicKey[];
    service: Service[];
    authentication: Authentication[];
    constructor(id: string, authentication: Authentication[], publicKey: PublicKey[], service: Service[]);
    toJSON(): {
        '@context': string;
        id: string;
        publicKey: {
            [x: string]: string;
            id: string;
            type: string;
            controller: string;
        }[];
        authentication: ({
            [x: string]: string;
            id: string;
            type: string;
            controller: string;
        } | {
            type: string;
            publicKey: string;
        })[];
        service: Record<string, unknown>[];
    };
    serialize(): string;
    static deserialize(doc: string): DidDoc;
}
export declare class PublicKey {
    id: string;
    type: PublicKeyType;
    controller: string;
    value: string;
    constructor(id: string, type: PublicKeyType, controller: string, value: string);
    serialize(): string;
    toJSON(): {
        [x: string]: string;
        id: string;
        type: string;
        controller: string;
    };
    static deserialize(pk: string): PublicKey;
    static fromJSON(pk: {
        [key: string]: string;
    }): PublicKey;
}
export declare class Service {
    id: string;
    serviceEndpoint: string;
    recipientKeys: string[];
    routingKeys: string[];
    type: string;
    priority: number;
    constructor(id: string, serviceEndpoint: string, recipientKeys: string[] | undefined, routingKeys: string[] | undefined, priority: number | undefined, type: string);
    static deserialize(serviceDoc: string): Service;
    static fromJSON(serviceDoc: {
        [key: string]: any;
    }): Service;
    toJSON(): Record<string, unknown>;
}
