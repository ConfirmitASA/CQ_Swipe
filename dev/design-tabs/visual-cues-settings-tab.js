import SettingsTab from "./settings-tab.js";

export const VisualCuesSettingsTabInputSelectors = {
    enableArrows: '#enableArrows',
    enableChosenScaleOnTop: '#enableChosenScaleOnTop',
    enableSelectedScaleOnNextCard: '#enableSelectedScaleOnNextCard'
}

export default class VisualCuesSettingsTab extends SettingsTab {
    constructor() {
        super(VisualCuesSettingsTabInputSelectors);
        this.inputs = this._getSettingsInputs();
    }

    getValues() {
        return {
            enableArrows: this.inputs[VisualCuesSettingsTabInputSelectors.enableArrows].checked,
            enableChosenScaleOnTop: this.inputs[VisualCuesSettingsTabInputSelectors.enableChosenScaleOnTop].checked,
            enableSelectedScaleOnNextCard: this.inputs[VisualCuesSettingsTabInputSelectors.enableSelectedScaleOnNextCard].checked,
        }
    }

    setValues(settings) {
        if (settings.hasOwnProperty('enableArrows') && settings.enableArrows !== undefined) {
            this.inputs[VisualCuesSettingsTabInputSelectors.enableArrows].checked = settings.enableArrows;
        }
        if (settings.hasOwnProperty('enableChosenScaleOnTop') && settings.enableChosenScaleOnTop !== undefined) {
            this.inputs[VisualCuesSettingsTabInputSelectors.enableChosenScaleOnTop].checked = settings.enableChosenScaleOnTop;
        }
        if (settings.hasOwnProperty('enableSelectedScaleOnNextCard') && settings.enableSelectedScaleOnNextCard !== undefined) {
            this.inputs[VisualCuesSettingsTabInputSelectors.enableSelectedScaleOnNextCard].checked = settings.enableSelectedScaleOnNextCard;
        }
    }
}