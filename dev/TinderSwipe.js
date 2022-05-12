import VisualCues from "./VisualCues";
import ScalesComponent from "./scales/scales-component.js";
import CardsComponent from "./cards/cards-component.js";
import {DefaultSettingsManager} from "./default-settings-manager.js";

const QuestionWithAnswersView = Confirmit.pageView.questionViewTypes.QuestionWithAnswersView;

export default class TinderSwipe extends QuestionWithAnswersView {
    constructor(question, customSettings) {
        super(question);
        this._draggingAnswer = null;
        this._draggingAnswerNodeOffset = null;
        this._currentAnswerIndex = 0;
        this._settings = DefaultSettingsManager.getValidSettings(customSettings);
        this._cardsComponent = new CardsComponent(question, this._settings.cards);
        this._scalesComponent = new ScalesComponent(question, this._settings.scales);
        this._visualCues = new VisualCues(question, this._settings);
        this._init();
    }

    //region Getters
    _getAnswerId(answer) {
        return `${this._question.id}_${answer.code}`;
    }

    _getCurrentAnswerCode() {
        if(this._currentAnswerIndex >= this.answers.length) {
            return null;
        }

        return this.answers[this._currentAnswerIndex].code;
    }

    _getCurrentAnswerNode() {
        if(this._currentAnswerIndex >= this.answers.length) {
            return null;
        }
        const currentAnswer = this.answers[this._currentAnswerIndex];
        const currentAnswerNode = $('#' + this._getAnswerId(currentAnswer));

        return currentAnswerNode;
    }

    _getScaleNode(scaleCode){
        return $(`#${this._question.id}_scale_${scaleCode}`);
    }

    _getAnswersNode() {
        return $('.cf-tinder-grid__answers');
    }

    _getXCoordinate (event){
        return event.pageX !== undefined ? event.pageX :
            ((event.originalEvent.touches[0] && event.originalEvent.touches[0].pageX) || event.originalEvent.changedTouches[0].pageX);
    }
    _getDraggingAnswerNode(){
        return this._draggingAnswer !== null ? this._getAnswerNode(this._draggingAnswer.code) : $([]);
    }

    _getNodeMiddleCoordinate(node){
        const {left, width} = node[0].getBoundingClientRect();
        return (left + width/2);
    }
    //endregion

    _setDefaultSettings() {

    }

    _init(){
        this._render();
        this._attachHandlersToDom();
        this._question.validationCompleteEvent.on(this._showAnswerError.bind(this));
    }

    _render() {
        this._renderQuestion();
        this._renderQuestionContent();
    }

    _renderQuestion() {
        let content = '';
        content += '<div class="cf-question__text" id="' + this._question.id + '_text">' + this._question.text + '</div>';
        content += '<div class="cf-question__instruction" id="' + this._question.id + '_instruction">' + this._question.instruction + '</div>';
        content += '<div class="cf-question__error cf-error-block cf-error-block--bottom cf-error-block--hidden" id="' + this._question.id + '_error"><ul class="cf-error-list" id="' + this._question.id + '_error_list"></ul></div></div>';
        content += '<div class="cf-question__content cf-question__content--no-padding" id="' + this._question.id + '_content"></div>';
        document.getElementById(this._question.id).innerHTML = content;
    }

    _renderQuestionContent() {
        const gridContainer = $('<div></div>')
            .addClass('grid-container')
            .attr('id', `${this._question.id}_grid-container`)
            .appendTo($('#' + this._question.id + ' .cf-question__content'));

        this._cardsComponent.render(gridContainer);

        if(!this._cardsComponent.hasNonScaledAnswers()) {
            this._showFinalCard();
            this._settings.visualCues.enableArrows = 'false';
        } else {
            this._scalesComponent.render();
        }

        this._visualCues.render();
    }

