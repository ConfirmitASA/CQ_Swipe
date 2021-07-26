import {ICONS, SVG_CONTAINER} from './Constants';

export const SCALES_POSITION = Object.freeze({
    "below": "1",
    "above": "2"
});

export const SCALES_TYPE = Object.freeze({
    "text": "text",
    "button": "button",
    "image": "image"
});

export default class Scale {
    constructor(question, settings) {
        this.currentLanguage = String(Confirmit.page.surveyInfo.language);

        this.question = question;
        this.usedScales = this.question.scales.slice(0, 2);

        this.scalesPosition = settings.position;
        this.containerMaxWidth = settings.containerWidth;
        this.type = settings.type;
        this.textTypeSettings = settings.textTypeSettings;
        this.buttonTypeSettings = settings.buttonTypeSettings;
    }

    _getScaleId = (scale) => `${this.question.id}_scale_${scale.code}`;
    _getScaleTextId = (scale) => `${this.question.id}_scale_${scale.code}_text`;
    _getScaleNode(scaleCode){
        if(!scaleCode) {
            console.log("Could not get Scale Node - scale code is undefined.");
            return;
        }
        var scaleNode = $(`#${this.question.id}_scale_${scaleCode}`);
        if(!scaleNode) {
            console.log(`Could not get Scale Node with code ${scaleCode}`);
            return;
        }

        return scaleNode;
    }


    render() {
        const container = document.querySelector('#' + this.question.id + ' .cf-tinder-grid');

        const scaleList = document.createElement("div");
        scaleList.className = "cf-tinder-grid__scales";
        scaleList.style.maxWidth = this.containerMaxWidth + 'px';
        this.usedScales.forEach(scale => {
            scaleList.insertAdjacentElement("beforeend", this._createScaleElement(scale));
        });
        var insertPosition = "";
        switch (this.scalesPosition) {
            case SCALES_POSITION.above:
                insertPosition = "afterbegin";
                scaleList.className += " cf-tinder-grid__scales--above";
                break;
            case SCALES_POSITION.below:
            default:
                insertPosition = "beforeend";
                scaleList.className += " cf-tinder-grid__scales--below";
        }
        container.insertAdjacentElement(insertPosition, scaleList);
        this._attachHandlersAccordingToType();
    }

    _createScaleElement = (scale) => {
        let selected = "";
        const values = Object.entries(this.question.values);

        if(values[0] !== undefined && values[0][1] === scale.code){
            selected = "cf-tinder-grid-scale--selected";
        }

        let scaleContainer = document.createElement("div");
        scaleContainer.className = `cf-tinder-grid-scale ${selected}`;
        scaleContainer.classList.add('cf-tinder-grid-scale--' + this.type);
        scaleContainer.id = this._getScaleId(scale);
        this._applyStyleAccordingToType(scaleContainer);

        let scaleContent;

        if(this.type === SCALES_TYPE.image) {
            scaleContent = document.createElement("span");
            scaleContent.className = "fa-stack fa-2x";
            let heart = document.createElement("i");
            heart.className = "fa fa-heart fa-stack-1x";
            heart.style.color = "pink";
            let circle = document.createElement("i");
            circle.className = "fa fa-circle fa-stack-2x";
            circle.style.color = "#F6F6F6";
            scaleContent.insertAdjacentElement("afterbegin", heart);
            scaleContent.insertAdjacentElement("afterbegin", circle);
        }
        else {
            scaleContent = document.createElement("div");
            scaleContent.className = "cf-tinder-grid-scale__text noselect";
            scaleContent.id = this._getScaleTextId(scale);
            scaleContent.innerHTML = scale.text;
        }

        scaleContainer.insertAdjacentElement("afterbegin", scaleContent);

        return scaleContainer;
    }

    _applyStyleAccordingToType(scaleContainer) {
        switch (this.type) {
            case SCALES_TYPE.text:
                scaleContainer.style.color = this.textTypeSettings.fontColor;
                break;
            case SCALES_TYPE.button:
                scaleContainer.style.color = this.buttonTypeSettings.fontColor;
                scaleContainer.style.backgroundColor = this.buttonTypeSettings.bgColor;
                break;
        }
    }

    _attachHandlersAccordingToType() {
        switch (this.type) {
            case SCALES_TYPE.text:
                this._attachTextTypeHoverHandlers();
                break;
            case SCALES_TYPE.button:
                this._attachButtonTypeHoverHandlers();
                break;
        }
    }

    _attachTextTypeHoverHandlers() {
        this.usedScales.forEach(scale => {
            const scaleNode = this._getScaleNode(scale.code);
            scaleNode.hover(
                () => { scaleNode.addClass('cf-tinder-grid-scale--selected');
                    scaleNode.css("color", this.textTypeSettings.selectedFontColor);
                },
                () => {
                    scaleNode.removeClass('cf-tinder-grid-scale--selected');
                    scaleNode.css("color", this.textTypeSettings.fontColor);
                });
        });
    }

    _attachButtonTypeHoverHandlers() {
        this.usedScales.forEach(scale => {
            const scaleNode = this._getScaleNode(scale.code);
            scaleNode.hover(
                () => { scaleNode.addClass('cf-tinder-grid-scale--selected');
                    scaleNode.css("color", this.buttonTypeSettings.selectedFontColor);
                    scaleNode.css("backgroundColor", this.buttonTypeSettings.hoverBgColor);
                },
                () => {
                    scaleNode.removeClass('cf-tinder-grid-scale--selected');
                    scaleNode.css("color", this.buttonTypeSettings.fontColor);
                    scaleNode.css("backgroundColor", this.buttonTypeSettings.bgColor);
                });
        });
    }
}