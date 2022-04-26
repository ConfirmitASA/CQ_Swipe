import ScaleItemText from "./scale-item-text.js";
import ScaleItemButton from "./scale-item-button.js";
import ScaleItemImage from "./scale-item-image.js";

export const SCALES_POSITION = Object.freeze({
    "below": "1",
    "above": "2",
    "sides": "3"
});

export const SCALES_TYPE = Object.freeze({
    "text": "text",
    "button": "button",
    "image": "image"
});

export default class ScalesComponent {
    constructor(question, scalesSettings) {
        this.question = question;
        this.usedScales = this.question.scales.slice(0, 2);

        this.scalesPosition = scalesSettings.position;
        this.settings = scalesSettings;
        this.type = scalesSettings.type;
        switch (this.type) {
            case SCALES_TYPE.text:
                this.scaleCreator = new ScaleItemText(this.question, this.settings);
                break;
            case SCALES_TYPE.button:
                this.scaleCreator = new ScaleItemButton(this.question, this.settings);
                break;
            case SCALES_TYPE.image:
                this.scaleCreator = new ScaleItemImage(this.question, this.settings);
                break;
        }
    }

    render() {
        let scaleNodes = this.scaleCreator.createScales();
        const container = $('#' + this.question.id + ' .grid-container');
        switch (this.scalesPosition) {
            case SCALES_POSITION.sides:
                container.addClass('tinder-grid--scales-sides');
                break;
            case SCALES_POSITION.above:
                container.addClass('tinder-grid--scales-above');
                break;
            case SCALES_POSITION.below:
            default:
                container.addClass('tinder-grid--scales-below');
        }
        container.append(scaleNodes.left);
        container.append(scaleNodes.right);

        this.scaleCreator.attachHoverHandlers();
        this.scaleCreator.applyNotSelectedStyles();
    }

    applySelectedStylesToScale(scaleNode) {
        this.scaleCreator.applySelectedStylesToScale(scaleNode);
    }

    applyNotSelectedStylesToScale(scaleNode) {
        this.scaleCreator.applyNotSelectedStylesToScale(scaleNode);
    }
}