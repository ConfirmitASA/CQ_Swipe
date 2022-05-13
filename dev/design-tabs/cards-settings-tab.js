import {ScalesSettingsTabInputSelectors} from "./scales-settings-tab";

export const CardsSettingsTabInputSelectors = {
    width: '#cardWidth',
    height: '#cardHeight',
    bgColor: '#cardBgColor',
    fontColor: '#cardFontColor',
    useImages: '#useImagesForCards',
    urls: '.image-input--card'
}

export default class CardsSettingsTab {
    constructor(answers) {
        this.answers = answers;
        this.renderCardImageInputs();

        this.inputs = this._getSettingsInputs();
        this._subscribeUseImagesCheckboxToggleSubsection();
    }
    
    setValues(settings) {
        if(settings.hasOwnProperty('height') && settings.height !== undefined) {
            this.inputs[CardsSettingsTabInputSelectors.height].value = settings.height;
        }
        if(settings.hasOwnProperty('width') && settings.width !== undefined) {
            this.inputs[CardsSettingsTabInputSelectors.width].value = settings.width;
        }
        if(settings.hasOwnProperty('bgColor') && settings.bgColor !== undefined) {
            this.inputs[CardsSettingsTabInputSelectors.bgColor].value = settings.bgColor;
        }
        if(settings.hasOwnProperty('fontColor') && settings.fontColor !== undefined) {
            this.inputs[CardsSettingsTabInputSelectors.fontColor].value = settings.fontColor;
        }
        if(settings.hasOwnProperty('useImages') && settings.useImages !== undefined) {
            this.inputs[CardsSettingsTabInputSelectors.useImages].checked = settings.useImages;
            this._toggleSubsectionOnUseImagesBoxChecked();
        }
        if(settings.hasOwnProperty('urls') && settings.urls !== undefined) {
            const imageUrls = settings.urls;
            this.inputs[CardsSettingsTabInputSelectors.urls].forEach((input) => {
                let pair = imageUrls.find(pair => pair.id === input.id);
                if(pair) {
                    input.value = pair.url;
                    this.loadImagePreview(input);
                }
            });
        }
    }

    getValues() {
        return {
            height: parseInt(this.inputs[CardsSettingsTabInputSelectors.height].value),
            width: parseInt(this.inputs[CardsSettingsTabInputSelectors.width].value),
            bgColor: this.inputs[CardsSettingsTabInputSelectors.bgColor].value,
            fontColor: this.inputs[CardsSettingsTabInputSelectors.fontColor].value,
            useImages: this.inputs[CardsSettingsTabInputSelectors.useImages].checked,
            urls: this._getImageURLs()
        }
    }

    _getImageURLs = () => {
        let imgURLs = [];
        let urlInputs = this.inputs[CardsSettingsTabInputSelectors.urls];
        urlInputs.forEach((input) => {
            imgURLs.push({id: input.id, url: input.value});
        });

        return imgURLs;
    }

    _getSettingsInputs = () => {
        let inputs = {};
        for (let property in CardsSettingsTabInputSelectors) {
            let selector = CardsSettingsTabInputSelectors[property];
            let inputsArray = document.querySelectorAll(selector);
            inputs[selector] = selector.indexOf('#') !== -1 ? inputsArray[0] : inputsArray;
        }
        return inputs;
    }

    _subscribeUseImagesCheckboxToggleSubsection = () => {
        const useImagesCheckbox = this.inputs[CardsSettingsTabInputSelectors.useImages];
        useImagesCheckbox.addEventListener("change", this._toggleSubsectionOnUseImagesBoxChecked);
    }

    _toggleSubsectionOnUseImagesBoxChecked = () => {
        const useImagesCheckbox = this.inputs[CardsSettingsTabInputSelectors.useImages];
        let collapsableSection;
        try{
            collapsableSection = document.querySelectorAll(`.controlled-by--${useImagesCheckbox.id}`)[0];
        }
        catch (e) {
            console.log("Could not find collapsable section controlled by " + useImagesCheckbox.id);
            return;
        }

        if (useImagesCheckbox.checked) {
            collapsableSection.classList.remove("hidden");
        } else {
            collapsableSection.classList.add("hidden");
        }
    }

    renderCardImageInputs() {
        let imageContainer = document.getElementById("cardImagesContainer");
        this.answers.forEach((card) => {
            let imageContainerNode = this._createCardImageContainerNode(card.code);
            imageContainer.insertAdjacentElement("beforeend", imageContainerNode);
        });
    }

    _createCardImageContainerNode = (cardCode) => {
        let container = document.createElement("div");
        container.className = "image-container";
        container.innerHTML = `<span class="image-code">${cardCode}: </span>`;

        let imageURLInput = document.createElement("input");
        imageURLInput.id = `image_${cardCode}`;
        imageURLInput.className = "form-control input-sm form-input image-input image-input--card";

        container.insertAdjacentElement("beforeend", imageURLInput);

        let imagePreview = document.createElement('img');
        imagePreview.className = "image-preview";

        container.insertAdjacentElement("beforeend", imagePreview);

        return container;
    }

    loadImagePreview(inputElement) {
        const inputURL = inputElement.value;
        const previewContainer = document.querySelector('#' + inputElement.id + ' + img');

        if(inputURL === "") {
            previewContainer.setAttribute('src', 'empty-preview-image.svg');
            previewContainer.classList.remove('zoom');
            return;
        }

        previewContainer.setAttribute('src', inputURL);
        previewContainer.classList.add('zoom');
    }
}