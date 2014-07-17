
//Extract Data from the markeup based on the iapi annotation
function extractIAPI(idTarget, data, obj, call) {

    var idObject = {};
    var datas = new Array();

    //array contains objects representing the extracted data
        var template = $("<div>" + data + "</div>").find('#' + idTarget);

        var classAttr = $(template).attr("class").split(" ");
        for (var i = 0; i < classAttr.length; i++) {
            if (classAttr[i].slice(0, 7) === ("e-data:"))
                var edata = classAttr[i].substr(7);
        }



        for(var key in obj){

            if(obj.hasOwnProperty(key)) {

                var dataItem = template.find("[class*='e-item:']");

                $.each(dataItem, function (j, rowValue) {
                    var dataAttri = $(this).find("[class*='p-attr:']");
                    var dataatribute = {};
                    $.each(dataAttri, function (i, rowValue) {
                         dataatribute[obj[Object.keys(obj)[0]][i]] = $(this).html();
                    });

                    var dataitem = {};
                    dataitem[key] = dataatribute;
                    datas.push(dataitem);

                });


            }
        }

         var object={};
         object[edata]=datas;
         var pass_data = {
             'id':idTarget,
              'value':object
         };

    call(JSON.stringify(pass_data));

}
