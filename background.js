const urlDark = "?theme=dark";
var myUrl = "instagram.com";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ activated: true });
    toggleInstagramTheme();
});

chrome.webNavigation.onBeforeNavigate.addListener(async (data) => {
    console.log(data);
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.pendingUrl && tab.pendingUrl.includes(myUrl)) {
        toggleInstagramTheme(false);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendMessage) => {
    toggleInstagramTheme(true);
    return true;
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
            if (tabs[i].url && tabs[i].url.includes(myUrl)) {
                checkTab(tabs[i]);
            }
        }
        return;
    }
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log(tab);
    checkTab({ id: tab.id, url: tab.pendingUrl });
}

function checkTab(tab) {
    console.log(tab);
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
    false: (isDark = false, tab) => {
        const url = tab.url.replace(urlDark, "");
        chrome.tabs.update(tab.id, { url });
    },
};
