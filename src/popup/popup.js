toggleTheme.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleActivated,
    });
});

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
