import { sha256 } from 'js-sha256';
import BigNumber from 'bn.js';
import { LedgerService } from '../../agent/LedgerService';

export class ProofUtils {

    public static async constructGenerateProofParms(proofCred: any, ledgerService: LedgerService): Promise<any> {
        console.log("inside util:")
        let reqCredAtt: any = {};
        let schemas: any = {};
        let credDef: any = {};
        let schemaIds: any = [];
        let credDefIds: any = [];

        Object.keys(proofCred).forEach(function (key) {
            console.log('Key : ' + key);
            let dataKey = key;
            let item = proofCred[key];
            if (item) {
                Object.keys(item).forEach(function (itemKey) {
                    console.log("sub:" + JSON.stringify(itemKey));
                    if (item[itemKey].cred_info) {
                        // Construct reqestedCredentials Object & credentialsDefIds array
                        let credDefId = item[itemKey].cred_info.cred_def_id;
                        if (credDefId) {
                           // reqCredAtt[item[itemKey].cred_info.referent] = { cred_id: credDefId, revealed: true };
                            reqCredAtt[dataKey] = { cred_id: item[itemKey].cred_info.referent, revealed: true };
                            credDefIds.push(credDefId);
                        }
                        //Construct schema array
                        let schemaId = item[itemKey].cred_info.schema_id;
                        if (schemaId) {
                            schemaIds.push(schemaId);
                        }
                    }
                });
            }
        });

        //construct schemas request object
        for (let id in schemaIds) {

            console.log("schema:" + id);
            schemas[schemaIds[id]] = await ledgerService.getCredentialSchema(schemaIds[id]);
        };

        //construct credentials defination request object
        for (let id in credDefIds) {

            console.log("Cred:" + id);
            credDef[credDefIds[id]] = await ledgerService.getCredentialDefinition(credDefIds[id]);
        };


        let reqParmsObj: any = {};

        let reqCred: any = {
            self_attested_attributes: {},
            requested_attributes: reqCredAtt,
            requested_predicates: {},
        };

        reqParmsObj['reqCred'] = reqCred;
        reqParmsObj['schemas'] = schemas;
        reqParmsObj['credDefs'] = credDef;
        console.log("Cred Def : " + credDef);
        console.log("OBJ-:" + JSON.stringify(reqParmsObj.reqCred));
        return reqParmsObj;
    }

    private static encode(value: any) {
        if (!isNaN(value)) {
            return value.toString();
        }

        return new BigNumber(sha256.array(value)).toString();
    }
}
