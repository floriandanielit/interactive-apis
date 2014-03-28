//Extract Data from JSON file
function extractJSON(data, iapiid, idPage, call) {
    var idObject = {};
    var datas = new Array();
    var values;

    if (data.error === undefined) {
        values = JSON.parse(data);
    } else {
          call("ERROR:" + data.error.statusText);
    }

    $.each(values, function (key, value) {
        var dataatribute = {};
        $.each(value, function (key, value) {
            dataatribute[key] = value;
        });
        var dataitem = {};
        dataitem[key] = dataatribute;
        datas.push(dataitem);
    });

    var pass_data = {

        'id': iapiid,
        'value': datas
    };

    call(JSON.stringify(pass_data));
}