    _attachHandlersToDom(){
        this.answers.forEach(answer => {
            this._getAnswerNode(answer.code).on('mousedown touchstart', e => this._onAnswerDrag(e, answer));
            this._getAnswerOtherNode(answer.code)
                .on('input', e => this._onAnswerOtherNodeValueChange(answer, e.target.value))
                .on('mousedown', e => e.stopPropagation())
                .on('touchstart', e => e.stopPropagation());
        });

        const usedScales = this._question.scales.slice(0, 2);
        this._getScaleNode(usedScales[0].code).on('click', () => this._onLeftScaleClick(usedScales[0].code));
        this._getScaleNode(usedScales[1].code).on('click', () => this._onRightScaleClick(usedScales[1].code));

        $(document).on('mousemove touchmove', this._onDocumentDrag.bind(this));
        $(document).on('mouseup touchend', this._onDocumentDrop.bind(this));
    }

    _onLeftScaleClick(scaleCode) {
        this._onScaleClick(scaleCode, 'rotate-left');
    }

    _onRightScaleClick(scaleCode) {
        this._onScaleClick(scaleCode, 'rotate-right');
    }

    _onScaleClick(scaleCode, rotationClassName) {
        const currentAnswerNode = this._getCurrentAnswerNode();
        if(!currentAnswerNode) {
            return;
        }
        currentAnswerNode.addClass(rotationClassName);
        this._question.setValue(this._getCurrentAnswerCode(), scaleCode);
    }

    _updateAnswerOtherNodes({otherValues = []}) {
        otherValues.forEach(answerCode => {
            const otherValue = this._question.otherValues[answerCode];
            this._setOtherNodeValue(answerCode, otherValue);
        });
    }

    _showAnswerError(validationResult) {
        let currentAnswerCode = this._getCurrentAnswerCode();
        if(!currentAnswerCode || validationResult.answerCode !== currentAnswerCode) {
            return;
        }
        let errorList = document.getElementById(`${this._question.id}_error_list`);
        let errorsCount = validationResult.errors.length;
        if(errorsCount > 0) {
            errorList.parentElement.classList.remove("cf-error-block--hidden");
            validationResult.errors.forEach(error => {
                    let errorItem = this._createErrorListItem(error.message);
                    errorList.appendChild(errorItem);
                }
            );
        }
    }

    _createErrorListItem(message) {
        let item = document.createElement('li');
        item.className += "cf-error-list__item";
        item.innerText = message;

        return item;
    }

    _moveAnswerStart(xCoord){
        const draggingNode = this._getDraggingAnswerNode();
        draggingNode.addClass('cf-tinder-grid-answer--dragging');
        this._draggingAnswerNodeOffset = this._getNodeMiddleCoordinate(draggingNode) - xCoord;
    }

    _moveAnswer(xCoord){
        const draggingNode = this._getDraggingAnswerNode();
        const answerListMiddle =  this._getNodeMiddleCoordinate(this._getAnswersNode());
        const distance = this._getAnswersNode().offset().left - answerListMiddle;
        const shift = this._getNodeMiddleCoordinate(draggingNode) - answerListMiddle;
        const opacity =  1;// - (Math.abs((shift/distance))); /to make transparent
        const deg = -(shift/distance) * 10;

        this._getDraggingAnswerNode().css({
            'transform': `translateX(${(xCoord - answerListMiddle + this._draggingAnswerNodeOffset).toFixed()}px) rotate(${deg}deg)`,
            'opacity': opacity
        });
        this._toggleCurrentlySelectedScale(xCoord);
    }

    _getSelectedScaleCode(shiftFromMiddleToSelect){
        shiftFromMiddleToSelect = shiftFromMiddleToSelect ?? this._getAnswersNode().width() / 3;
        const draggingNode = this._getDraggingAnswerNode();

        const answerListMiddle =  this._getNodeMiddleCoordinate(this._getAnswersNode());
        const shift = this._getNodeMiddleCoordinate(draggingNode) - answerListMiddle;

        let scaleCode = null;
        if(shift < -1 * shiftFromMiddleToSelect){
            scaleCode = this._question.scales[0].code;
        } else if(shift > shiftFromMiddleToSelect){
            scaleCode = this._question.scales[1].code;
        }

        return scaleCode;
    }

