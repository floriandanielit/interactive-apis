function extractIAPI(iapiid, urlsource,id,idPage, call) {

    var idObject = {};

    var datas = new Array();  //array contains objects representing the extracted data
    $.get(urlsource, function (data) {
        var template = $("<div>" + data + "</div>").find('#' + iapiid);   //source template

        var dataItem = template.find("[class*='dataitem:']");


        $.each(dataItem, function (j, rowValue) {
            //   var cla=pubs.attr("class").substr(9);
            var dataAttri = $(this).find("[class*='dataattribute:']");

            var dataatribute = {};
            $.each(dataAttri, function (i, rowValue) {
                dataatribute[$(this).attr("class").substr(14)] = $(this).html();
            });

            var dataitem = {};
            dataitem[$(this).attr("class").substr(9)] = dataatribute;
            datas.push(dataitem);


        });
        
        
            var prewItems;
            prewItems = JSON.parse(localStorage.getItem(idPage));

            if (prewItems !== null) {
                prewItems[id] = datas;
                localStorage.setItem(idPage, JSON.stringify(prewItems));

            }
            else {
                idObject[id] = datas;  //iapiid,data :each datas is associated with the id
                localStorage.setItem(idPage, JSON.stringify(idObject));

            }

            call();        
    });
    
}
