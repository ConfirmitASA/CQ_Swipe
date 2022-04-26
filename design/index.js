import CardsSettingsTab from "../dev/design-tabs/cards-settings-tab";
import ScalesSettingsTab from "../dev/design-tabs/scales-settings-tab";
import VisualCuesSettingsTab from "../dev/design-tabs/visual-cues-settings-tab";

let cardsSettingsTab;
let scalesSettingsTab;
let visualCuesSettingsTab;

function onInit(customSettings, uiSettings, questionSettings, projectSettings) {
    let cards = questionSettings.answers;
    let scales = questionSettings.scales;

    cardsSettingsTab = new CardsSettingsTab(cards);
    scalesSettingsTab = new ScalesSettingsTab(scales, saveChanges);
    visualCuesSettingsTab = new VisualCuesSettingsTab();
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

    if(settings.hasOwnProperty('visualCues')) {
        visualCuesSettingsTab.setValues(settings.visualCues);
    }
}
customQuestion.onSettingsReceived = setValues;

function saveChanges() {
    let settings = {};
    settings.cards = cardsSettingsTab.getValues();
    settings.scales = scalesSettingsTab.getValues();
    settings.visualCues = visualCuesSettingsTab.getValues();

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
