"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/src/tests/**/*.(test|spec).ts'], // هوني عدل حسب مكان ملفك
    verbose: true,
};
exports.default = config;
