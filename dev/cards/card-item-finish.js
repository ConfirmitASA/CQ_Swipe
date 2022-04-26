import $ from 'jquery';

export default class CardItemFinish {

    constructor(question, customSettings) {
        this._question = question;
        this._height = customSettings.height;
        this._width = customSettings.width;
    }

    createNode() {
        let cardNode = $('<div></div>')
            .addClass('cf-tinder-grid-card cf-tinder-grid-card--finish')
            .attr('id', this._question.id + '_card-finish')
            .css('max-width', this._width + 'px')
            .css('max-height', this._height + 'px')

        const cardContent =
            '<div class="cf-tinder-grid-card--finish__trigger"></div>' +
            '<svg id="tick" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
            '\t viewBox="0 0 37 37" xml:space="preserve">\n' +
            '<path class="circle path" style="fill:none;stroke:#39A739;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10;" d="\n' +
            '\tM30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z"\n' +
            '\t/>\n' +
            '<polyline class="tick path" style="fill:none;stroke:#39A739;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10;" points="\n' +
            '\t11.6,20 15.9,24.2 26.4,13.8 "/>\n' +
            '</svg>';

        cardNode.html(cardContent);

        return cardNode;
    }
}