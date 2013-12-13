
//Questa funzione serve a generare dinamicamente il codice del menu che compare al passaggio del mouse sopra una iApi
function getActions(iapiclass, iapiid){

codeactions="";
codeactions = codeactions.concat('<a class="getAll" id=' + iapiid + ' draggable="true" ondragstart="drag(event,document.URL)" href="?iapisource="+window.location.href+"&iapiid="+iapiid+"" style="color:white">Use data</a> <br/>');
var classes=iapiclass.split(" ");
for(i=0;i<classes.length;i++){
if(classes[i].slice(0,4)==("rss:")){
codeactions=codeactions.concat('<a href="#" style="color:white">getRss</a> \n');
}
}
$("div[class~=iapiactions]").html(codeactions);
}

//Bidimensional target (Div,Table .. ) 
function generate(data, idTemplate) {


    template = $('#' + idTemplate);  // select the template


    var txt = "";
    $.each(data, function (key, value) {

        var subtemplate = template.find('[class*=data]');  //get the dataitem

        $.each(value, function (key, value) {

            //   subtemplate.prop('id',key);    //set an Id for the current..

            var tmpChild = subtemplate.children();

            var i = 0;  // counter dipends on the object element (dataattribute of each dataitem)
            for (var j = 0 ; j < 3; j++) {
                console.log($(tmpChild).eq(j).html());
                $(tmpChild).eq(j).html(function () {

                    for (var key in value) {

                        if ($(tmpChild).eq(j).attr("class").substr(14) === key)
                            return value[key];
                    }
                });
            }
            i++;
            txt = txt.concat($(subtemplate)[0].outerHTML);
        });

    });
    template.find('[class*=data]').remove();
    $(template).append(txt);


}

function middlewareAction(msg,id, callback) {
    var messageReturn = "done";
    console.log("LIBGEN:message:" + msg + " id:" + id);

    callback(messageReturn);
}