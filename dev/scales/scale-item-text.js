import ScaleItemBase from "./scale-item-base.js";

export default class ScaleItemText extends ScaleItemBase {
    constructor(question, settings) {
        super(question, settings);
        this.settings = settings.textTypeSettings;
    }

    applySelectedStylesToScale = (scaleNode) => {
        scaleNode.css('color', this.settings.selectedFontColor);
    }

    applyNotSelectedStylesToScale = (scaleNode) => {
        scaleNode.css('color', this.settings.fontColor);
    }

    _createScaleContent(scale) {
        return $('<div></div>')
            .addClass('cf-tinder-grid-scale__text noselect')
            .attr('id', this._getScaleTextId(scale))
            .html(scale.text);
    }

}