import { FunctionsConfig } from './functions-config';

export class LIFFConfig {
  static ViewsGroup = 'views';
  static RichMenusGroup = 'richmenus';

  static setView(name, id) {
    return FunctionsConfig.set(`${LIFFConfig.ViewsGroup}.${name}`, id);
  }

  static unsetView(name) {
    return FunctionsConfig.unset(`${LIFFConfig.ViewsGroup}.${name}`);
  }

  static async getViewNamesById(id, config) {
    return FunctionsConfig.getNamesById(LIFFConfig.ViewsGroup, id, config);
  }

  static async getViewNameById(id, config) {
    let names = await LIFFConfig.getViewNamesById(id, config);
    return names.length > 0 ? names[0] : null;
  }

  static getViewIdByName(name, config) {
    return FunctionsConfig.getIdByName(LIFFConfig.ViewsGroup, name, config);
  }

  static setRichMenu(name, id) {
    return FunctionsConfig.set(`${LIFFConfig.RichMenusGroup}.${name}`, id);
  }

  static unsetRichMenu(name) {
    return FunctionsConfig.unset(`${LIFFConfig.RichMenusGroup}.${name}`);
  }

  static async getRichMenuNamesById(id, config) {
    return FunctionsConfig.getNamesById(LIFFConfig.RichMenusGroup, id, config);
  }

  static async getRichMenuNameById(id, config) {
    let names = await LIFFConfig.getRichMenuNamesById(id, config);
    return names.length > 0 ? names[0] : null;
  }

  static getRichMenuIdByName(name, config) {
    return FunctionsConfig.getIdByName(LIFFConfig.RichMenusGroup, name, config);
  }
}
