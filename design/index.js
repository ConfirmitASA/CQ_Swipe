import CardsSettingsTab from "../dev/design-tabs/cards-settings-tab";
import ScalesSettingsTab from "../dev/design-tabs/scales-settings-tab";

let cardsSettingsTab;
let scalesSettingsTab;

function onInit(customSettings, uiSettings, questionSettings, projectSettings) {
    let cards = questionSettings.answers;
    let scales = questionSettings.scales;

    cardsSettingsTab = new CardsSettingsTab(cards);
    scalesSettingsTab = new ScalesSettingsTab(scales, saveChanges);
}
customQuestion.onInit = onInit;

function setValues(settings) {
    if (!settings) return;

    if(settings.hasOwnProperty('cards')) {
        cardsSettingsTab.setValues(settings.cards);
    }

    if(settings.hasOwnProperty('scales')) {
        scalesSettingsTab.setValues(settings.scales);
    }
}
customQuestion.onSettingsReceived = setValues;

function saveChanges() {
    let settings = {};

    settings.cards = cardsSettingsTab.getValues();
    settings.scales = scalesSettingsTab.getValues();

    let hasError = false;
    customQuestion.saveChanges(settings, hasError);
}
subscribeToSaveChanges();

function subscribeToSaveChanges() {
    var containers = Array.prototype.slice.call(document.querySelectorAll(".comd-panel"));
    for (var c = 0; c < containers.length; c++) {
        containers[c].addEventListener('input', saveChanges, true);
    }
}
