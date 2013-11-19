
// ICON MANAGEMENT BASED ON iAPI PRESENCE IN SELECTED TAB

var iAPIPresence = new Array();	// iAPIPresence[tab.id] tells whether the respective tab contains iAPIs ("yes") or not ("no")
var disable = true;   //initial state of the extension "Off"

// sets the correct icon based on the presence of iAPIs in the current tab
function setIcon(tabId) {
 //   console.log("disable: " + disablebilita);
    if (disable === true) {
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
    else if (msg.type === "extension_status") {

        sendResponse({ 'disable': this.disable });   // send the extension status to the script
    }
    



});
/*
// React when a browser action's icon is clicked (whether the extension is On or Off  )
chrome.browserAction.onClicked.addListener(function(){
    changeStatusExtension();
    chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
        ScriptJs(tabs[0].id);//enable the script to all pages
        setIcon(tabs[0].id);//set the relative icon of the current tab (red/green) or black if disable

    });
});*/
//React when a tab is updated
chrome.tabs.onUpdated.addListener(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        ScriptJs(tabs[0].id);

    });
    
});

//React when a new tab is created
chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        ScriptJs(tabs[0].id);

    });
});

//background open a new tab (used in popup.js)
function openTab(url) {
   chrome.tabs.create({ url: url });
}


//React when change a focus from one windows to another
chrome.windows.onFocusChanged.addListener(function()
{
    chrome.tabs.query({ active:true,currentWindow:true}, function(tabs){

        ScriptJs(tabs[0].id);

    });
});


// React when active a new tab 
chrome.tabs.onActivated.addListener(function (activeInfo) {

    ScriptJs(activeInfo.tabId);
   
});

//change the state of the extension
function changeStatusExtension() {
    if (this.disable == true) {
        this.disable = false;
    } else {
        this.disable = true;
    }

}

//inject or remove the script based on the extension state
function ScriptJs(tabId){

        if (disable === false) {

            chrome.tabs.executeScript(tabId,{file:'libgen.js'},function(){
            chrome.tabs.executeScript(tabId, { file: 'script.js' }, function () {
                console.log('Successfully injected script into the page');
            });
            });

    } else {
        chrome.tabs.executeScript(tabId, { file: 'lib/jquery-2.0.3.js' }, function () {

            chrome.tabs.executeScript(tabId, { code: "$(document).ready(function(){ $('div[id=iapi_frame]').remove(); }   );" }, function () {

                console.log('Successfully deleted script from the page');
            });
       });
    }
    setIcon(tabId);
}

