export declare const credDef: {
    ver: string;
    id: string;
    schemaId: string;
    type: string;
    tag: string;
    value: {
        primary: {
            n: string;
            s: string;
            r: ObjectConstructor[];
            rctxt: string;
            z: string;
        };
    };
};
export declare const credOffer: {
    schema_id: string;
    cred_def_id: string;
    key_correctness_proof: {
        c: string;
        xz_cap: string;
        xr_cap: never[][];
    };
    nonce: string;
};
export declare const credReq: {
    prover_did: string;
    cred_def_id: string;
    blinded_ms: {
        u: string;
        ur: null;
        hidden_attributes: string[];
        committed_attributes: {};
    };
    blinded_ms_correctness_proof: {
        c: string;
        v_dash_cap: string;
        m_caps: {
            master_secret: string;
        };
        r_caps: {};
    };
    nonce: string;
};
