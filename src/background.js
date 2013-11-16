
// ICON MANAGEMENT BASED ON iAPI PRESENCE IN SELECTED TAB

var iAPIPresence = new Array();	// iAPIPresence[tab.id] tells whether the respective tab contains iAPIs ("yes") or not ("no")
var disabilita = true;
// sets the correct icon based on the presence of iAPIs in the current tab
function setIcon(tabId) {
    if (disabilita == true) {
        chrome.browserAction.setIcon({ "path": "img/icon_black.png" });
    }
    else {
        if (iAPIPresence[tabId] == "yes")
            chrome.browserAction.setIcon({ "path": "img/icon_green.png" });
        else
            chrome.browserAction.setIcon({ "path": "img/icon_red.png" });
    }
    console.log("DISABLE: " + disabilita);
}

// listen for messages communicating iAPI presence info
chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {

    if (msg.type == "iAPI presence") {
        if (sender.tab != undefined) {
            console.log("aggiunta tab a vettore");
            iAPIPresence[sender.tab.id] = msg.presence;	// memorize presence
            setIcon(sender.tab.id); // set icon accordingly	
        }
    }
    else if (msg.type == "extension_status") {
        sendResponse({ 'disabilita': disabilita });
    }
    



});

//background open a new page (used in popup.js)
function openTab(url) {
    console.log("masdkamskm");
        chrome.tabs.create({ url: url });
}

chrome.tabs.onActivated.addListener(function (activeInfo) {


    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
        if (disabilita == false) {
            console.log("sendscript");
            chrome.tabs.executeScript(tabs[0].id, {  file: 'script.js' }, function () {
                    console.log('Successfully injected script into the page');
                });
        }
        setIcon(tabs[0].id);
    });
});

function changeStatusExtension() {
    if (disabilita == true) {
        disabilita = false;
    } else {
        disabilita = true;
    }

}

function sendAllScript() {

    console.log("Disable2: " + disabilita);
    if (disabilita == false) {
        console.log("sendscript");
        chrome.tabs.executeScript(null, { allFrames: true, file: 'script.js' }, function () {
            console.log('Successfully injected script into the page');
        });
    }
}

//Funzione che utilizzo per ricavarmi alcuni parametri dagli URL
function getUrlVars(url) {

    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        if (vars[key]) {
            if (vars[key] instanceof Array) {
                vars[key].push(value);
            } else {
                vars[key] = [vars[key], value];
            }
        } else {
            vars[key] = value;
        }
    });
    return vars;

}

