import ScaleItemBase from "./scale-item-base.js";

export default class ScaleItemImage extends ScaleItemBase {
    constructor(question, settings) {
        super(question, settings);
        this.settings = settings.imageTypeSettings;
    }

    applySelectedStylesToScale = (scaleNode) => {
        let imageElement = scaleNode.find('.scale__image');
        let settingsToApply = imageElement[0].id.indexOf('left') === -1 ?
            this.settings.right : this.settings.left;
        imageElement.css('color', settingsToApply.selectedIconColor);
    }

    applyNotSelectedStylesToScale = (scaleNode) => {
        let imageElement = scaleNode.find('.scale__image');
        let settingsToApply = imageElement[0].id.indexOf('left') === -1 ?
            this.settings.right : this.settings.left;
        imageElement.css('color', settingsToApply.iconColor);
    }

    _createScaleContent(scale, position) {
        let settings = position === 'left' ? this.settings.left : this.settings.right;

        let scaleContent = $('<span></span>')
            .addClass('fa-stack fa-2x');
        let icon = $("<i></i>")
            .addClass(`scale__image fa fa-${settings.image} fa-stack-1x`)
            .attr('id', `${position}-${settings.image}`)
            .css('color', settings.iconColor);
        let circle = $("<i></i>")
            .addClass('fa fa-circle fa-stack-2x')
            .css('color', settings.bgColor);

        scaleContent.prepend(icon);
        scaleContent.prepend(circle);

        return scaleContent;
    }

    _attachImageTypeHoverHandlers = () => {
        const leftScaleElement = this._getLeftScaleNode();
        $(leftScaleElement).on('mouseenter',
            () => this._setColorForScaleImage(leftScaleElement, this.settings.left.selectedIconColor)
        );
        $(leftScaleElement).on('mouseleave',
            () => this._setColorForScaleImage(leftScaleElement, this.settings.left.iconColor),
        );
        const rightScaleElement = this._getRightScaleNode();
        $(rightScaleElement).on('mouseenter',
            () => this._setColorForScaleImage(rightScaleElement, this.settings.right.selectedIconColor)
        );
        $(rightScaleElement).on('mouseleave',
            () => this._setColorForScaleImage(rightScaleElement, this.settings.right.iconColor),
        );
    }

    _setColorForScaleImage(scale, color) {
        scale.find('.scale__image').css('color', color);
    }

}