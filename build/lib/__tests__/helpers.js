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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectOutboundTransporter = exports.SubjectInboundTransporter = exports.toBeConnectedWith = void 0;
// Custom matchers which can be used to extend Jest matchers via extend, e. g. `expect.extend({ toBeConnectedWith })`.
function toBeConnectedWith(received, connection) {
    const pass = received.theirDid === connection.did && received.theirKey === connection.verkey;
    if (pass) {
        return {
            message: () => `expected connection ${received.did}, ${received.verkey} not to be connected to with ${connection.did}, ${connection.verkey}`,
            pass: true,
        };
    }
    else {
        return {
            message: () => `expected connection ${received.did}, ${received.verkey} to be connected to with ${connection.did}, ${connection.verkey}`,
            pass: false,
        };
    }
}
exports.toBeConnectedWith = toBeConnectedWith;
class SubjectInboundTransporter {
    constructor(subject) {
        this.subject = subject;
    }
    start(agent) {
        this.subscribe(agent, this.subject);
    }
    subscribe(agent, subject) {
        subject.subscribe({
            next: (message) => agent.receiveMessage(message),
        });
    }
}
exports.SubjectInboundTransporter = SubjectInboundTransporter;
class SubjectOutboundTransporter {
    constructor(subject) {
        this.subject = subject;
    }
    sendMessage(outboundPackage) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Sending message...');
            const { payload } = outboundPackage;
            console.log(payload);
            this.subject.next(payload);
        });
    }
}
exports.SubjectOutboundTransporter = SubjectOutboundTransporter;
