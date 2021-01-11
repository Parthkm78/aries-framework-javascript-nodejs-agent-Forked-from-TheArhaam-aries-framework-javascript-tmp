export declare class ProofRequestMessage {
    constructor(proofRequest: ProofRequestInterface);
    name: string;
    version: string;
    nonce: string;
    requestedAttributes: RequestedAttributes;
    requestedPredicates: RequestedPredicates;
}
interface ProofRequestInterface {
    name: string;
    version: string;
    nonce: string;
    requestedAttributes: RequestedAttributes;
    requestedPredicates: RequestedPredicates;
}
export declare class RequestedAttributes {
    name: string;
    restrictions: AttributeFilter[];
}
export declare class AttributeFilter {
    schemaId: string | undefined;
    schemaName: string | undefined;
}
export declare class RequestedPredicates {
}
export {};
