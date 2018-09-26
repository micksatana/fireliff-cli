"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LIFFConfig = void 0;

var _functionsConfig = require("./functions-config");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LIFFConfig {
  static setView(name, id) {
    return _functionsConfig.FunctionsConfig.set(`${LIFFConfig.ViewsGroup}.${name}`, id);
  }

  static unsetView(name) {
    return _functionsConfig.FunctionsConfig.unset(`${LIFFConfig.ViewsGroup}.${name}`);
  }

  static async getViewNamesById(id, config) {
    return _functionsConfig.FunctionsConfig.getNamesById(LIFFConfig.ViewsGroup, id, config);
  }

  static async getViewNameById(id, config) {
    let names = await LIFFConfig.getViewNamesById(id, config);
    return names.length > 0 ? names[0] : null;
  }

  static getViewIdByName(name, config) {
    return _functionsConfig.FunctionsConfig.getIdByName(LIFFConfig.ViewsGroup, name, config);
  }

  static setRichMenu(name, id) {
    return _functionsConfig.FunctionsConfig.set(`${LIFFConfig.RichMenusGroup}.${name}`, id);
  }

  static unsetRichMenu(name) {
    return _functionsConfig.FunctionsConfig.unset(`${LIFFConfig.RichMenusGroup}.${name}`);
  }

  static async getRichMenuNamesById(id, config) {
    return _functionsConfig.FunctionsConfig.getNamesById(LIFFConfig.RichMenusGroup, id, config);
  }

  static async getRichMenuNameById(id, config) {
    let names = await LIFFConfig.getRichMenuNamesById(id, config);
    return names.length > 0 ? names[0] : null;
  }

  static getRichMenuIdByName(name, config) {
    return _functionsConfig.FunctionsConfig.getIdByName(LIFFConfig.RichMenusGroup, name, config);
  }

}

exports.LIFFConfig = LIFFConfig;

_defineProperty(LIFFConfig, "ViewsGroup", 'views');

_defineProperty(LIFFConfig, "RichMenusGroup", 'richmenus');
//# sourceMappingURL=liff-config.js.map