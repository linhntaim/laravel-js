"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEnv = exports.env = void 0;
var _dotenvPacked = _interopRequireDefault(require("dotenv-packed"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _dotenvPacked$pack = _dotenvPacked["default"].pack(),
  get = _dotenvPacked$pack.get;
var env = exports.env = get();
var getEnv = exports.getEnv = get;