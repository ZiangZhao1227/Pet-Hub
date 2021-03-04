"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUUID = isUUID;

function isUUID(str) {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(str);
}
//# sourceMappingURL=isUUID.js.map