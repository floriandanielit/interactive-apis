
//// EXTENSION ACTIVATION/DISACTIVATION

var extensionDisabled = true;   // initial state of the extension is disabled

// Enable/disable the extension: called from popup.js
function changeExtensionStatus() {
	
    extensionDisabled = !extensionDisabled;
    
}




//// ICON MANAGEMENT BASED ON iAPI PRESENCE IN SELECTED TAB

var iAPIPresence = new Array();	// iAPIPresence[tab.id] tells whether the respective tab contains iAPIs ("yes") or not ("no")


// set the correct icon based on the presence of iAPIs in the current tab
function setIcon(tabId) {
 //   console.log("disable: " + disablebilita);
    if (extensionDisabled === true) {
        chrome.browserAction.setIcon({ "path": "img/icon_black.png" ,"tabId": tabId});
    }
    else {
        if (iAPIPresence[tabId] === "yes")
            chrome.browserAction.setIcon({ "path": "img/icon_green.png", "tabId": tabId });
        else
            chrome.browserAction.setIcon({ "path": "img/icon_red.png", "tabId": tabId });
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
    else if (msg.type === "extension_status")
        sendResponse({ 'disable': this.extensionDisabled });   // send the extension status to the script
    
});


// Setup of event listeners for icon management

// React when a new tab is created
chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {
	
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        ScriptJs(tabs[0].id);
    });
    
});

// React when a tab is updated
chrome.tabs.onUpdated.addListener(function () {
	
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        ScriptJs(tabs[0].id);
    });
    
});

// React when changing tab 
chrome.tabs.onActivated.addListener(function (activeInfo) {

    ScriptJs(activeInfo.tabId);
   
});

// React when changing browser window
chrome.windows.onFocusChanged.addListener(function()
{
    chrome.tabs.query({ active:true,currentWindow:true}, function(tabs){
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
function ScriptJs(tabId){

    if (extensionDisabled === false) {

        chrome.tabs.executeScript(tabId,{file:'libgen.js'},function(){
            chrome.tabs.executeScript(tabId, { file: 'script.js' }, function () {
                 console.log('Successfully injected script into the page');
            });
        });

    } else {
        chrome.tabs.executeScript(tabId, { file: 'lib/jquery-2.0.3.js' }, function () {
            chrome.tabs.executeScript(tabId, { code: "$(document).ready(function(){ $('div[id=iapi_frame]').remove(); } );" }, function () {
                console.log('Successfully deleted script from the page');
            });
       });
    }
    setIcon(tabId);
}

