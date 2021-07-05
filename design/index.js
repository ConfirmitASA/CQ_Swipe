var answers;
var scales;

var answerImagesInputs;
var scalesPositionSelector = document.getElementById('scalesPosition');

function getInitSettings(customSettings, uiSettings, questionSettings, projectSettings) { //TODO: rename?
    answers = questionSettings.answers;
    scales = questionSettings.scales;

    if(scales.length > 2) {
        var warningBlock = document.querySelectorAll(".warning-block--scales-count")[0];
        warningBlock.classList.remove("hidden");
    }

    renderAnswerImageInputs();
    document.querySelectorAll(".image-input--answer").forEach((input) => {
        input.addEventListener("input", () => {
            loadImagePreview(input);
        });
    });

    answerImagesInputs = document.querySelectorAll('.image-input--answer');
    //console.log("on init");
}
customQuestion.onInit = getInitSettings;

function fireOnChangeEvent(checkboxElement) {
    if ("createEvent" in document) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        checkboxElement.dispatchEvent(evt);
    } else {
        checkboxElement.fireEvent("onchange");
    }
}

function setValues(settings) {
    const imageUrls = settings.answerImages.urls;
    answerImagesInputs.forEach((input) => {
        var pair = imageUrls.find(pair => pair.id === input.id);
        if(pair) {
            input.value = pair.url;
            loadImagePreview(input);
        }
    });

    scalesPositionSelector.value = settings.scales.position;
}
customQuestion.onSettingsReceived = setValues;

function saveChanges() {
    var imgURLs = [];

    answerImagesInputs.forEach((input) => {
        imgURLs.push({id: input.id, url: input.value});
    });

    debugger;
    var pos = scalesPositionSelector.options[scalesPositionSelector.selectedIndex].value;

    var settings = {
        answerImages: {
            urls: imgURLs
        },
        scales: {
            position: scalesPositionSelector.options[scalesPositionSelector.selectedIndex].value
        }
    };

    hasError = false;
    customQuestion.saveChanges(settings, hasError);
}
subscribeToSaveChanges();

function subscribeToSaveChanges() {
    var containers = Array.prototype.slice.call(document.querySelectorAll(".comd-panel"));
    for (var c = 0; c < containers.length; c++) {
        containers[c].addEventListener('input', saveChanges, true);
    }
}

function renderAnswerImageInputs() {
    var imageContainer = document.getElementById("imagesContainer");
    answers.forEach((answer) => {
        var imageContainerNode = createImageContainerNode(answer.code);
        imageContainer.insertAdjacentElement("beforeend", imageContainerNode);
    });
}

function createImageContainerNode(answerCode) {
    var container = document.createElement("div");
    container.className = "image-container";
    container.innerHTML = `${answerCode}: `;

    var imageURLInput = document.createElement("input");
    imageURLInput.id = `image_${answerCode}`;
    imageURLInput.className = "form-control input-sm form-input image-input image-input--answer";

    container.insertAdjacentElement("beforeend", imageURLInput);

    var imagePreview = document.createElement('img');
    imagePreview.className = "image-preview";

    container.insertAdjacentElement("beforeend", imagePreview);

    return container;
}

function loadImagePreview(inputElement) {
    const inputURL = inputElement.value;

    if(inputURL === "") {
        return;
    }

    const previewContainer = document.querySelector("#" + inputElement.id + " + img");
    previewContainer.setAttribute("src", inputURL);
}


