//Extract Data from JSON file
function extractJSON(idTarget, data, obj, call) {
    var idObject = {};
    var datas = new Array();
    var values;


    if (data.error === undefined) {
        values = JSON.parse(data);
    } else {
          call("ERROR:" + data.error.statusText);
    }

    for(var keyobj in obj) {

        if (obj.hasOwnProperty(keyobj)) {

            $.each(values, function (key, value) {
                var dataatribute = {};
                var i=0;
                $.each(value, function (key, value) {
                    $.each(obj[Object.keys(obj)[1]],function(key2,value2){

                    if(value2 === key)  dataatribute[obj[Object.keys(obj)[0]][key2]] = value;

                 });
                });
                var dataitem = {};
                dataitem[keyobj] = dataatribute;
                //console.log(dataitem[keyobj]);
                datas.push(dataitem);
            });
        }
    }

    var object={};
    object["publications"]=datas;
    var pass_data = {
        'id':idTarget,
        'value':object
    };

  /*  var pass_data = {

        'id': iapiid,
        'value': datas
    };
*/
    call(JSON.stringify(pass_data));
}