const QuestionWithAnswersView = Confirmit.pageView.questionViewTypes.QuestionWithAnswersView;

export default class TinderSwipe extends QuestionWithAnswersView {
    constructor(question) {
        super(question);
        this._draggingAnswer = null;
        this._draggingAnswerNodeOffset = null;
        this._answerList = this._container.find('.cf-tinder-grid__answers');
        this._currentAnswerIndex = 0;
        this._init();
    }

    _getAnswerId(answer) {
        if(!answer) {
            console.log("Could not get Answer ID - answer is undefined.");
            return;
        }
        return `${this._question.id}_${answer.code}`;
    }

    _getScaleNode(scaleCode){
        if(!scaleCode) {
            console.log("Could not get Scale Node - scale code is undefined.");
            return;
        }
        return this._container.find(`#${this._question.id}_scale_${scaleCode}`);
    }

    _getCurrentAnswerNode() {
        if(this._currentAnswerIndex >= this.answers.length) {
            return null;
        }
        const currentAnswer = this.answers[this._currentAnswerIndex];
        const currentAnswerNode = $('#' + this._getAnswerId(currentAnswer));

        return currentAnswerNode;
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

    _init(){
        this._attachHandlersToDom();
    }

    _attachHandlersToDom(){
        this.answers.forEach(answer => {
            this._getAnswerNode(answer.code).on('mousedown touchstart', e => this._onAnswerDrag(e, answer));
            this._getAnswerOtherNode(answer.code)
                .on('input', e => this._onAnswerOtherNodeValueChange(answer, e.target.value))
                .on('mousedown', e => e.stopPropagation())
                .on('touchstart', e => e.stopPropagation());
        });

        //TODO: only need this block to run if scales are set to work as buttons in custom settings
        const usedScales = this._question.scales.slice(0, 2);
        this._getScaleNode(usedScales[0].code).on('click', () => this._onLeftScaleClick());
        this._getScaleNode(usedScales[1].code).on('click', () => this._onRightScaleClick());
        this._question.scales.forEach(scale => {
            const scaleNode = this._getScaleNode(scale.code);
            scaleNode.hover(
                () => { scaleNode.addClass('cf-tinder-grid-scale--selected');
                        scaleNode[0].style.cursor = "pointer"; },
                () => {scaleNode.removeClass('cf-tinder-grid-scale--selected')});
        });

        $(document).on('mousemove touchmove', this._onDocumentDrag.bind(this));
        $(document).on('mouseup touchend', this._onDocumentDrop.bind(this));
    }

    _onScaleClick(scale, rotationClassName) {
        const currentAnswerNode = this._getCurrentAnswerNode();
        if(!currentAnswerNode) {
            return;
        }
        currentAnswerNode.addClass(rotationClassName).delay(700).fadeOut(1);
        this._currentAnswerIndex++;
    }

    _onLeftScaleClick(scale) {
        this._onScaleClick(scale, 'rotate-left');
    }

    _onRightScaleClick(scale) {
        this._onScaleClick(scale, 'rotate-right');
    }

    _updateAnswerOtherNodes({otherValues = []}) {
        otherValues.forEach(answerCode => {
            const otherValue = this._question.otherValues[answerCode];
            this._setOtherNodeValue(answerCode, otherValue);
        });
    }

    _showAnswerError(validationResult) {
    }

    _moveAnswerStart(xCoord){
        const draggingNode = this._getDraggingAnswerNode();
        draggingNode.addClass('cf-tinder-grid-answer--dragging');
        this._draggingAnswerNodeOffset = this._getNodeMiddleCoordinate(draggingNode) - xCoord;
    }

    _moveAnswer(xCoord){
        const draggingNode = this._getDraggingAnswerNode();

        const answerListMiddle =  this._getNodeMiddleCoordinate(this._answerList);
        const distance = this._answerList.offset().left - answerListMiddle;
        const shift = this._getNodeMiddleCoordinate(draggingNode) - answerListMiddle;
        const opacity =  1 - (Math.abs((shift/distance)));
        const deg = -(shift/distance)* 10;

        this._getDraggingAnswerNode().css({
            'transform': `translateX(${(xCoord - answerListMiddle + this._draggingAnswerNodeOffset).toFixed()}px) rotate(${deg}deg)`,
            'opacity': opacity
        });
        this._toggleActiveScaleClass(xCoord);
    }

    _getSelectedScaleCode(xCoord){
        const part = this._answerList.width() / 3;
        const offset = this._answerList.offset().left;
        let scaleCode = null;
        if(xCoord < (offset + part) ){
            scaleCode = this._question.scales[0].code;
        } else if(xCoord > (offset + (part*2))){
            scaleCode = this._question.scales[1].code;
        }

        return scaleCode;
    }

    _toggleActiveScaleClass(xCoord){
        const selectedScaleCode = this._getSelectedScaleCode(xCoord);
        this._question.scales.forEach(scale => {
            this._getScaleNode(scale.code).toggleClass('cf-tinder-grid-scale--selected', scale.code === selectedScaleCode);
        })
    }

    _moveAnswerEnd(xCoord){
        const draggingNode = this._getDraggingAnswerNode();

        draggingNode.css({
            'transform': '',
            'opacity' : ''
        })
        draggingNode.removeClass('cf-tinder-grid-answer--dragging');
        const selectedScaleCode = this._getSelectedScaleCode(xCoord);

        if(selectedScaleCode !== null){
            this._question.setValue(this._draggingAnswer.code, selectedScaleCode);
            //this._answerList.prepend(draggingNode);
            draggingNode.remove();
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
        if(!currentAnswer) {
            this._question.scales.forEach(scale => {
                this._getScaleNode(scale.code).removeClass('cf-tinder-grid-scale--selected');
            });
            return;
        }
        this._question.scales.forEach(scale => {
            this._getScaleNode(scale.code).toggleClass('cf-tinder-grid-scale--selected', scale.code === this._question.values[currentAnswer.code]);
        });
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
            }

            // if(currentIndex === this.answers.length - 1) {
            //     this._currentAnswerIndex = 0;
            //     this._showFinalCard();
            // }
            // else {
            //     this._currentAnswerIndex = currentIndex + 1;
            // }

            // [
            //     ...this.answers.slice(this._currentAnswerIndex, this.answers.length),
            //     ... this.answers.slice(0, this._currentAnswerIndex)
            // ].forEach(answer => {
            //     this._answerList.prepend(this._getAnswerNode(answer.code));
            // })
        });
    }

    _showFinalCard(){
        $(".cf-tinder-grid-card-finish__trigger").toggleClass("draw");
    }

    _onModelValueChange({changes}){
        this._updateAnswerNodes(changes);
        this._updateScaleNodes(changes);
        this._updateAnswerOtherNodes(changes);
    }
}