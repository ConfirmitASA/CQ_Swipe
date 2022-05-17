import SettingsTab from "./settings-tab.js";

export const ScalesSettingsTabInputSelectors = {
    position: '#scalesPosition',
    containerWidth: '#cardWidth',
    typeText: '#textOption',
    typeButton: '#buttonOption',
    typeImage: '#imageOption',
    typeTextFontColor: '#scaleTypeTextFontColor',
    typeTextSelectedFontColor: '#scaleTypeTextSelectedFontColor',
    typeButtonFontColor: '#scaleTypeButtonFontColor',
    typeButtonSelectedFontColor: '#scaleTypeButtonSelectedFontColor',
    typeButtonBgColor: '#scaleTypeButtonBgColor',
    typeButtonHoverBgColor: '#scaleTypeButtonHoverBgColor',
    typeImageIconColorLeft: '#scaleTypeImageIconColor--left',
    typeImageIconColorRight: '#scaleTypeImageIconColor--right',
    typeImageSelectedIconColorLeft: '#scaleTypeImageSelectedIconColor--left',
    typeImageSelectedIconColorRight: '#scaleTypeImageSelectedIconColor--right',
    typeImageBgColorLeft: '#scaleTypeImageBgColor--left',
    typeImageBgColorRight: '#scaleTypeImageBgColor--right'
}

export default class ScalesSettingsTab extends SettingsTab {
    constructor(scales, saveChanges) {
        super(ScalesSettingsTabInputSelectors);
        this.scales = scales;
        this.saveChanges = saveChanges;

        this.inputs = this._getSettingsInputs();
        this.scalesSettingsContainers = document.querySelectorAll('.node-property__scales-type-settings');
        document.addEventListener('DOMContentLoaded', this._subscribeToggleSettingsSubsectionAccordingToSelectedType);
        this._subscribeScaleImagePickers();

        if(!this._showScalesNumberError()) {
            this._addScaleCodesToHeaders();
            this._showScalesNumberWarning();
        }
    }

    _showScalesNumberError = () => {
        if (!this.scales || this.scales.length < 2) {
            let errorBlock = document.querySelector('#scalesCountError');
            errorBlock.classList.remove('hidden');
            const scalesSettingsBlock = document.querySelector('.node-property__content--scales');
            scalesSettingsBlock.classList.add('hidden');

            return true;
        }

        return false;
    }

    _showScalesNumberWarning = () => {
        if (this.scales.length > 2) {
            let warningBlock = document.querySelector("#scalesCountWarning");
            warningBlock.classList.remove("hidden");
        }
    }

    _addScaleCodesToHeaders() {
        const leftScaleLabel = document.querySelector('#scaleLabelLeft');
        const rightScaleLabel = document.querySelector('#scaleLabelRight');

        leftScaleLabel.innerHTML += ` (code ${this.scales[0].code}):`;
        rightScaleLabel.innerHTML += ` (code ${this.scales[1].code}):`;
    }

    setValues(settings) {
        if(settings.hasOwnProperty('position') && settings.position !== undefined) {
            this.inputs[ScalesSettingsTabInputSelectors.position].value = settings.position;
        }
        if(settings.hasOwnProperty('type') && settings.type !== undefined) {
            this._setType(settings.type);
        }
        if(settings.hasOwnProperty('textTypeSettings') && settings.textTypeSettings !== undefined) {
            this._setTextTypeSettings(settings.textTypeSettings);
        }
        if(settings.hasOwnProperty('buttonTypeSettings') && settings.buttonTypeSettings !== undefined) {
            this._setButtonTypeSettings(settings.buttonTypeSettings);
        }
        if(settings.hasOwnProperty('imageTypeSettings') && settings.imageTypeSettings !== undefined) {
            this._setImageTypeSettings(settings.imageTypeSettings);
        }

    }

    _setType = (type) => {
        this.inputs[ScalesSettingsTabInputSelectors.typeText].checked = false;
        this.inputs[ScalesSettingsTabInputSelectors.typeButton].checked = false;
        this.inputs[ScalesSettingsTabInputSelectors.typeImage].checked = false;

        switch (type) {
            case 'text':
                this.inputs[ScalesSettingsTabInputSelectors.typeText].checked = true;
                this._toggleSettingsSubsectionAccordingToSelectedType(ScalesSettingsTabInputSelectors.typeText);
                break;
            case 'button':
                this.inputs[ScalesSettingsTabInputSelectors.typeButton].checked = true;
                this._toggleSettingsSubsectionAccordingToSelectedType(ScalesSettingsTabInputSelectors.typeButton);
                break;
            case 'image':
                this.inputs[ScalesSettingsTabInputSelectors.typeImage].checked = true;
                this._toggleSettingsSubsectionAccordingToSelectedType(ScalesSettingsTabInputSelectors.typeImage);
                break;
        }
    }

