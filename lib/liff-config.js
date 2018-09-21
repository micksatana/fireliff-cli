import { FunctionsConfig } from './functions-config';

export class LIFFConfig {
    static setView(name, id) {
        return FunctionsConfig.set(`views.${name}`, id);
    }
    
    static unsetView(name) {
        return FunctionsConfig.unset(`views.${name}`);
    }
    
    static setRichMenu(name, id) {
        return FunctionsConfig.set(`richmenus.${name}`, id);
    }
    
    static unsetRichMenu(id) {
        return FunctionsConfig.unset('richmenus', id);
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
        return (names.length > 0) ? names[0] : null;
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
