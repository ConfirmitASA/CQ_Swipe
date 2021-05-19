import TinderSwipe from "../dev/TinderSwipe";

function TinderGridRenderer(question, customQuestionSettings) {
  this._getAnswerId = (answer) => `${question.id}_${answer.code}`;
  this._getAnswerTextId = (answer) => `${question.id}_${answer.code}_text`;
  this._getAnswerOtherTextId = (answer) => `${question.id}_${answer.code}_other`;
  this._getScaleId = (scale) => `${question.id}_scale_${scale.code}`;
  this._getScaleTextId = (scale) => `${question.id}_scale_${scale.code}_text`;

  this.answerImagesURLs = customQuestionSettings.answerImages.urls;

  this._renderQuestion = () => {
    let content = '';
    content += '<div class="cf-question__text" id="' + question.id + '_text">' + question.text + '</div>';
    content += '<div class="cf-question__instruction" id="' + question.id + '_instruction">' + question.instruction + '</div>';
    content += '<div class="cf-question__error cf-error-block cf-error-block--bottom cf-error-block--hidden" id="' + question.id + '_error"><ul class="cf-error-list" id="' + question.id + '_error_list"></ul></div></div>';
    content += '<div class="cf-question__content cf-question__content--no-padding" id="' + question.id + '_content"></div>';
    document.getElementById(question.id).innerHTML = content;
  }

  this._renderQuestionContent = () => {
    document.querySelector('#' + question.id + ' .cf-question__content').innerHTML = '<div class="cf-tinder-grid"></div>';
    const container = document.querySelector('#' + question.id + ' .cf-tinder-grid');
    //const answerList = `<div class="cf-tinder-grid__answers">${question.answers.map(answer => this._renderAnswer(answer)).reverse().join('')}</div>`;

    const answerList = document.createElement("div");
    answerList.className = "cf-tinder-grid__answers";
    question.answers.forEach(answer => {
      answerList.insertAdjacentElement("afterbegin", this._renderAnswer(answer));
    });
    container.insertAdjacentElement("afterbegin", answerList);

    answerList.insertAdjacentElement("afterbegin", this._renderFinishCard());

    //const scaleList = `<div class="cf-tinder-grid__scales">${question.scales.slice(0, 2).map(scale => this._renderScale(scale)).join('')}</div>`;
    const scaleList = document.createElement("div");
    scaleList.className = "cf-tinder-grid__scales";
    question.scales.slice(0, 2).forEach(scale => {
      scaleList.insertAdjacentElement("beforeend", this._renderScale(scale));
    })
    container.insertAdjacentElement("beforeend", scaleList);
  }

  this._renderAnswer = answer => {
    let answerContent = '';
    if (answer.isOther) {
      answerContent += `<input class="cf-tinder-grid-answer__other" placeholder="${answer.text}" id="${this._getAnswerOtherTextId(answer)}" type="text" value="${question.otherValues[answer.code] || ""}"/>`;
    } else {
      answerContent += `<div class="cf-tinder-grid-answer__text noselect" id="${this._getAnswerTextId(answer)}">${answer.text}</div>`
    }

    let answerImagePair = this.answerImagesURLs.find(pair => pair.id === "image_" + answer.code); //TODO: Add function for constructing pair.id from answer.code OR change pair.id to == answer.code not "image_{answer.code}"

    let answerContainer = document.createElement("div");
    answerContainer.className = "cf-tinder-grid-answer";
    answerContainer.id = this._getAnswerId(answer);
    if(answerImagePair) {
      answerContainer.style.backgroundImage = `url('${answerImagePair.url}')`;
    }
    answerContainer.innerHTML = answerContent;

    return answerContainer;
  }

  this._renderScale = (scale) => {
    let selected = "";
    const values = Object.entries(question.values);

    if(values[0] !== undefined && values[0][1] === scale.code){
      selected = "cf-tinder-grid-scale--selected";
    }

    let scaleContainer = document.createElement("div");
    scaleContainer.className = "cf-tinder-grid-scale ${selected}";
    scaleContainer.id = this._getScaleId(scale);
    let scaleContent = `<div class="cf-tinder-grid-scale__text noselect" id="${this._getScaleTextId(scale)}">${scale.text}</div>`;
    scaleContainer.innerHTML = scaleContent;

    return scaleContainer;
  }

  this._renderFinishCard = () => {
    let finishCardContainer = document.createElement("div");
    finishCardContainer.className = "cf-tinder-grid-card-finish";

    const finishCardContent =
        '<div class="cf-tinder-grid-card-finish__trigger"></div>' +
        '<svg version="1.1" id="tick" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
        '\t viewBox="0 0 37 37" xml:space="preserve">\n' +
        '<path class="circle path" style="fill:none;stroke:#39A739;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10;" d="\n' +
        '\tM30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z"\n' +
        '\t/>\n' +
        '<polyline class="tick path" style="fill:none;stroke:#39A739;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10;" points="\n' +
        '\t11.6,20 15.9,24.2 26.4,13.8 "/>\n' +
        '</svg>';

    finishCardContainer.innerHTML = finishCardContent;

    return finishCardContainer;
  }

  this.render = () => {
    this._renderQuestion();
    this._renderQuestionContent()
  }

}

export default (question, customQuestionSettings, questionViewSettings) => {
  const renderer = new TinderGridRenderer(question, customQuestionSettings).render();

  const view = new TinderSwipe(question);
};
