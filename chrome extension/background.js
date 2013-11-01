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
if(localStorage["icon"]=="logo_gray.png"){
localStorage["icon"]="logo_red.png";
}
else if(localStorage["icon"]=="logo_red.png"||localStorage["icon"]=="logo_green.png"){
localStorage["icon"]="logo_gray.png";
}
chrome.browserAction.setIcon({"path":localStorage["icon"]});
});


//Funzione che cambia il colore dell'icona se ci sono iApi nella pagina o no (riceve i messaggi dagli script)
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg.color == 'green') {
    localStorage["icon"]="logo_green.png";
	chrome.browserAction.setIcon({"path":localStorage["icon"]});
  }
else if(msg.color=='red'){
 localStorage["icon"]="logo_red.png";
 chrome.browserAction.setIcon({"path":localStorage["icon"]});
}
chrome.extension.onRequest.addListener(onRequest);


});



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

