import $ from 'jquery';

export default class CardItemAnswer {

    constructor(question, customSettings, answer) {
        this._question = question;
        this._answer = answer;
        this._height = customSettings.height;
        this._width = customSettings.width;
        this._bgColor = customSettings.bgColor;
        this._fontColor = customSettings.fontColor;
        this._useBgImage = customSettings.useImages;
        this._setBgImageURL(customSettings.urls);
    }

    _setBgImageURL(answerCodeUrlPairs) {
        let answerImagePair = answerCodeUrlPairs.find(pair => pair.id === "image_" + this._answer.code);
        this._bgImageURl = answerImagePair ? answerImagePair.url : null;
    }

    _getAnswerId = () => `${this._question.id}_${this._answer.code}`;
    _getAnswerTextId = () => `${this._question.id}_${this._answer.code}_text`;
    _getAnswerOtherTextId = () => `${this._question.id}_${this._answer.code}_other`;

    createNode() {
        let cardNode = $('<div></div>')
            .addClass('cf-tinder-grid-card cf-tinder-grid-answer')
            .attr('id', this._getAnswerId())
            .css('max-width', this._width + 'px')
            .css('max-height', this._height + 'px')
            .css('background-color', this._bgColor)
            .css('color', this._fontColor);

        if(this._useBgImage && this._bgImageURl) {
            cardNode.css('background-image', `url('${this._bgImageURl}')`)
        }

        let cardContent;
        if (this._answer.isOther) {
            cardContent = $('<input>')
                .addClass('cf-tinder-grid-answer__other')
                .attr('id', this._getAnswerOtherTextId())
                .attr('placeholder', this._answer.text)
                .attr('type', 'text')
                .val(this._question.otherValues[this._answer.code] || "")
        } else {
            cardContent = $(`<div>${this._answer.text}</div>`)
                .addClass('cf-tinder-grid-answer__text noselect')
                .attr('id', this._getAnswerTextId())
        }

        cardNode.prepend(cardContent);
        return cardNode;
    }
}