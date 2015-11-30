//弹出chrome通知
function showNotification(opt) {
    var notification = chrome.notifications.create(status.toString(), opt, function(notifyId) {
        return notifyId
    });
    setTimeout(function() {
        chrome.notifications.clear(status.toString(), function() {});
    }, 5000);
}

function getOption(key) {
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, defaultOptions[key]);
    }
    return localStorage.getItem(key);
}

function setOption(key,value) {
    localStorage.setItem(key, value);
    updateAll();
    return true;
}

function updateAll() {
    notifyAllTabs({
        command: "update"
    });
}

function notifyAllTabs(message) {
    chrome.windows.getAll({
        populate: true
    }, function(wins) {
        wins.forEach(function(win) {
            win.tabs.forEach(function(tab) {
                chrome.tabs.sendMessage(tab.id, message);
            });
        });
    });
}
