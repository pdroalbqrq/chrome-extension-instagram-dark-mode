const urlDark = "?theme=dark";
var myUrl = "instagram.com";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ activated: true });
    toggleInstagramTheme();
});

chrome.runtime.onMessage.addListener((message, sender, sendMessage) => {
    if (message == "popup") {
        toggleInstagramTheme(true);
        return sendMessage(message);
    }
    toggleInstagramTheme(false);
});

chrome.tabs.onCreated.addListener(function (tab) {
    if (tab.pendingUrl.includes(myUrl)) {
        const newTab = { id: tab.id, url: tab.pendingUrl };
        checkTab(newTab);
    }
});

async function toggleInstagramTheme(all) {
    if (all) {
        const tabs = await chrome.tabs.query({});
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].url.includes(myUrl)) {
                checkTab(tabs[i]);
            }
        }
        return;
    }
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    checkTab(tab);
}

function checkTab(tab) {
    const isDark = tab.url.includes(urlDark);
    chrome.storage.sync.get("activated", function (val) {
        mappedTheme[val.activated](isDark, tab);
    });
}

const mappedTheme = {
    true: (isDark, tab) => {
        if (!isDark) {
            const url = tab.url + urlDark;
            chrome.tabs.update(tab.id, { url });
        }
    },
    false: (isDark, tab) => {
        if (isDark) {
            const url = tab.url.replace(urlDark, "");
            chrome.tabs.update(tab.id, { url });
        }
    },
};
