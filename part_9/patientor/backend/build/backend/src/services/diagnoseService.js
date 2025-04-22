"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const diagnosesEntries_1 = __importDefault(require("../../../data/diagnosesEntries"));
const diagnosis = diagnosesEntries_1.default;
const getEntries = () => {
    return diagnosis;
};
exports.default = {
    getEntries,
};
