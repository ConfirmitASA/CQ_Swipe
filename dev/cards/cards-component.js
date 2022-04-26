import CardItemAnswer from "./card-item-answer.js";
import CardItemFinish from "./card-item-finish.js";

export default class CardsComponent {
    constructor(question, cardsSettings) {
        this._question = question;
        this._settings = cardsSettings;
        this._height = cardsSettings.height;
        this._width = cardsSettings.width;
    }

    _getAnswersContainerNode = () => $(`#${this._question.id}_cards`);

    render(containerNode) {
        let cardsContainer = $('<div></div>')
            .addClass('cf-tinder-grid__answers')
            .attr('id', this._question.id + '_cards')
            .css('height', this._height + 'px')
            .css('width', this._width + 'px')
        this._getNonScaledAnswers().forEach(answer => {
            cardsContainer.prepend(new CardItemAnswer(this._question, this._settings, answer).createNode());
        });
        cardsContainer.prepend(new CardItemFinish(this._question, this._settings).createNode());

        containerNode.append(cardsContainer);

        window.addEventListener('resize', this._adjustCardSizeOnResize);
        this._adjustCardSizeOnResize();
    }

    hasNonScaledAnswers = () => {
        return this._getNonScaledAnswers().length !== 0;
    }

    _getNonScaledAnswers = () => {
        let nonScaledAnswers = [];
        const scaledAnswers = Object.keys(this._question.values);
        this._question.answers.forEach(answer => {
            if (!scaledAnswers.find(x => x === answer.code)) {
                nonScaledAnswers.push(answer);
            }
        });

        return nonScaledAnswers;
    }

    _adjustCardSizeOnResize = () => {
        const cardsContainer = this._getAnswersContainerNode();
        const containerCurrentWidth = cardsContainer.css('width').replace('px', '');

        cardsContainer.css('height', this._calculateCardHeight(containerCurrentWidth) + 'px');
    }

    _calculateCardHeight = (currentWidth) => {
        let newHeight = this._height;
        if(currentWidth < this._width) {
            newHeight = this._getCardRatio() * currentWidth;
        }
        return newHeight;
    }

    _getCardRatio = () => {
        return this._height / this._width;
    }
}