// initialize the extension state, Editor state
var extensionDisabled = true;
var iApiLayerDisabled = true;

// Enable/disable the extension
function changeExtensionStatus() {
	extensionDisabled = !extensionDisabled;
}

// Enable/disable the iApiLayer
function changeIApiLayerStatus(tabId) {
	if (iApiLayerDisabled === true) {
		scriptiapiLayerPresence[tabId] = "yes";
	} else
		scriptiapiLayerPresence[tabId] = "no";
	iApiLayerDisabled = !iApiLayerDisabled;
}

//// ICON MANAGEMENT BASED ON iAPI PRESENCE IN SELECTED TAB

// iAPIPresence[tab.id] tells whether the respective tab contains iAPIs ("yes") or not ("no")
var iAPIPresence = new Array();

// scriptPresence[tab.id] tells whether the respective tab contains the inject script
var scriptPresence = new Array();

// scriptPresence[tab.id] tells whether the respective tab contains the inject script
var scriptiapiLayerPresence = new Array();

// set the correct icon based on the presence of iAPIs in the current tab
function setIcon(tabId) {
	if (extensionDisabled === true) {
		chrome.browserAction.setIcon({
			"path" : "img/icon_black.png",
			"tabId" : tabId
		});
		scriptPresence[tabId] = "no";
		scriptiapiLayerPresence[tabId] = "no";
	} else {
		if (iAPIPresence[tabId] === "yes") {
			chrome.browserAction.setIcon({
				"path" : "img/icon_green.png",
				"tabId" : tabId
			});
			scriptPresence[tabId] = "yes";
		} else {
			chrome.browserAction.setIcon({
				"path" : "img/icon_red.png",
				"tabId" : tabId
			});
			scriptPresence[tabId] = "no";
			scriptiapiLayerPresence[tabId] = "no";
		}
	}

}

// listener for messages from the scriptEngine (Chrome Messages)
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

	if (msg.type === "iAPI presence") {
		if (sender.tab != undefined) {

			iAPIPresence[sender.tab.id] = msg.presence;
			setIcon(sender.tab.id);
		}
	} else if (msg.type === "extension_status") {
		// send the extension status to the scriptEngine
		sendResponse({
			'disable' : this.extensionDisabled,
			'IApiLayerStatus' : this.iApiLayerDisabled
		});
	} else if (msg.type === "requestPageId") {
		// send the current page id
		chrome.tabs.query({
			active : true,
			currentWindow : true
		}, function(tabs) {
			sendResponse(tabs[0].id);
		});
		return true;

	}
    else if (msg.type === "updateStoredData") {
        // load the Stord object
        var idTarget =msg.value.idTarget;
        var pageId=msg.value.pageId;
        var data=msg.value.data;

        var prewItems = {};

        prewItems[idTarget] = msg.value.data;

        localStorage.setItem(pageId, JSON.stringify(prewItems));
        sendResponse(localStorage.getItem(pageId));
        return true;
    }
	else if (msg.type === "getStoredObject") {
		// load the Stord object
		getStoredObject(sender.tab.id, function(data) {
			sendResponse(data);
		});

		return true;
	} else if (msg.type === "getExternal") {
		// load an external(HTML, JSON)
        console.log("load");
		loadExternal(msg.value, function(data) {
			sendResponse(data);
		});

		return true;
	} else if (msg.type === "StoreTemplate") {
		// store the DOM object
		chrome.tabs.query({
			active : true,
			currentWindow : true
		}, function(tabs) {
			var prewItems;
			var TempObject = {};
			prewItems = JSON.parse(localStorage.getItem(tabs[0].url));

			if (prewItems !== null) {
				prewItems[msg.value.idTemp] = msg.value.value;
				localStorage.setItem(tabs[0].url, JSON.stringify(prewItems));
			} else {
				TempObject[msg.value.idTemp] = msg.value.value;
				localStorage.setItem(tabs[0].url, JSON.stringify(TempObject));
			}
		});

		return true;
	} else if (msg.type === "getStoredTemplate") {
		// load the DOM object
		chrome.tabs.query({
			active : true,
			currentWindow : true
		}, function(tabs) {
			getStoredTemplate(tabs[0].url, function(data) {
				sendResponse(data);
			});
		});

		return true;
	} else if (msg.type === "Extract") {
		// Get the extract data and save in the localStorage the object
		if (msg.value.sourceType.toLowerCase() === "iapi") {
			extractIAPI(msg.value.iapiid, msg.value.urlsource, msg.value.idTarget, msg.value.pageId, function(data) {
				var prewItems;
				var idObject = {};
				prewItems = JSON.parse(localStorage.getItem(sender.tab.id));

				if (prewItems !== null) {
					prewItems[JSON.parse(data).id] = JSON.parse(data).value;
					localStorage.setItem(sender.tab.id, JSON.stringify(prewItems));
				} else {

					idObject[JSON.parse(data).id] = JSON.parse(data).value;
					localStorage.setItem(sender.tab.id, JSON.stringify(idObject));
				}

				sendResponse(data);
			});
		} else if (msg.value.sourceType.toLowerCase() === "json") {
			// extract data from JSON file then store it
		    loadExtern(msg.value.urlsource, function (data) {
		        extractJSON(data, msg.value.idTarget, msg.value.pageId, function(data) {
					var prewItems;
					var idObject = {};
					prewItems = JSON.parse(localStorage.getItem(sender.tab.id));

					if (prewItems !== null) {
						prewItems[JSON.parse(data).id] = JSON.parse(data).value;
						localStorage.setItem(sender.tab.id, JSON.stringify(prewItems));
					} else {
						idObject[JSON.parse(data).id] = JSON.parse(data).value;
						localStorage.setItem(sender.tab.id, JSON.stringify(idObject));
					}
                    console.log("done extraction");

					sendResponse(data);
				});
			});
		}
		return true;
	}
    else if (msg.type === "Extract_Data") {
        // Get the extract data and save in the localStorage the object
        console.log(msg.value.sourceType.toLowerCase());
        if (msg.value.sourceType.toLowerCase() === "iapi") {
            loadExternal(msg.value.url,function(data){
            extractIAPI(msg.value.idTarget, data,msg.value.obj, function(data) {
                var prewItems;
                var idObject = {};
                prewItems = JSON.parse(localStorage.getItem(sender.tab.id));

                if (prewItems !== null) {
                    prewItems[JSON.parse(data).id] = JSON.parse(data).value;
                    localStorage.setItem(sender.tab.id, JSON.stringify(prewItems));
                } else {

                    idObject[JSON.parse(data).id] = JSON.parse(data).value;
                    localStorage.setItem(sender.tab.id, JSON.stringify(idObject));
                }

                sendResponse(data);
            });
            });
        }
        else if (msg.value.sourceType.toLowerCase() === "json") {
            // extract data from JSON file then store it
            loadExternal(msg.value.url, function (data) {
                extractJSON (msg.value.idTarget,data, msg.value.obj, function(data) {
                    var prewItems;
                    var idObject = {};
                    prewItems = JSON.parse(localStorage.getItem(sender.tab.id));

                    if (prewItems !== null) {
                        prewItems[JSON.parse(data).id] = JSON.parse(data).value;
                        localStorage.setItem(sender.tab.id, JSON.stringify(prewItems));
                    } else {
                        idObject[JSON.parse(data).id] = JSON.parse(data).value;
                        localStorage.setItem(sender.tab.id, JSON.stringify(idObject));
                    }

                    console.log("done extraction");

                    sendResponse(data);
                });
            });
        }
        return true;
    }
});

