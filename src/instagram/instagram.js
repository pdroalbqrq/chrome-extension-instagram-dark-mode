chrome.storage.sync.get("activated", function (val) {
    const newValue = val.activated;
    chrome.runtime.sendMessage(newValue, () => {});
});
