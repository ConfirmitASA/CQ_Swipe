import {SCALES_TYPE} from "./scales/scales-component.js";

export default class VisualCues {
    constructor(question, customSettings) {
        this.question = question;
        this.settings = customSettings;
    }

    render() {
        if(this.settings.visualCues.enableArrows) {
            this.renderArrows();
        }
        if(this.settings.visualCues.enableChosenScaleOnTop) {
            this.renderChosenScaleOnTop();
        }
        if(this.settings.visualCues.enableSelectedScaleOnNextCard) {
            this.renderCardsForSelectedScales();
        }
    }

    renderArrows() {
        const leftArrow = document.createElement("div");
        leftArrow.className = "cf-tinder-grid__arrow-left";
        leftArrow.innerHTML = '<i class="fa fa-arrow-left"></i>';

        const rightArrow = document.createElement("div");
        rightArrow.className = "cf-tinder-grid__arrow-right";
        rightArrow.innerHTML = '<i class="fa fa-arrow-right"></i>';

        let gridContainer = document.querySelector('.grid-container');

        gridContainer.insertAdjacentElement("afterbegin", leftArrow);
        gridContainer.insertAdjacentElement("beforeend", rightArrow);
        return {leftArrow, rightArrow};
    }

    renderChosenScaleOnTop() {
        const scaleOnTopContainer = document.createElement('div');
        scaleOnTopContainer.className = 'cf-tinder-grid__current-scale hidden';
        const currentScaleImageElement = document.createElement('i');
        currentScaleImageElement.className = 'current-scale__image fa';
        scaleOnTopContainer.insertAdjacentElement('afterbegin', currentScaleImageElement);
        document.querySelector('.cf-tinder-grid__answers').insertAdjacentElement('afterbegin', scaleOnTopContainer);
    }

    toggleSelectedScaleOnTop() {
        if(!this.settings.visualCues.enableChosenScaleOnTop) {
            return;
        }
        const container = document.querySelector('.cf-tinder-grid__current-scale');
        let selectedScaleImage = this._getSelectedScaleImageNode();
        if(!!selectedScaleImage) {
            container.classList.remove('hidden');

            let imageElement = container.querySelector('i');
            imageElement.className = 'current-scale__image fa';
            imageElement.classList.add(this._getSelectedScaleImageClass());
            imageElement.style.color = this._getSelectedScaleImageColor();
        } else {
            container.classList.add('hidden');
        }
    }

    _getSelectedScaleImageNode(selectedScaleCode) {
        let selectedScaleImageNode = selectedScaleCode !== undefined ? $(`#${this.question.id}_scale_${selectedScaleCode} .scale__image`) : $('.cf-tinder-grid-scale--selected .scale__image');
        if(selectedScaleImageNode.length === 0) {
            return null;
        }

        return selectedScaleImageNode;
    }

    _getSelectedScaleImageClass(selectedScaleCode) {
        const selectedScaleImageNode = this._getSelectedScaleImageNode(selectedScaleCode);
        const startIndex = selectedScaleImageNode.attr('id').indexOf('-') + 1;

        return 'fa-' + selectedScaleImageNode.attr('id').substring(startIndex);
    }

    _getSelectedScaleImageColor(selectedScaleCode) {
        const selectedScaleImageNode = this._getSelectedScaleImageNode(selectedScaleCode);
        if(selectedScaleImageNode.attr('id').indexOf('left') !== -1) {
            return this.settings.scales.imageTypeSettings.left.selectedIconColor;
        } else {
            return this.settings.scales.imageTypeSettings.right.selectedIconColor;
        }
    }

    _getSelectedScaleImageBGColor(selectedScaleCode) {
        const selectedScaleImageNode = this._getSelectedScaleImageNode(selectedScaleCode);
        if(selectedScaleImageNode.attr('id').indexOf('left') !== -1) {
            return this.settings.scales.imageTypeSettings.left.bgColor;
        } else {
            return this.settings.scales.imageTypeSettings.right.bgColor;
        }
    }

    renderCardsForSelectedScales() {
        let cardsWithAnswers = $('.cf-tinder-grid-answer');
        const cardsSettings = this.settings.cards;
        cardsWithAnswers.each(function(i, elem) {
            let cardWithSelectedScale = $('<div></div>')
                .addClass('cf-tinder-grid-card card-selected-scale noselect')
                .attr('id', 'selected-scale-card_' + elem.id)
                .css('background-color', cardsSettings.bgColor)
                .css('max-width', cardsSettings.width + 'px')
                .css('max-height', cardsSettings.height + 'px')
            $(elem).before(cardWithSelectedScale);
        });
    }

    showSelectedScaleOnNextCard(answerCode, selectedScaleCode) {
        if(!this.settings.visualCues.enableSelectedScaleOnNextCard) {
            return;
        }
        const card = $(`#selected-scale-card_${this.question.id}_${answerCode}`);
        if(this.settings.scales.type !== SCALES_TYPE.image) {
            const selectedScaleText = this._getSelectedScaleText(selectedScaleCode);
            card.append($(`<span>${selectedScaleText}</span>`));
        } else {
            const selectedScaleImageClass = this._getSelectedScaleImageClass(selectedScaleCode);
            const scaleImage = $('<i></i>')
                .addClass(`current-scale__image fa ${selectedScaleImageClass}`)
                .css('color', this._getSelectedScaleImageColor(selectedScaleCode));
            card.append(scaleImage);
            card.css('background-color', this._getSelectedScaleImageBGColor(selectedScaleCode));
        }
        card.addClass('fade-out');
        card.on('transitionend webkitTransitionEnd oTransitionEnd', (e) => {
            $(e.target).addClass('hidden');
        });
    }

    _getSelectedScaleText(selectedScaleCode) {
        let selectedScaleTextNode = selectedScaleCode !== undefined ? $(`#${this.question.id}_scale_${selectedScaleCode}_text`) : $('.cf-tinder-grid-scale--selected .cf-tinder-grid-scale__text');
        if(selectedScaleTextNode.length === 0) {
            return null;
        }
        return selectedScaleTextNode.text();
    }
}
