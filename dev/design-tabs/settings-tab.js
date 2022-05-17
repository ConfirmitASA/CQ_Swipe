export default class SettingsTab {
    constructor(inputSelectors) {
        this._inputSelectors = inputSelectors;
    }
    getValues() { throw new Error('Method not implemented.'); }

    setValues(settings) { throw new Error('Method not implemented.'); }

    _getSettingsInputs = () => {
        let inputs = {};
        for (let property in this._inputSelectors) {
            let selector = this._inputSelectors[property];
            let inputsArray = document.querySelectorAll(selector);
            inputs[selector] = selector.indexOf('#') !== -1 ? inputsArray[0] : inputsArray;
        }
        return inputs;
    }
}