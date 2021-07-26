import TinderSwipe from "../dev/TinderSwipe";

export default class Card {
    constructor(question, settings) {
        this.currentLanguage = String(Confirmit.page.surveyInfo.language);

        this.question = question;
        this.height = settings.cards.height;
        this.width = settings.cards.width;
        this.bgColor = settings.cards.bgColor;
        this.fontColor = settings.cards.fontColor;
        this.useImages = settings.cards.useImages;
        this.imagesURLs = settings.cards.urls;
    }

    _getAnswerId = (answer) => `${this.question.id}_${answer.code}`;
    _getAnswerTextId = (answer) => `${this.question.id}_${answer.code}_text`;
    _getAnswerOtherTextId = (answer) => `${this.question.id}_${answer.code}_other`;
    
    renderCards() {
        const container = document.querySelector('#' + this.question.id + ' .cf-tinder-grid');
        
        const cardsContainer = document.createElement("div");
        cardsContainer.className = "cf-tinder-grid__answers";
        cardsContainer.style.height = this.height + 'px';
        
        this._getNonScaledAnswers().forEach(answer => {
            cardsContainer.insertAdjacentElement("afterbegin", this._createCardElement(answer));
        })
        container.insertAdjacentElement("afterbegin", cardsContainer);

        cardsContainer.insertAdjacentElement("afterbegin", this._createFinishCardElement());

        if (!this._hasNonScaledAnswers) {
            $(".cf-tinder-grid-card--finish__trigger").toggleClass("draw");
        }
    }
    
    _getNonScaledAnswers = () => {
        let nonScaledAnswers = [];
        const scaledAnswers = Object.keys(this.question.values);
        this.question.answers.forEach(answer => {
            if (!scaledAnswers.find(x => x === answer.code)) {
                nonScaledAnswers.push(answer);
            }
        });
        
        return nonScaledAnswers;
    }
    
    _hasNonScaledAnswers = () => {
        return this._getNonScaledAnswers().length !== 0;
    }

    _createCardElement = answer => {
        let cardContent;
        if (answer.isOther) {
            cardContent = document.createElement('input');
            cardContent.className = "cf-tinder-grid-answer__other";
            cardContent.placeholder = answer.text;
            cardContent.id = this._getAnswerOtherTextId(answer);
            cardContent.type = "text";
            cardContent.value = this.question.otherValues[answer.code] || "";
        } else {
            cardContent = document.createElement('div');
            cardContent.className = "cf-tinder-grid-answer__text noselect";
            cardContent.id = this._getAnswerTextId(answer);
            cardContent.innerHTML = answer.text;
        }

        let cardElement = document.createElement("div");
        cardElement.className = "cf-tinder-grid-card cf-tinder-grid-answer";
        cardElement.id = this._getAnswerId(answer);
        cardElement.style.width = this.width + 'px';
        cardElement.style.marginLeft = -this.width / 2 + 'px';
        cardElement.style.backgroundColor = this.bgColor;

        cardContent.style.color = this.fontColor;

        if(this.useImages) {
            let answerImagePair = this.imagesURLs.find(pair => pair.id === "image_" + answer.code); //TODO: Add function for constructing pair.id from answer.code OR change pair.id to == answer.code not "image_{answer.code}"
            if(answerImagePair) {
                cardElement.style.backgroundImage = `url('${answerImagePair.url}')`;
            }
        }

        cardElement.insertAdjacentElement("afterbegin", cardContent);
        return cardElement;
    }

    _createFinishCardElement = () => {
        let finishCardContainer = document.createElement("div");
        finishCardContainer.className = "cf-tinder-grid-card cf-tinder-grid-card--finish";

        const finishCardContent =
            '<div class="cf-tinder-grid-card--finish__trigger"></div>' +
            '<svg version="1.1" id="tick" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
            '\t viewBox="0 0 37 37" xml:space="preserve">\n' +
            '<path class="circle path" style="fill:none;stroke:#39A739;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10;" d="\n' +
            '\tM30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z"\n' +
            '\t/>\n' +
            '<polyline class="tick path" style="fill:none;stroke:#39A739;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10;" points="\n' +
            '\t11.6,20 15.9,24.2 26.4,13.8 "/>\n' +
            '</svg>';

        finishCardContainer.innerHTML = finishCardContent;
        finishCardContainer.style.width = this.width + 'px';
        finishCardContainer.style.marginLeft = -this.width / 2 + 'px';

        return finishCardContainer;
    }
}