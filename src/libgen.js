
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

function generateIAPI(urlsource, iapiid, id) {
    $.get(urlsource, function (data) {

        var element = $("<Div>" + data + "</Div>").find('#' + iapiid, '.iapi'); // select the source

        template = $('#' + id);  // select the template

        tagtmp = template.prop('tagName');
        //console.log(tagtmp);

        // var txt=$("#1").html();

        // console.log($("#1").html());
        if (tagtmp === "TABLE") {
            var txt = "";
            $.each(element, function (i, row) {


                var YourFindElement2 = $(this).children();
                var ts = template.children();

                var tmp = ts.children('[class*=data]');

                $.each(YourFindElement2, function (j, rowValue) {

                    tmp.prop('id', j);
                    var YourFindElement3 = $(this).children();
                    tmpChild = tmp.children();

                    $(YourFindElement3).each(function (i, rowValue) {

                        $(tmpChild).eq(i).html(YourFindElement3[i].innerHTML);

                    });

                    //   console.log("E un table"+$(ts).html());
                    txt = txt.concat($('#' + j)[0].outerHTML);
                    //console.log($('#' + j)[0].outerHTML, j);

                });
                $(template).append(txt);

                //  console.log(txt);

            });
        }

        else if (tagtmp === "DIV") {
            var txt = "";

            $.each(element, function (i, row) {

                var YourFindElement2 = $(this).children();
                var tmp = template.children();   // the ul tag

                // var tmp=ts.children('[class*=data]');

                $.each(YourFindElement2, function (j, rowValue) {

                    tmp.prop('id', j);    // give each ul (publication) an ID
                    var YourFindElement3 = $(this).children();
                    tmpChild = tmp.children();   // the li

                    $(YourFindElement3).each(function (i, rowValue) {

                        $(tmpChild).eq(i).html(YourFindElement3[i].innerHTML);

                    });

                    txt = txt.concat($(template).html());


                });
                //console.log(txt);
                $(template).html(txt);

            });
        }
    });
}

function generateJSON(urlsource, html) {
    console.log("inizio generateJSON");
    chrome.extension.sendMessage({ "type": "loadJSON", "url": urlsource }, function (data) {
        //var data = JSON.parse(ret);

        
        console.log(typeof data);
        
        console.log(data);

        console.log("dataJSON: " + data.errorJSON);
        
    });

    
    
}

function generateRSS(urlsource, html) {

    console.log("urlsource " + urlsource);
    console.log("html " + html.html());

}

function generateXML(urlsource, html) {

    console.log("urlsource " + urlsource);
    console.log("html " + html.html());

}

function middlewareAction(msg,id, callback) {
    var messageReturn = "done";
    console.log("LIBGEN:message:" + msg + " id:" + id);

    callback(messageReturn);
}