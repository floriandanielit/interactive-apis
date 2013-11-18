
// ICON MANAGEMENT BASED ON iAPI PRESENCE IN SELECTED TAB

var iAPIPresence = new Array();	// iAPIPresence[tab.id] tells whether the respective tab contains iAPIs ("yes") or not ("no")
var disabilita = true;
// sets the correct icon based on the presence of iAPIs in the current tab
function setIcon(tabId) {
    console.log("DISABLE: " + disabilita);
    if (disabilita == true) {
        chrome.browserAction.setIcon({ "path": "img/icon_black.png" });
    }
    else {
        if (iAPIPresence[tabId] == "yes")
            chrome.browserAction.setIcon({ "path": "img/icon_green.png" });
        else
            chrome.browserAction.setIcon({ "path": "img/icon_red.png" });
    }

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
        console.log("send response"+disabilita);
        sendResponse({ 'disa': this.disabilita });
    }
    



});

//background open a new page (used in popup.js)
function openTab(url) {
   chrome.tabs.create({ url: url });
}


chrome.windows.onFocusChanged.addListener(function()
{
    chrome.tabs.query({ index:0,currentWindow:true}, function(ctab){
            setIcon(ctab.id);
        if (disabilita == false) {
            console.log("before" + disabilita);
            if (disabilita == false) {
                console.log("sendscript");
                chrome.tabs.executeScript(ctab.id, { file: 'script.js' }, function () {
                    console.log('Successfully injected script into the page');
                });
            }
        } else {
            chrome.tabs.executeScript(ctab.id, { file: "lib/jquery-2.0.3.js" }, function () {

                chrome.tabs.executeScript(ctab.id, { code: "$(document).ready(function(){ $('#iapi_frame').remove(); }   );" }, function () {
                    console.log('Successfully deleted script from the page');
                });
            });
        }
        setIcon(ctab.id);

    });
});




chrome.tabs.onActivated.addListener(function (activeInfo) {

    if (disabilita == false) {
        console.log("before" + disabilita);
        if (disabilita == false) {
            console.log("sendscript");
            chrome.tabs.executeScript(activeInfo.tabId, { file: 'script.js' }, function () {
                console.log('Successfully injected script into the page');
            });
        }
    } else {
        chrome.tabs.executeScript(activeInfo.tabId, { file: "lib/jquery-2.0.3.js" }, function () {

            chrome.tabs.executeScript(activeInfo.tabId, { code: "$(document).ready(function(){ $('#iapi_frame').remove();});" }, function () {
                console.log('Successfully deleted script from the page');
            });
        });
    }
        setIcon(activeInfo.tabId);
   
});

function changeStatusExtension() {
    if (this.disabilita == true) {
        this.disabilita = false;
    } else {
        this.disabilita = true;
    }

}

function sendAllScript() {

  //  console.log("Disable2: " + this.disabilita);
    if (disabilita == false) {
        console.log("sendscript");
        chrome.tabs.executeScript(null, {file: "lib/jquery-2.0.3.js"}, function(){
        chrome.tabs.executeScript(null,{file:"libgen.js"},function(){
        chrome.tabs.executeScript(null, { allFrames: true, file: 'script.js' }, function () {
            console.log('Successfully injected script into the page');
        });
        });
        });
    }
    else{
        chrome.tabs.executeScript(null, {file: "lib/jquery-2.0.3.js"}, function(){

        chrome.tabs.executeScript(null, { allFrames: true, code: "$(document).ready(function(){ $('#iapi_frame').remove();});" }, function () {
             console.log('Successfully deleted script from the page');
        });
        });
    }
    console.log("i am back to popoup");
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

