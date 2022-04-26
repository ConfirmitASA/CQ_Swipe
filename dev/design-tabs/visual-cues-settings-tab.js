export const VisualCuesSettingsTabInputSelectors = {
    enableArrows: '#enableArrows',
    enableChosenScaleOnTop: '#enableChosenScaleOnTop'
}

export default class VisualCuesSettingsTab {
    constructor() {
        this.inputs = this._getSettingsInputs();
    }

    getValues() {
        return {
            enableArrows: this.inputs[VisualCuesSettingsTabInputSelectors.enableArrows].checked,
            enableChosenScaleOnTop: this.inputs[VisualCuesSettingsTabInputSelectors.enableChosenScaleOnTop].checked,
        }
    }

    setValues(settings) {
        if (settings.hasOwnProperty('enableArrows') && settings.enableArrows !== undefined) {
            this.inputs[VisualCuesSettingsTabInputSelectors.enableArrows].checked = settings.enableArrows;
        }
        if (settings.hasOwnProperty('enableChosenScaleOnTop') && settings.enableChosenScaleOnTop !== undefined) {
            this.inputs[VisualCuesSettingsTabInputSelectors.enableChosenScaleOnTop].checked = settings.enableChosenScaleOnTop;
        }
    }

    _getSettingsInputs = () => {
        let inputs = {};
        for (let property in VisualCuesSettingsTabInputSelectors) {
            let selector = VisualCuesSettingsTabInputSelectors[property];
            let inputsArray = document.querySelectorAll(selector);
            inputs[selector] = inputsArray.length === 1 ? inputsArray[0] : inputsArray;
        }
        return inputs;
    }


}