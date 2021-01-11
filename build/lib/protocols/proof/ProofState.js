"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofState = void 0;
var ProofState;
(function (ProofState) {
    ProofState["RequestSent"] = "REQUEST_SENT";
    ProofState["RequestReceived"] = "REQUEST_RECEIVED";
    ProofState["ProposalSent"] = "PROPOSAL_SENT";
    ProofState["ProposalReceived"] = "PROPOSAL_RECEIVED";
    ProofState["PresentationSent"] = "PRESENTATION_SENT";
    ProofState["PresentationReceived"] = "PRESENTATION_RECEIVED";
    ProofState["RejectSent"] = "REJECT_SENT";
    ProofState["Done"] = "DONE";
})(ProofState = exports.ProofState || (exports.ProofState = {}));
