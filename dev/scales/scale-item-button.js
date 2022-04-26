import ScaleItemBase from "./scale-item-base.js";

export default class ScaleItemButton extends ScaleItemBase {
    constructor(question, settings) {
        super(question, settings);
        this.settings = settings.buttonTypeSettings;
    }

    applySelectedStylesToScale = (scaleNode) => {
        scaleNode.css({ color: this.settings.selectedFontColor });
        scaleNode.css({ backgroundColor: this.settings.hoverBgColor });
    }

    applyNotSelectedStylesToScale = (scaleNode) => {
        scaleNode.css({ color: this.settings.fontColor });
        scaleNode.css({ backgroundColor: this.settings.bgColor });
    }

    _createScaleContent(scale) {
        return $('<div></div>')
            .addClass('cf-tinder-grid-scale__text noselect')
            .attr('id', this._getScaleTextId(scale))
            .html(scale.text);
    }

}