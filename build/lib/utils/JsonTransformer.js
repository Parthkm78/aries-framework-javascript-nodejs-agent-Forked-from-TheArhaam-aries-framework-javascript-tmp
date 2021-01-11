"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonTransformer = void 0;
const class_transformer_1 = require("class-transformer");
class JsonTransformer {
    static toJSON(classInstance) {
        return class_transformer_1.classToPlain(classInstance);
    }
    static fromJSON(json, Class) {
        return class_transformer_1.plainToClass(Class, json);
    }
    static serialize(classInstance) {
        return class_transformer_1.serialize(classInstance);
    }
    static deserialize(jsonString, Class) {
        return class_transformer_1.deserialize(Class, jsonString);
    }
}
exports.JsonTransformer = JsonTransformer;
