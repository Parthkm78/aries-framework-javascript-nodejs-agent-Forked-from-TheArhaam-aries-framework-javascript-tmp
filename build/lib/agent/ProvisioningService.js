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
exports.ProvisioningService = void 0;
const ProvisioningRecord_1 = require("../storage/ProvisioningRecord");
const logger_1 = __importDefault(require("../logger"));
const indyError_1 = require("../utils/indyError");
const UNIQUE_PROVISIONING_ID = 'UNIQUE_PROVISIONING_ID';
class ProvisioningService {
    constructor(provisioningRepository) {
        this.provisioningRepository = provisioningRepository;
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provisioningRecord = yield this.provisioningRepository.find(UNIQUE_PROVISIONING_ID);
                return provisioningRecord;
            }
            catch (error) {
                if (indyError_1.isIndyError(error, 'WalletItemNotFound')) {
                    logger_1.default.log('WalletItemNotFound');
                    return null;
                }
                else {
                    throw error;
                }
            }
        });
    }
    create({ mediatorConnectionId, mediatorPublicVerkey }) {
        return __awaiter(this, void 0, void 0, function* () {
            const provisioningRecord = new ProvisioningRecord_1.ProvisioningRecord({
                id: UNIQUE_PROVISIONING_ID,
                mediatorConnectionId,
                mediatorPublicVerkey,
            });
            yield this.provisioningRepository.save(provisioningRecord);
            return provisioningRecord;
        });
    }
}
exports.ProvisioningService = ProvisioningService;