    _setTextTypeSettings = (textTypeSettings) => {
        if (textTypeSettings.hasOwnProperty('fontColor') && textTypeSettings.fontColor !== undefined) {
            this.inputs[ScalesSettingsTabInputSelectors.typeTextFontColor].value = textTypeSettings.fontColor;
        }
        if (textTypeSettings.hasOwnProperty('selectedFontColor') && textTypeSettings.selectedFontColor !== undefined) {
            this.inputs[ScalesSettingsTabInputSelectors.typeTextSelectedFontColor].value = textTypeSettings.selectedFontColor;
        }
    }

    _setButtonTypeSettings = (buttonTypeSettings) => {
        if (buttonTypeSettings.hasOwnProperty('fontColor') && buttonTypeSettings.fontColor !== undefined) {
            this.inputs[ScalesSettingsTabInputSelectors.typeButtonFontColor].value = buttonTypeSettings.fontColor;
        }
        if (buttonTypeSettings.hasOwnProperty('selectedFontColor') && buttonTypeSettings.selectedFontColor !== undefined) {
            this.inputs[ScalesSettingsTabInputSelectors.typeButtonSelectedFontColor].value = buttonTypeSettings.selectedFontColor;
        }
        if(buttonTypeSettings.hasOwnProperty('bgColor') && buttonTypeSettings.bgColor !== undefined) {
            this.inputs[ScalesSettingsTabInputSelectors.typeButtonBgColor].value = buttonTypeSettings.bgColor;
        }
        if(buttonTypeSettings.hasOwnProperty('hoverBgColor') && buttonTypeSettings.hoverBgColor !== undefined) {
            this.inputs[ScalesSettingsTabInputSelectors.typeButtonHoverBgColor].value = buttonTypeSettings.hoverBgColor;
        }
    }

    _setImageTypeSettings = (imageTypeSettings) => {
        if(imageTypeSettings.hasOwnProperty('left') && imageTypeSettings.left !== undefined) {
            this._setImageTypeSettingsPositionWise(imageTypeSettings.left, 'left');
        }
        if(imageTypeSettings.hasOwnProperty('right') && imageTypeSettings.right !== undefined) {
            this._setImageTypeSettingsPositionWise(imageTypeSettings.right, 'right');
        }
    }

    _setImageTypeSettingsPositionWise = (imageTypeSettingsForPosition, scalePosition) => {
        let iconColorInput, selectedIconColorInput, bgColorInput;
        if(scalePosition === 'left') {
            iconColorInput = this.inputs[ScalesSettingsTabInputSelectors.typeImageIconColorLeft];
            selectedIconColorInput = this.inputs[ScalesSettingsTabInputSelectors.typeImageSelectedIconColorLeft];
            bgColorInput = this.inputs[ScalesSettingsTabInputSelectors.typeImageBgColorLeft];
        }
        if(scalePosition === 'right') {
            iconColorInput = this.inputs[ScalesSettingsTabInputSelectors.typeImageIconColorRight];
            selectedIconColorInput = this.inputs[ScalesSettingsTabInputSelectors.typeImageSelectedIconColorRight];
            bgColorInput = this.inputs[ScalesSettingsTabInputSelectors.typeImageBgColorRight];
        }
        if(imageTypeSettingsForPosition.hasOwnProperty('image') && imageTypeSettingsForPosition.image !== undefined) {
            document.querySelector(`#scaleImage--${scalePosition}__${imageTypeSettingsForPosition.image}`)
                .classList.add('scale-icon-picker--selected');
        }
        if(imageTypeSettingsForPosition.hasOwnProperty('iconColor') && imageTypeSettingsForPosition.iconColor !== undefined) {
            iconColorInput.value = imageTypeSettingsForPosition.iconColor;
        }
        if(imageTypeSettingsForPosition.hasOwnProperty('selectedIconColor') && imageTypeSettingsForPosition.selectedIconColor !== undefined) {
            selectedIconColorInput.value = imageTypeSettingsForPosition.selectedIconColor;
        }
        if(imageTypeSettingsForPosition.hasOwnProperty('bgColor') && imageTypeSettingsForPosition.bgColor !== undefined) {
            bgColorInput.value = imageTypeSettingsForPosition.bgColor;
        }
    }

