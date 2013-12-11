
//// EXTENSION ACTIVATION/DISACTIVATION

var extensionDisabled = true;   // initial state of the extension is disabled

// Enable/disable the extension: called from popup.js
function changeExtensionStatus() {

    extensionDisabled = !extensionDisabled;

}




//// ICON MANAGEMENT BASED ON iAPI PRESENCE IN SELECTED TAB

var iAPIPresence = new Array();	// iAPIPresence[tab.id] tells whether the respective tab contains iAPIs ("yes") or not ("no")
var scriptPresence = new Array();

// set the correct icon based on the presence of iAPIs in the current tab
function setIcon(tabId) {
    //   console.log("disable: " + disablebilita);
    if (extensionDisabled === true) {
        chrome.browserAction.setIcon({ "path": "img/icon_black.png", "tabId": tabId });
        scriptPresence[tabId] = "no";
    }
    else {
        if (iAPIPresence[tabId] === "yes") {
            chrome.browserAction.setIcon({ "path": "img/icon_green.png", "tabId": tabId });
            scriptPresence[tabId] = "yes";
        }
        else {
            chrome.browserAction.setIcon({ "path": "img/icon_red.png", "tabId": tabId });
            scriptPresence[tabId] = "no";
        }
    }

}

// listen for messages communicating iAPI presence info
chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {

    if (msg.type === "iAPI presence") {
        if (sender.tab != undefined) {
            iAPIPresence[sender.tab.id] = msg.presence;	// memorize presence
            setIcon(sender.tab.id); // set icon accordingly	
        }
    }
    else if (msg.type === "extension_status") {
        sendResponse({ 'disable': this.extensionDisabled });   // send the extension status to the script
    } else if (msg.type === "loadJSON") {
        console.log("url:" + msg.url);

        
        
        loadJSON(msg.url,
                 function (data) {
                     sendResponse({ "dataJSON": data });
                 },
                 function (xhr) {
                     sendResponse({ "errorJSON": xhr });
                 }
        );
        return true;
    }
});


function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                success(JSON.parse(xhr.responseText));
            } else {
                error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

// Setup of event listeners for icon management

// React when a new tab is created
chrome.tabs.onCreated.addListener(function (tabId, changeInfo, tab) {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        ScriptJs(tabs[0].id);
    });

});

// React when a tab is updated
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //var url=tab.url;
    if (changeInfo.status == "complete") {
        // alert(changeInfo.url);
        scriptPresence[tabId] = "no";
        ScriptJs(tabId);
    }

});

// React when changing tab
chrome.tabs.onActivated.addListener(function () {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

        ScriptJs(tabs[0].id);
    });
});

// React when changing browser window
chrome.windows.onFocusChanged.addListener(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        ScriptJs(tabs[0].id);
    });

});

//// MANAGEMENT OF OPTION PAGE

//background open a new tab (used in popup.js)
function openTab(url) {
    chrome.tabs.create({ url: url });
}

//// INJECTION/DELETION OF CONTENT SCRIPT INTO/FROM CURRENT PAGE

//inject or remove the script based on the extension state


function ScriptJs(tabId) {


    if (extensionDisabled === false && scriptPresence[tabId] === "no") {

        chrome.tabs.executeScript(tabId, { file: 'jQuery.js' }, function () {
            chrome.tabs.executeScript(tabId, { file: 'libgen.js' }, function () {
                chrome.tabs.executeScript(tabId, { file: 'script.js' }, function () {


                    console.log('Successfully injected script into the page' + scriptPresence[tabId] + tabId);

                });
            });
        });
    } if (extensionDisabled === true && scriptPresence[tabId] === "yes") {


        chrome.tabs.executeScript(tabId, { code: "iapi_frame = document.getElementById('iapi_frame'); if(iapi_frame){iapi_frame.parentNode.removeChild(iapi_frame);}" }, function () {



            console.log('Successfully deleted from the page' + scriptPresence[tabId] + tabId);
        });
    }
    setIcon(tabId);
}

