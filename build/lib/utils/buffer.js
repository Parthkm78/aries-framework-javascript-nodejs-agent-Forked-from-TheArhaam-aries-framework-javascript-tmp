"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buffer = void 0;
// Import and re-export buffer. In NodeJS native buffer
// library will be used. In RN buffer npm package will be used
const buffer_1 = require("buffer");
Object.defineProperty(exports, "Buffer", { enumerable: true, get: function () { return buffer_1.Buffer; } });
