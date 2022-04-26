export default class ScaleItemBase {
    constructor(question, settings) {
        this.question = question;

        this.usedScales = this.question.scales.slice(0, 2);
        this.scalesPosition = settings.position;
        this.type = settings.type;
    }

    _getScaleId = (scale) => `${this.question.id}_scale_${scale.code}`;
    _getScaleTextId = (scale) => `${this.question.id}_scale_${scale.code}_text`;
    _getScaleNode(scaleCode){
        if(!scaleCode) {
            console.log("Could not get ScalesComponent Node - scale code is undefined.");
            return;
        }
        let scaleNode = $(`#${this.question.id}_scale_${scaleCode}`);
        if(!scaleNode) {
            console.log(`Could not get Scale Node with code ${scaleCode}`);
            return;
        }

        return scaleNode;
    }
    _getLeftScaleNode() {
        return this._getScaleNode(this.usedScales[0].code);
    }
    _getRightScaleNode() {
        return this._getScaleNode(this.usedScales[1].code);
    }
    _getScaleNodes() {
        let result = [];
        for (const usedScale of this.usedScales) {
            result.push(this._getScaleNode(usedScale.code));
        }
        return result;
    }

    createScales() {
        const leftScale = this.usedScales[0];
        const rightScale = this.usedScales[1];
        let scaleContainer_Left = this._createScaleContainerElement(leftScale, 'left');
        let scaleContainer_Right = this._createScaleContainerElement(rightScale, 'right');

        scaleContainer_Left.append(this._createScaleContent(leftScale, 'left'));
        scaleContainer_Right.append(this._createScaleContent(rightScale, 'right'));

        const scales = {
            'left': scaleContainer_Left,
            'right': scaleContainer_Right
        };

        return scales;
    }

    applyNotSelectedStyles() {
        for (const scaleNode of this._getScaleNodes()) {
            this.applyNotSelectedStylesToScale(scaleNode);
        }
    }

    applyNotSelectedStylesToScale(scaleNode) {
        throw new Error('Method not implemented.');
    }

    applySelectedStylesToScale(scaleNode) {
        throw new Error('Method not implemented.');
    }

    attachHoverHandlers = () => {
        for (let scaleNode of this._getScaleNodes()) {
            scaleNode.hover(
                () => {
                    scaleNode.addClass('cf-tinder-grid-scale--selected');
                    this.applySelectedStylesToScale(scaleNode);
                },
                () => {
                    scaleNode.removeClass('cf-tinder-grid-scale--selected');
                    this.applyNotSelectedStylesToScale(scaleNode);
                });
        }
    }

    _createScaleContainerElement = (scale, position) => {
        let selected = "";
        const values = Object.entries(this.question.values);
        if(values[0] !== undefined && values[0][1] === scale.code){
            selected = "cf-tinder-grid-scale--selected";
        }

        let scaleContainer = $('<div></div>')
            .addClass(`cf-tinder-grid-scale ${selected} scale-${this.type} scale-${position}`)
            .attr('id', this._getScaleId(scale));

        return scaleContainer;
    }

    _createScaleContent(scale, position) {
        throw new Error('Method not implemented.');
    }
}