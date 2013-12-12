function extractIAPI(iapiid, urlsource, call) {


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

        call(datas);

        idObject[iapiid] = datas;  //iapiid,data :each datas is associated with the id
    });
    //localStorage(urlsource,idObect);   //  persist the data extracted of each iapi target !
}