    getValues() {
        let positionSelector = this.inputs[ScalesSettingsTabInputSelectors.position];

        return {
            position: positionSelector.options[positionSelector.selectedIndex].value,
            containerWidth: parseInt(this.inputs[ScalesSettingsTabInputSelectors.containerWidth].value),
            type: this._getSelectedScalesType(),
            textTypeSettings: {
                fontColor: this.inputs[ScalesSettingsTabInputSelectors.typeTextFontColor].value,
                selectedFontColor: this.inputs[ScalesSettingsTabInputSelectors.typeTextSelectedFontColor].value
            },
            buttonTypeSettings: {
                fontColor: this.inputs[ScalesSettingsTabInputSelectors.typeButtonFontColor].value,
                selectedFontColor: this.inputs[ScalesSettingsTabInputSelectors.typeButtonSelectedFontColor].value,
                bgColor: this.inputs[ScalesSettingsTabInputSelectors.typeButtonBgColor].value,
                hoverBgColor: this.inputs[ScalesSettingsTabInputSelectors.typeButtonHoverBgColor].value
            },
            imageTypeSettings: {
                left: {
                    image: this._getSelectedScaleImage('left'),
                    iconColor: this.inputs[ScalesSettingsTabInputSelectors.typeImageIconColorLeft].value,
                    selectedIconColor: this.inputs[ScalesSettingsTabInputSelectors.typeImageSelectedIconColorLeft].value,
                    bgColor: this.inputs[ScalesSettingsTabInputSelectors.typeImageBgColorLeft].value
                },
                right: {
                    image: this._getSelectedScaleImage('right'),
                    iconColor: this.inputs[ScalesSettingsTabInputSelectors.typeImageIconColorRight].value,
                    selectedIconColor: this.inputs[ScalesSettingsTabInputSelectors.typeImageSelectedIconColorRight].value,
                    bgColor: this.inputs[ScalesSettingsTabInputSelectors.typeImageBgColorRight].value
                }
            }
        }
    }

    _getSelectedScalesType() {
        const scalesTypeTextInput = this.inputs[ScalesSettingsTabInputSelectors.typeText];
        const scalesTypeButtonInput = this.inputs[ScalesSettingsTabInputSelectors.typeButton];
        const scalesTypeImageInput = this.inputs[ScalesSettingsTabInputSelectors.typeImage];

        return scalesTypeTextInput.checked ?
            scalesTypeTextInput.value : scalesTypeButtonInput.checked ?
                scalesTypeButtonInput.value : scalesTypeImageInput.value;
    }

    _getSelectedScaleImage = (scalePosition) => {
        let imagePickerContainer = document.querySelectorAll(`.node-property--${scalePosition}-scale-image`)[0];
        let imagePicker = imagePickerContainer.querySelector('.scale-icon-picker--selected');

        return imagePicker.id.substring(imagePicker.id.indexOf('__') + 2);
    }

    _toggleSettingsSubsectionAccordingToSelectedType(typeInputElementId) {
        typeInputElementId = typeInputElementId.substring(1); //cut '#'
        let activeCollapsableSection;
        try{
            activeCollapsableSection = document.querySelectorAll(`.controlled-by--${typeInputElementId}`)[0];
        }
        catch (e) {
            console.log("Could not find collapsable section controlled by " + typeInputElementId);
            return;
        }

        activeCollapsableSection.classList.remove("hidden");

        this.scalesSettingsContainers.forEach(function(container) {
            if(container !== activeCollapsableSection) {
                container.classList.add("hidden");
            }
        })
    }

    _subscribeToggleSettingsSubsectionAccordingToSelectedType = () => {
        let textOption = document.getElementById("textOption");
        let buttonOption = document.getElementById("buttonOption");
        let imageOption = document.getElementById("imageOption");

        let optionInputs = [textOption, buttonOption, imageOption];

        optionInputs.forEach(function (input) {
            if(input) {
                input.addEventListener("change", function () {
                    this._toggleSettingsSubsectionAccordingToSelectedType(input);
                })
            }
        })
    }

    _subscribeScaleImagePickers = () => {
        let imagePickers = document.querySelectorAll(".scale-icon-picker");
        imagePickers.forEach(picker => {
            picker.addEventListener("click", this._onScaleImagePickerClick);
            picker.addEventListener("click", this.saveChanges);
        })
    }

    _onScaleImagePickerClick = (e) => {
        let picker = e.currentTarget;
        let scalePosition = this._getScalePositionFromId(picker.id);
        let imagePickerContainerForPosition = document.querySelectorAll(`.node-property--${scalePosition}-scale-image`)[0];
        let imagePickers = imagePickerContainerForPosition.querySelectorAll('.scale-icon-picker');
        imagePickers.forEach(picker => {
            picker.classList.remove('scale-icon-picker--selected');
        });
        picker.classList.add('scale-icon-picker--selected');
    }

    _getScalePositionFromId = (pickerId) => {
        let startIndex = pickerId.indexOf("--") + "--".length;
        let length = pickerId.indexOf("__") - startIndex;

        return pickerId.substr(startIndex, length);
    }
}



