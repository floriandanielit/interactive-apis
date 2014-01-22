
function extractJSON(urlsource, iapiid, call) {
    console.log("start extractJSON");
    var idObject = {};
    var datas = new Array();
    chrome.extension.sendMessage({ "type": "loadExternal", "url": urlsource }, function (data) {
        var values;
        if (data.error === undefined) {
            values = JSON.parse(data.data);
      //      console.log("dataJSON: " + data.data);
        } else {
            console.log("errorJSON: " + data.error.statusText);
            call("ERROR:" + data.error.statusText);
        }

        $.each(values, function (key, value) {
            var dataatribute = {};
            $.each(value, function (key, value) {

                dataatribute[key]=value;
         //       console.log("key:[" + key + "] ");
            });
            var dataitem = {};
            dataitem[key] = dataatribute;
            datas.push(dataitem);

        });

        req(function (idPage) {

            prewItems = JSON.parse(localStorage.getItem(idPage));

            if (prewItems !== null) {
                prewItems[iapiid] = datas;
                localStorage.setItem(idPage, JSON.stringify(prewItems));

            }
            else {
                idObject[iapiid] = datas;  //iapiid,data :each datas is associated with the id
                localStorage.setItem(idPage, JSON.stringify(idObject));

            }
            
            call();
        });



    });
}

function req(call){
    chrome.extension.sendMessage({ "type": "requestPageId" }, function (idPage) {
        console.log("page ID:   "+idPage);
        call(idPage);
    });
}