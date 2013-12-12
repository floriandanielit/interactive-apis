
function extractJSON(urlsource, iapiid, call) {
    console.log("start extractJSON");
    var idObect = {};
    var datas = new Array();
    chrome.extension.sendMessage({ "type": "loadExternal", "url": urlsource }, function (data) {
        var values;
        if (data.error === undefined) {
            values = JSON.parse(data.data);
            //console.log("dataJSON: " + data.data);
        } else {
            //console.log("errorJSON: " + data.error.statusText);
            call("ERROR:" + data.error.statusText);
        }

        $.each(values, function (key, value) {
            $.each(value, function (key, value) {
                //console.log("key:[" + key + "] value:[" + value + "]");



            });
        });

        call("done");
    });
}
