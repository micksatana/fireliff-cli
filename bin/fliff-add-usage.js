"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _os = require("os");

require("./colors-set-theme");

var _default = [{
  header: 'Add LIFF view'.help,
  content: `Add LIFF using view ${'--name'.code} and ${'--url'.code} options. We make ${'--type'.code} option as optional in FireLIFF CLI to shorten the command line. So you can omit ${'--type'.code}, it will be ${'full'.code} by default.` + _os.EOL + _os.EOL + `fliff add --name ${'<viewName>'.input} --url ${'<viewUrl>'.input}`.code + _os.EOL + `fliff add --name ${'<viewName>'.input} --url ${'<viewUrl>'.input} --type ${'<viewType>'.input}`.code
}, {
  header: 'Options',
  optionList: [{
    name: 'name'.code,
    typeLabel: '{underline viewName}'.input,
    description: 'View name will be convert to lowercase and save to Functions. Original name will be save as description (Name) in LINE Developer Console.'
  }, {
    name: 'url'.code,
    typeLabel: '{underline viewUrl}'.input,
    description: 'URL to navigate to after User visit the LIFF app'
  }, {
    name: 'type'.code,
    typeLabel: '{underline viewType}'.input,
    description: 'View type can be full, tall or compact.'
  }]
}];
exports.default = _default;
//# sourceMappingURL=fliff-add-usage.js.map