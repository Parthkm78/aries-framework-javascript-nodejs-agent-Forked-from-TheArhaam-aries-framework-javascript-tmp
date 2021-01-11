"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryMessageRepository = void 0;
class InMemoryMessageRepository {
    constructor() {
        this.messages = {};
    }
    findByVerkey(theirKey) {
        var _a;
        return (_a = this.messages[theirKey]) !== null && _a !== void 0 ? _a : [];
    }
    deleteAllByVerkey(theirKey) {
        this.messages[theirKey] = [];
    }
    save(theirKey, payload) {
        if (!this.messages[theirKey]) {
            this.messages[theirKey] = [];
        }
        this.messages[theirKey].push(payload);
    }
}
exports.InMemoryMessageRepository = InMemoryMessageRepository;
