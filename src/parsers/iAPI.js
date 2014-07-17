
//Extract Data from the markeup based on the iapi annotation
function extractIAPI(iapiid, urlsource, id, idPage, call) {
    var idObject = {};
    var datas = new Array();

    //array contains objects representing the extracted data
    $.get(urlsource, function (data) {
        var template = $("<div>" + data + "</div>").find('#' + iapiid);
        var dataItem = template.find("[class*='dataitem:']");

        $.each(dataItem, function (j, rowValue) {
            var dataAttri = $(this).find("[class*='dataattribute:']");
            var dataatribute = {};

            $.each(dataAttri, function (i, rowValue) {
                dataatribute[$(this).attr("class").substr(14)] = $(this).html();
            });

            var dataitem = {};
            dataitem[$(this).attr("class").substr(9)] = dataatribute;
            datas.push(dataitem);
        });

        var pass_data = {
            'id': id,
            'value': datas
        };
           
        call(JSON.stringify(pass_data));
    });
}
