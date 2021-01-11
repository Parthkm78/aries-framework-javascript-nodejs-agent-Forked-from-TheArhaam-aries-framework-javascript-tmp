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
exports.RequestPresentationHandler = void 0;
const RequestPresentationMessage_1 = require("../../protocols/proof/messages/RequestPresentationMessage");
/**
 * The funtionalities of this class is used to handle proof request
 */
class RequestPresentationHandler {
    constructor(proofService) {
        this.supportedMessages = [RequestPresentationMessage_1.RequestPresentationMessage];
        this.proofService = proofService;
    }
    /**
     * This Method is used to process incoming proof request
     * @param messageContext T
     */
    handle(messageContext) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.proofService.processRequest(messageContext);
        });
    }
}
exports.RequestPresentationHandler = RequestPresentationHandler;