    _toggleCurrentlySelectedScale(){
        const selectedScaleCode = this._getSelectedScaleCode(5);
        this._question.scales.forEach(scale => {
            let scaleNode = this._getScaleNode(scale.code);
            this._setScaleStyle(scaleNode, scale.code === selectedScaleCode);
        });

        this._visualCues.toggleChosenScaleOnTop();
    }

    _setScaleStyle(scaleNode, isSelected) {
        scaleNode.toggleClass('cf-tinder-grid-scale--selected', isSelected);
        isSelected ? this._scalesComponent.applySelectedStylesToScale(scaleNode) : this._scalesComponent.applyNotSelectedStylesToScale(scaleNode);
    }

    _moveAnswerEnd(){
        const draggingNode = this._getDraggingAnswerNode();

        draggingNode.css({
            'transform': '',
            'opacity' : ''
        })
        draggingNode.removeClass('cf-tinder-grid-answer--dragging');
        const selectedScaleCode = this._getSelectedScaleCode();

        this._question.scales.forEach(scale => {
            let scaleNode = this._getScaleNode(scale.code);
            this._setScaleStyle(scaleNode, false);
        });

        this._visualCues.toggleChosenScaleOnTop();

        if(selectedScaleCode !== null){
            this._question.setValue(this._draggingAnswer.code, selectedScaleCode);
            draggingNode.addClass('hidden');
            //draggingNode.remove();
        }

        this._draggingAnswer = null;
        this._draggingAnswerNodeOffset = null;
    }

    _onAnswerDrag(event, answer) {
        event.stopPropagation();
        this._draggingAnswer = answer;

        this._moveAnswerStart(this._getXCoordinate(event), answer);
    }

    _onDocumentDrag(event){
        if (!this._draggingAnswer) {
            return;
        }

        this._moveAnswer(this._getXCoordinate(event));
    }

    _onDocumentDrop(event) {
        if (!this._draggingAnswer) {
            return;
        }

        if (event.cancelable) {
            event.stopPropagation();
        }

        event.preventDefault();

        this._moveAnswerEnd(this._getXCoordinate(event));
    }

    _onAnswerOtherNodeValueChange(answer, value) {
        this._question.setOtherValue(answer.code, value);
    }

    _updateScaleNodes(changes){
        const currentAnswer = this.answers[this._currentAnswerIndex];
        let scaleNode;
        if(!currentAnswer) {
            this._question.scales.forEach(scale => {
                scaleNode = this._getScaleNode(scale.code);
                this._setScaleStyle(scaleNode, false);
            });
            return;
        }

        this._question.scales.forEach(scale => {
            scaleNode = this._getScaleNode(scale.code);
            this._setScaleStyle(scaleNode, scale.code === this._question.values[currentAnswer.code]);
        });

        this._visualCues.toggleChosenScaleOnTop();
    }

    _updateAnswerNodes({values = []}){
        values.forEach(answerCode => {
            let currentIndex = this.answers.findIndex(answer => answerCode === answer.code);
            this._currentAnswerIndex = currentIndex + 1;
            if(currentIndex === this.answers.length - 1) {
                this._showFinalCard();
                this._question.scales.forEach(scale => {
                    this._getScaleNode(scale.code).addClass('hidden');
                });
                this._hideArrows();
            }
        });
    }

    _showFinalCard(){
        $(`#${this._question.id}_card-finish .cf-tinder-grid-card--finish__trigger`).toggleClass('draw');
    }

    _hideArrows() {
        $(".cf-tinder-grid__arrow-left").addClass('hidden');
        $(".cf-tinder-grid__arrow-right").addClass('hidden');
    }

    _onModelValueChange({changes}){
        this._updateAnswerNodes(changes);
        this._updateScaleNodes(changes);
        this._updateAnswerOtherNodes(changes);
    }
}