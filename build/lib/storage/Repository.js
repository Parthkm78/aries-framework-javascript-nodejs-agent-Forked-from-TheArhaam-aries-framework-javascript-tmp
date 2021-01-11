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
exports.Repository = void 0;
class Repository {
    constructor(recordType, storageService) {
        this.storageService = storageService;
        this.recordType = recordType;
    }
    save(record) {
        return __awaiter(this, void 0, void 0, function* () {
            this.storageService.save(record);
        });
    }
    update(record) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storageService.update(record);
        });
    }
    delete(record) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storageService.delete(record);
        });
    }
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storageService.find(this.recordType, id, this.recordType.type);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storageService.findAll(this.recordType, this.recordType.type);
        });
    }
    findByQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storageService.findByQuery(this.recordType, this.recordType.type, query);
        });
    }
}
exports.Repository = Repository;
