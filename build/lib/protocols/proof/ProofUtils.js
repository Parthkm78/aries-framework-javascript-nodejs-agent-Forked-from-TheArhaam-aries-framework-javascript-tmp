"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofUtils = void 0;
const js_sha256_1 = require("js-sha256");
const bn_js_1 = __importDefault(require("bn.js"));
class ProofUtils {
    static constructGenerateProofParms(proofCred, ledgerService) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("inside util:");
            let reqCredAtt = {};
            let schemas = {};
            let credDef = {};
            let schemaIds = [];
            let credDefIds = [];
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
                schemas[schemaIds[id]] = yield ledgerService.getCredentialSchema(schemaIds[id]);
            }
            ;
            //construct credentials defination request object
            for (let id in credDefIds) {
                console.log("Cred:" + id);
                credDef[credDefIds[id]] = yield ledgerService.getCredentialDefinition(credDefIds[id]);
            }
            ;
            let reqParmsObj = {};
            let reqCred = {
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
        });
    }
    static encode(value) {
        if (!isNaN(value)) {
            return value.toString();
        }
        return new bn_js_1.default(js_sha256_1.sha256.array(value)).toString();
    }
}
exports.ProofUtils = ProofUtils;
