const storageKey = "activated";
let toggleState;
const toggle = document.getElementById("toggleTheme"),
    title = document.getElementById("theme-title");

document.addEventListener("DOMContentLoaded", function (event) {
    chrome.storage.sync.get([storageKey], async function (result) {
        toggle.checked = result[storageKey];
        changeThemeText(result[storageKey]);
        await toggleClick();
    });
});

function toggleClick() {
    toggle.addEventListener("click", async (e) => {
        changeThemeText(toggle.checked);
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: toggleActivated,
        });
    });
}

function changeThemeText(state) {
    title.innerText = `Tema Escuro ${state ? "Ativado" : "Desativado"}`;
}

function toggleActivated() {
    chrome.storage.sync.get("activated", function (val) {
        const newValue = val.activated;
        chrome.storage.sync.set({ activated: !newValue });
        chrome.runtime.sendMessage("popup", () => {
            if (chrome.runtime.lastError) {
                setTimeout(toggleActivated, 500);
            }
        });
    });
}
