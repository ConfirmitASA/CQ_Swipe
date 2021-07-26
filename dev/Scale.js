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
        this.imageTypeSettings = settings.imageTypeSettings;
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

        const leftScale = this.usedScales[0];
        const rightScale = this.usedScales[1];
        const leftScaleContainer = this._createScaleContainerElement(leftScale);
        const rightScaleContainer = this._createScaleContainerElement(rightScale);
        const scaleContainers = [leftScaleContainer, rightScaleContainer];

        if(this.type === SCALES_TYPE.image) {
            this._addScaleContentToContainer_TypeImage(leftScaleContainer, leftScale, 'left');
            this._addScaleContentToContainer_TypeImage(rightScaleContainer, rightScale, 'right');
        } else {
            this._addScaleContentToContainer(leftScaleContainer, leftScale);
            this._addScaleContentToContainer(rightScaleContainer, rightScale);
        }

        scaleContainers.forEach(scaleContainer => {
            this._applyStyleAccordingToType(scaleContainer);
            scaleList.insertAdjacentElement("beforeend", scaleContainer);
        });

        let insertPosition = "";
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

    _createScaleContainerElement = (scale) => {
        let selected = "";
        const values = Object.entries(this.question.values);

        if(values[0] !== undefined && values[0][1] === scale.code){
            selected = "cf-tinder-grid-scale--selected";
        }

        let scaleContainer = document.createElement("div");
        scaleContainer.className = `cf-tinder-grid-scale ${selected}`;
        scaleContainer.classList.add('cf-tinder-grid-scale--' + this.type);
        scaleContainer.id = this._getScaleId(scale);

        return scaleContainer;
    }

    _addScaleContentToContainer(container, scale) {
        let scaleContent;

        scaleContent = document.createElement("div");
        scaleContent.className = "cf-tinder-grid-scale__text noselect";
        scaleContent.id = this._getScaleTextId(scale);
        scaleContent.innerHTML = scale.text;

        container.insertAdjacentElement("afterbegin", scaleContent);
    }

    _addScaleContentToContainer_TypeImage(container, scale, position) {
        let settings = position === 'left' ? this.imageTypeSettings.left : this.imageTypeSettings.right;

        let scaleContent;
        scaleContent = document.createElement("span");
        scaleContent.className = "fa-stack fa-2x";
        let icon = document.createElement("i");

        icon.className = `fa fa-${settings.image} fa-stack-1x`;
        icon.style.color = settings.iconColor;
        let circle = document.createElement("i");
        circle.className = "fa fa-circle fa-stack-2x";
        circle.style.color = settings.bgColor;
        scaleContent.insertAdjacentElement("afterbegin", icon);
        scaleContent.insertAdjacentElement("afterbegin", circle);

        container.insertAdjacentElement("afterbegin", scaleContent);
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