"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  env: true
};
Object.defineProperty(exports, "env", {
  enumerable: true,
  get: function get() {
    return _env.env;
  }
});
var _env = require("./env");
var _app = require("./app");
Object.keys(_app).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _app[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _app[key];
    }
  });
});