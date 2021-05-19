document.addEventListener('DOMContentLoaded', subscribeCheckboxesHideSubsectionOnchange);

function subscribeCheckboxesHideSubsectionOnchange() {
    let imagesAsAnswersCheckbox = document.getElementById("answerImagesEnabled");

    let checkboxes = [imagesAsAnswersCheckbox];

    checkboxes.forEach(function (box) {
        if(box) {
            box.addEventListener("change", function () {
                hideSubsectionAfterBoxChecked(box);
            })
        }
    })
}

function hideSubsectionAfterBoxChecked(checkboxElement) {
    debugger;
    let section = findParentOfClass(checkboxElement, "node-properties-key-fields");
    let subsection;
    try{
        subsection = section.querySelectorAll(".node-property__sub-content")[0];
    }
    catch (e) {
        console.log("Could not find section sub-content (.node-property__sub-content)");
        return;
    }

    if (checkboxElement.checked) {
        subsection.classList.remove("hidden");
    } else {
        subsection.classList.add("hidden");
    }
}

function findParentOfClass(element, className) {
    let parent = element.parentElement;

    while(parent.className.indexOf(className) < 0) {
        parent = parent.parentElement;
    }

    return parent;
}