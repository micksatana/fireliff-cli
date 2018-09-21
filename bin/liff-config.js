"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LIFFConfig = void 0;

var _functionsConfig = require("./functions-config");

class LIFFConfig {
  static setView(name, id) {
    return _functionsConfig.FunctionsConfig.set(`views.${name}`, id);
  }

  static unsetView(name) {
    return _functionsConfig.FunctionsConfig.unset(`views.${name}`);
  }

  static setRichMenu(name, id) {
    return _functionsConfig.FunctionsConfig.set(`richmenus.${name}`, id);
  }

  static unsetRichMenu(id) {
    return _functionsConfig.FunctionsConfig.unset('richmenus', id);
  }

  static getViewNamesById(id, config) {
    const viewNames = [];

    if (config && config.views) {
      for (let viewName in config.views) {
        if (config.views[viewName] === id) {
          viewNames.push(viewName);
        }
      }
    }

    return viewNames;
  }

  static getViewNameById(id, config) {
    let names = this.getViewNamesById(id, config);
    return names.length > 0 ? names[0] : null;
  }

  static getViewIdByName(name, config) {
    if (config && config.views) {
      for (let viewName in config.views) {
        if (viewName === name) {
          return config.views[viewName];
        }
      }
    }

    return null;
  }

}

exports.LIFFConfig = LIFFConfig;
//# sourceMappingURL=liff-config.js.map