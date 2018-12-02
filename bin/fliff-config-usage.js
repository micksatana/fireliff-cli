"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./colors-set-theme");

var _default = [{
  header: 'Configure LINE channel access token'.help,
  content: 'There are two approaches to set LINE channel access token'
}, {
  header: 'Options',
  optionList: [{
    name: 'token'.code,
    typeLabel: '{underline accessToken}'.input,
    description: 'Channel access token'
  }, {
    name: 'id'.code,
    typeLabel: '{underline channelId}'.input,
    description: 'Channel ID'
  }, {
    name: 'secret'.code,
    typeLabel: '{underline channelSecret}'.input,
    description: 'Channel secret'
  }]
}, {
  header: 'A) Use long-lived access token',
  content: `fliff config --token ${'<accessToken>'.input}`.code
}, {
  header: 'B) Use long-lived access token',
  content: `fliff config --id ${'<channelId>'.input} --secret ${'<channelSecret>'.input}`.code
}];
exports.default = _default;
//# sourceMappingURL=fliff-config-usage.js.map