// load the DOM object
function getStoredTemplate(arg_name, call) {
	data = localStorage.getItem(arg_name);
	call(data);
}

// GET the stored object
function getStoredObject(arg_name, call) {
	data = localStorage.getItem(arg_name);
	call(data);
}

//load a external page with different domain
function loadExternal(path, success, error) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
		    if (xhr.status === 200) {
		        console.log("Confirmed");
				success(xhr.responseText);
			} else {
			    console.log("Error");
				error(xhr);
			}
		}
	};
	xhr.open("GET", path, true);
	xhr.send();
}

// Setup event listeners for icon management
// React when a new tab is created
chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {

	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		ScriptJs(tabs[0].id);
	});
});

// React when a tab is updated
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (changeInfo.status == "complete") {

		scriptPresence[tabId] = "no";
		if (scriptiapiLayerPresence[tabId] === undefined)
			scriptiapiLayerPresence[tabId] = "no";
		ScriptJs(tabId);
	}
});

// React when changing tab
chrome.tabs.onActivated.addListener(function() {

	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		ScriptJs(tabs[0].id);
	});
});

// React when changing browser window
chrome.windows.onFocusChanged.addListener(function() {

	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		ScriptJs(tabs[0].id);
	});
});

//// MANAGEMENT OF OPTION PAGE

// background open a new tab (used in popup.js)
function openTab(url) {
	chrome.tabs.create({
		url : url
	});
}

//// INJECTION/DELETION OF CONTENT SCRIPT INTO/FROM CURRENT PAGE

// inject or remove the script based on the extension state
function ScriptJs(tabId) {

	if (!iApiLayerDisabled) {
		scriptiapiLayerPresence[tabId] === "yes";
		chrome.tabs.executeScript(tabId, {
			file : 'editor.js'
		});
	}
	if (iApiLayerDisabled) {
		chrome.tabs.executeScript(tabId, {
			code : "iapi_frame = document.getElementById('iapi_frame'); if(iapi_frame){iapi_frame.parentNode.removeChild(iapi_frame);}"
		});
	}
	if (extensionDisabled === false && scriptPresence[tabId] === "no") {
		chrome.tabs.executeScript(tabId, {
			file : 'jQuery.js'
		}, function() {
			chrome.tabs.executeScript(tabId, {
				file : 'ContentEngine.js'
			});
		});
	}
	if (extensionDisabled === true && scriptPresence[tabId] === "yes") {
		chrome.tabs.executeScript(tabId, {
			code : "iapi_frame = document.getElementById('iapi_frame'); if(iapi_frame){iapi_frame.parentNode.removeChild(iapi_frame);}"
		});
	}

	setIcon(tabId);
}

// Carbage collector : clear the localStorage associated with the Tab
chrome.tabs.onRemoved.addListener(function(tabId, info) {
	chrome.tabs.get(tabId, function(tab) {
		localStorage.removeItem(tabId);
	});
});

