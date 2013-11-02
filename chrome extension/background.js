
// ICON MANAGEMENT BASED ON iAPI PRESENCE IN SELECTED TAB

var iAPIPresence = new Array();	// iAPIPresence[tab.id] tells whether the respective tab contains iAPIs ("yes") or not ("no")

// sets the correct icon based on the presence of iAPIs in the current tab
function setIcon(tabId) {
	
	if (iAPIPresence[tabId] == "yes")
 		chrome.browserAction.setIcon({"path":"icon_green.png"});
 	else
 	 	chrome.browserAction.setIcon({"path":"icon_red.png"});

}

// listen for messages communicating iAPI presence info
chrome.extension.onMessage.addListener(function(msg,sender,sendResponse) {

	if (msg.type == "iAPI presence") {
		iAPIPresence[sender.tab.id] = msg.presence;	// memorize presence
		setIcon(sender.tab.id); // set icon accordingly	
	}
 	 	
});

// update icon upon tab change
chrome.tabs.onActivated.addListener( function(activeInfo) { setIcon(activeInfo.tabId); } ); 










/*chrome.browserAction.onClicked.addListener(function(tab) {
chrome.browserAction.setIcon({path:"icogray.gif"});
});
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg.color == 'green') {
    chrome.browserAction.setIcon({path:"icogreen.gif"});
  }
else if(msg.color=='red'){
 chrome.browserAction.setIcon({path:"icored.gif"});
}
});
*/
//Funzione per far cambiare l'icona in caso di click su di essa
chrome.browserAction.onClicked.addListener(function(tab) {
if(localStorage["icon"]=="icon_black.png"){
localStorage["icon"]="icon_red.png";
}
else if(localStorage["icon"]=="icon_red.png"||localStorage["icon"]=="icon_green.png"){
localStorage["icon"]="icon_black.png";
}
chrome.browserAction.setIcon({"path":localStorage["icon"]});
});







/*
//Funzione che cambia il colore dell'icona se ci sono iApi nella pagina o no (riceve i messaggi dagli script)
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg.color == 'green') {
    localStorage["icon"]="icon_green.png";
	chrome.browserAction.setIcon({"path":localStorage["icon"]});
  }
else if(msg.color=='red'){
 localStorage["icon"]="icon_red.png";
 chrome.browserAction.setIcon({"path":localStorage["icon"]});
}
chrome.extension.onRequest.addListener(onRequest);


});
*/



chrome.extension.onRequest.addListener(onRequest);



//Funzione che utilizzavo per bloccare la richiesta alla pagina (inutile nel caso il drag&drop funzioni
chrome.webRequest.onBeforeRequest.addListener(
    function(details) { 
	


chrome.tabs.get(details.tabId, function (tab) { 
source=getUrlVars(details.url)["iapisource"];
id=getUrlVars(details.url)["iapiid"];
localStorage["redirectUrl"]=tab.url+"?iapisource="+source+"&iapiid="+id;

//source=extension.getBackgroundPage.getUrlVars(details.url)[iapisource];
//alert(source);
//id=getUrlVars(details.url)[iapiid];
//redirectUrl=tab.url+"?iapisource="+source+"&iapiid="+id;
//alert(redirectUrl);

alert("Per avere questa iApi inserisci nella classe del target: \"iapi source:"+source+" iapiid:"+id+"\"");
});
        return {cancel:true};
		
    },
    // block requests matching this url
    {urls: ["*://*/*iapisource*iapiid*"]},
    ["blocking"]
);







//Funzione che utilizzo per ricavarmi alcuni parametri dagli URL
function getUrlVars(url) {

                var vars = {};
                var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                    if(vars[key]){
                        if(vars[key] instanceof Array){
                            vars[key].push(value);
                        }else{
                            vars[key] = [vars[key], value];
                        }
                    }else{
                        vars[key] = value;
                    }
                });
                return vars;
				
            }

