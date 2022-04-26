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

    toggleChosenScaleOnTop() {
        if(!this.settings.visualCues.enableChosenScaleOnTop) {
            return;
        }
        const container = document.querySelector('.cf-tinder-grid__current-scale');
        let imageElement = container.querySelector('i');
        let selectedScaleImage = document.querySelector('.cf-tinder-grid-scale--selected .scale__image');
        if(!!selectedScaleImage) {
            container.classList.remove('hidden');

            let startIndex = selectedScaleImage.id.indexOf('-') + 1;
            imageElement.className = 'current-scale__image fa';
            imageElement.classList.add('fa-' + selectedScaleImage.id.substring(startIndex));

            if(selectedScaleImage.id.indexOf('left') !== -1) {
                imageElement.style.color = this.settings.scales.imageTypeSettings.left.selectedIconColor;
            } else {
                imageElement.style.color = this.settings.scales.imageTypeSettings.right.selectedIconColor;
            }
        } else {
            container.classList.add('hidden');
        }
    }
}
