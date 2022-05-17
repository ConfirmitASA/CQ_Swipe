const DEFAULT_SETTINGS = {
    "cards": {
        "height": 320,
        "width": 240,
        "bgColor": "#000000",
        "fontColor": "#eeeeee",
        "useImages": false,
        "urls": []
    },
    "scales": {
        "position": "1",
        "containerWidth": 240,
        "type": "text",
        "textTypeSettings": {
            "fontColor": "#000000",
            "selectedFontColor": "#42bdd1"
        },
        "buttonTypeSettings": {
            "fontColor": "#a8a8a8",
            "selectedFontColor": "#ffffff",
            "bgColor": "#eeeeee",
            "hoverBgColor": "#42bdd1"
        },
        "imageTypeSettings": {
            "left": {
                "image": "remove",
                "iconColor": "#ffffff",
                "selectedIconColor": "#ffffff",
                "bgColor": "#dddddd"
            },
            "right": {
                "image": "heart",
                "iconColor": "#ffffff",
                "selectedIconColor": "#ffffff",
                "bgColor": "#dddddd"
            }
        }
    },
    "visualCues": {
        "enableArrows": false,
        "enableChosenScaleOnTop": false,
        "enableSelectedScaleOnNextCard": false
    }
}

export class DefaultSettingsManager {
    /**
     * @param settings - initial custom settings object
     * @returns {object} - settings object with every needed property set.
     */
    static getValidSettings(settings) {
        if(settings === null) {
            return DEFAULT_SETTINGS;
        }
        this._setDefaultSettingsIfNeeded(settings, DEFAULT_SETTINGS);
        return settings;
    }

    /**
     * Recursively checks every property of settings object and replaces its value with the default one if needed.
     * @param settings - slider settings
     * @param defaultSettings - default settings
     */
    static _setDefaultSettingsIfNeeded(settings, defaultSettings) {
        for (const property in defaultSettings) {
            if (typeof(defaultSettings[property]) === 'object') {
                this._setDefaultSettingsIfNeeded(settings[property], defaultSettings[property]);
            } else if(!settings.hasOwnProperty(property) ||
                settings[property] === null ||
                settings[property] === undefined ||
                Number.isNaN(settings[property]))
            {
                settings[property] = defaultSettings[property];
            }
        }
    }
}