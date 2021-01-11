"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimingDecorator = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
/**
 * Represents `~timing` decorator
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0032-message-timing/README.md
 */
class TimingDecorator {
    constructor(partial) {
        this.inTime = partial === null || partial === void 0 ? void 0 : partial.inTime;
        this.outTime = partial === null || partial === void 0 ? void 0 : partial.outTime;
        this.staleTime = partial === null || partial === void 0 ? void 0 : partial.staleTime;
        this.expiresTime = partial === null || partial === void 0 ? void 0 : partial.expiresTime;
        this.delayMilli = partial === null || partial === void 0 ? void 0 : partial.delayMilli;
        this.waitUntilTime = partial === null || partial === void 0 ? void 0 : partial.waitUntilTime;
    }
}
__decorate([
    class_transformer_1.Expose({ name: 'in_time' }),
    class_transformer_1.Type(() => Date),
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], TimingDecorator.prototype, "inTime", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'out_time' }),
    class_transformer_1.Type(() => Date),
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], TimingDecorator.prototype, "outTime", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'stale_time' }),
    class_transformer_1.Type(() => Date),
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], TimingDecorator.prototype, "staleTime", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'expires_time' }),
    class_transformer_1.Type(() => Date),
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], TimingDecorator.prototype, "expiresTime", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'delay_milli' }),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], TimingDecorator.prototype, "delayMilli", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'wait_until_time' }),
    class_transformer_1.Type(() => Date),
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], TimingDecorator.prototype, "waitUntilTime", void 0);
exports.TimingDecorator = TimingDecorator;
