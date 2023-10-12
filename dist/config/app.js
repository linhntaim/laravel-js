"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = void 0;
var _env = require("./env");
var app = exports.app = {
  debug: (0, _env.getEnv)('DEBUG', false)
};