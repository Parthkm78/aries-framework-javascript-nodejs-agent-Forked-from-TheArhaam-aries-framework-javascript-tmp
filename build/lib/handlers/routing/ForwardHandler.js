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
exports.ForwardHandler = void 0;
const ForwardMessage_1 = require("../../protocols/routing/ForwardMessage");
class ForwardHandler {
    constructor(routingService) {
        this.supportedMessages = [ForwardMessage_1.ForwardMessage];
        this.routingService = routingService;
    }
    handle(messageContext) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.routingService.forward(messageContext);
        });
    }
}
exports.ForwardHandler = ForwardHandler;
