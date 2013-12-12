
function extractRSS(urlsource, iapiid, call) {
    console.log("start extractRSS");
    var idObect = {};
    var datas = new Array();
    chrome.extension.sendMessage({ "type": "loadExternal", "url": urlsource }, function (data) {
        if (data.error === undefined) {
            //console.log("dataRSS: " + data.data);
        } else {
            //console.log("errorRSS: " + data.error.statusText);
            call("ERROR:" + data.error.statusText);
        }







        call("done");
    });

}
