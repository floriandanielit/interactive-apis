var idtarget="";
var code = "";

function allowDrop(ev)
{
    ev.preventDefault();
    idtarget=ev.target.id;
//ev.dataTransfer.setData("idtarget",idtarget);
    console.log(idtarget);
    ev.target.className = "over";
}

//Funzione per definire cosa fare in caso di drag(non funziona)
function drag(ev,source)
{

    ev.dataTransfer.setData("source", source);
    ev.dataTransfer.setData("tagsource", $("#"+ev.target.id).prop("tagName"))
    ev.dataTransfer.setData("id", ev.target.id);
    hasIdTemplate(ev.target.id,function(msg){
        if(msg !=="NOIDTEMPLATE")
            ev.dataTransfer.setData("idtemplate", msg);
        else
            ev.dataTransfer.setData("idtemplate", msg);
    });
    
}

function hasIdTemplate(id, call)
{

    var yourFindElement = $("#"+id);
    var items = $(yourFindElement).find("[class*='dataitem:']")
    var elementsItem = $(items).attr("class").split(" ");
    var presenceIdtemplate=false;
    var idTemplate;
    for (var i = 0; i < elementsItem.length && presenceIdtemplate === false; i++) {
        if (elementsItem[i].substr(0, 11) === "idTemplate:")
        {
            idTemplate = elementsItem[i].substr(11);
            presenceIdtemplate = true;
        }
    }
    if (presenceIdtemplate === true) {
        call(idTemplate);
    }
    else
    {
        call("NOIDTEMPLATE");
    }

}

function leave(ev)
{
    ev.target.className = "";
}

//Funzione per definire cosa fare in caso di drop(non funziona)
function drop(ev)
{

    if (ev.dataTransfer) {
        ev.preventDefault();

        ev.target.className = "";
        ///NEW
        var idsource = ev.dataTransfer.getData("id");
        var tagsource = ev.dataTransfer.getData("tagsource");
        var source = ev.dataTransfer.getData("source");
        var idTemplate;
        if (ev.dataTransfer.getData("idtemplate") !== "NOIDTEMPLATE")
        {
            idTemplate = ev.dataTransfer.getData("idtemplate");
        }
        console.log("idsource [" + idsource + "] + tagsource [" + tagsource + "] + source [" + source + "] + idtemplate [" + idTemplate + "]");

        
        console.log("IAPI PRESENCE");
        loadAndInjectTemplate(idTemplate, ev.target.id, tagsource, function (ret) {

                compileTemplate(source, idsource, ret, ev.target.id, function (ret2) {
                    console.log("ret2:" + ret2);

                    console.log("SCRIPTTOINJECT.JS:finish_inject_template the DOM");

                    /*     sendMessageMiddleware("finish_inject_template", ev.target.id, function (ret) {
                             console.log("finish_inject_template: " + ret);
                         });*/
                });
        });
        

    }
    else {
        alert("Your browser does not support the dataTransfer object.");
    }
}

function createTagiAPI(call) {

    call("done create tag iAPI");
}

function loadaaaaTemplate() {


}


function loadAndInjectTemplate(idTemplate, idTarget, tagsource, callback) {

    /*
    $.get(chrome.extension.getURL('html/templates.html'), function (data) {
        var template = $("<div>" + data + "</div>").find('#' + idTemplate);   //source template
        var tmp = $(template).parent().prop("tagName");
        if (tmp.toLowerCase() === "tbody")//table -tbody
            tmp = $(tmp).parent().prop("tagName");
        
            sendMessageMiddleware("formatting", id, function (ret) {
                console.log("formatting: " + ret);
            });  
    }); */

    /*
    if (idTemplate !== undefined)
    {
        $('#' + idTarget).load('../src/html/templates.html #'+idTemplate, function (ret) {
            var subtemplate3 = $("<div>" + ret + "</div>").find("#"+idTemplate);
        });

    }
    else
    {
        $('#' + idTarget).load('Template.html table', function (ret) {

            var subtemplate3 = $("<div>" + ret + "</div>").find("#2D");
            //console.log("il template e :"+subtemplate3);
           
            callback(subtemplate3);  //load and return the template to process it
        });


        //var urlTemplates = chrome.extension.getURL("html/templates.js");

    }   */
}

function compileTemplate(source, idsource, ret, idtarget, callback) {

    $.fn.replaceTag = function (newTagObj, keepProps) {
        $this = this;
        var i, len, $result = jQuery([]), $newTagObj = $(newTagObj);
        len = $this.length;
        for (i = 0; i < len; i++) {
            $currentElem = $this.eq(i);
            currentElem = $currentElem[0];
            $newTag = $newTagObj.clone();
            if (keepProps) {//{{{
                newTag = $newTag[0];
                newTag.className = currentElem.className;
                $.extend(newTag.classList, currentElem.classList);
                $.extend(newTag.attributes, currentElem.attributes);

            }//}}}
            $newTag.html(currentElem.innerHTML).replaceAll($currentElem);
            $result.pushStack($newTag);
        }

        return this;
    }

    $("#" + idtarget).replaceTag("<" + parentnode + ">", true);
    $(parentnode).attr("id", idtarget);
    $(parentnode).html(template.parent().html());
}

//send a message to Middleware and wait a response
//TODO
function sendMessageMiddleware(action, id, call) {
    console.log("call liben.js");
        middlewareAction(action, id, function (ret) {
            console.log("return from liben.js+ message:"+ret);
            call(ret);
        });
}

//OLD FUNCTIONS
//call parseSRC or parseTRG
function getAttributeTags(iapiid, call) {
    var YourFindElement = $(".iapi").filter("#" + iapiid).get();

    $.each(YourFindElement, function (i, rowValue) {
        var tagtarg = $(this).attr("class").split(" ");

        var presenceDataSource=false;
        var t;
        for (i = 0; i < tagtarg.length; i++) {
            if (tagtarg[i].slice(0, 11) == ("datasource:")) {
                presenceDataSource=true;
            }
        }
        if (presenceDataSource === true) {
            //console.log("\nYES (presence DataSource)\n");
            parseTRG(YourFindElement, iapiid,function (ret) {
                call(ret);
            });
        }
        else {
            //console.log("\nNO(no presence DataSource)\n");
            parseSRC(YourFindElement, iapiid,function (ret) {
                call( ret);
            });
        }
    });

}

//get datasource,iapiid,sourcetype
function parseSRC(YourFindElement,id, callback) {
    //console.log("PARSE_SRC");
    $.each(YourFindElement, function (i, rowValue) {
        var tagtarg = $(this).attr("class").split(" ");
        var id = $(this).attr('id');

        var urlsource;
        var iapiid;
        var sourcetype;
        var arrayHideElements = new Array();

        for (i = 0; i < tagtarg.length; i++) {
            if (tagtarg[i].slice(0, 5) == ("json:")) {
                sourcetype = tagtarg[i].substr(0, 4);
                urlsource = tagtarg[i].substr(5);
            }
            else if (tagtarg[i].slice(0, 4) == ("rss:")) {
                sourcetype = tagtarg[i].substr(0, 3);
                urlsource = tagtarg[i].substr(4);
            }
            else if (tagtarg[i].slice(0, 4) == ("xml:")) {
                sourcetype = tagtarg[i].substr(0, 3);
                urlsource = tagtarg[i].substr(4);
            }
            else if (tagtarg[i].slice(0, 5) == ("hide:")) {//hide:Author:Title:Where
                var hideElements = tagtarg[i].substr(5).split(":");//Author Title Where
                for (var j = 0; j < hideElements.length; j++) {
                    arrayHideElements.push(hideElements[j]);
                }
            }
        }
        if (sourcetype === undefined)
            sourcetype = "iapi";

        ///DEBUG
        //if (urlsource != undefined)
        //    console.log("url:" + urlsource);

        var retCommon = parseCommon(id, sourcetype);
        var ret = {"url":urlsource,"type":sourcetype,"iapiid":iapiid,"hide":arrayHideElements,"other":retCommon};

        callback(ret);
    });

}

//get datasource,iapiid,sourcetype
function parseTRG(YourFindElement, id, callback) {
    //console.log("PARSE_TRG");

    $.each(YourFindElement, function (i, rowValue) {
        var tagtarg = $(this).attr("class").split(" ");
        var id = $(this).attr('id');

        var urlsource;
        var sourcetype;
        var iapiid;
        var arrayHideElements = new Array();


        for (i = 0; i < tagtarg.length; i++) {
            if (tagtarg[i].slice(0, 11) == ("datasource:")) {
                urlsource = tagtarg[i].substr(11);
            }
            else if (tagtarg[i].slice(0, 7) == ("iapiid:")) {
                iapiid = tagtarg[i].substr(7);
            }
            else if (tagtarg[i].slice(0, 11) == ("sourcetype:")) {
                sourcetype = tagtarg[i].substr(11);
            }
            else if (tagtarg[i].slice(0, 5) == ("hide:")) {//hide:Author:Title:Where
                var hideElements = tagtarg[i].substr(5).split(":");//Author Title Where
                for (var j = 0; j < hideElements.length; j++) {
                    arrayHideElements.push(hideElements[j]);
                }
            }

        }
        if (sourcetype === "iapi" && iapiid === undefined) {
            console.log("ERROR: you must declare iapiid");
            console.log("TODO");
            //TODO
        }

        ///DEBUG
        //if (urlsource != undefined)
        //    console.log("url:" + urlsource);
        //if (iapiid != undefined)
        //    console.log("iapiid:" + iapiid);


        var retCommon = parseCommon(id, sourcetype);
        var ret = { "url": urlsource, "type": sourcetype, "iapiid": iapiid, "hide": arrayHideElements, "other": retCommon };

        callback(ret);
    });


}

//get iapitemplate (true/false),dataitems[labe][key] and dataattributes[labe][key]
function parseCommon(id,sourcetype) {

    var YourFindElement2 = $(".iapi").filter("#" + id);

    dataattribute = new Array();
    iapitemplate = false;
    var dataitem;
    var YourFindElement3 = YourFindElement2.find("[class*='dataitem:']").attr("class").split(" ");//first().html();
    for (i = 0; i < YourFindElement3.length; i++) {
        if (YourFindElement3[i] === "iapitemplate") {
            iapitemplate = true;
        }
        else if (YourFindElement3[i].slice(0, 9) == "dataitem:") {
            var temp2 = YourFindElement3[i].substr(9);//Publication:pubs or //Publication
            if (sourcetype != "iapi") {
                var n = temp2.indexOf(":");//Publication:pubs
                if (n !== -1) {
                    var a = temp2.substr(0, n);//Publication
                    var b = temp2.substr(n + 1);//pubs

                    if (a === "" || b === "") {
                        console.log("ERROR");
                    }
                    dataitem = ({ "type": YourFindElement3[i].slice(0, 8), "label": a, "key": b });
                } else {//Publication
                    var a = temp2.substr(0);

                    if (a === "" ) {
                        console.log("ERROR");
                    }
                    dataitem = ({ "type": YourFindElement3[i].slice(0, 8), "label": a});
                }

            }
            else {//Publication
                dataitem = ({ "type": YourFindElement3[i].slice(0, 8), "label": temp2 });

            }
        }
    }
    var YourFindElement5 = YourFindElement2.find("[class*='dataitem:']");
    var YourFindElement4 = YourFindElement5.first().children("[class*='dataattribute:']");
    $.each(YourFindElement4, function (i, rowValue) {


        if ($(this).attr("class").slice(0, 14) == ("dataattribute:")) {

            var temp = $(this).attr("class").substr(14);//Author:auth or //Author

            if (sourcetype != "iapi") {
                var n = temp.indexOf(":");//Author:auth
                var a = temp.substr(0, n);//Author
                var b = temp.substr(n + 1);//auth


                if (a == "" || b == "") {
                    console.log("ERROR");
                }
                dataattribute.push({ "type": $(this).attr("class").substr(0, 13), "label": a, "key": b });
            }
            else {//Author
                dataattribute.push({ "type": $(this).attr("class").substr(0, 13), "label": temp });
            }
        }
        //console.log("elem ->:" + dataattribute[i].type);


    });
    return {"iapitemplate":iapitemplate,"dataitem":dataitem,"dataattribute":dataattribute};
}

//DEBUG stamp my object
//
//"url",
//"type",
//"iapiid",
//"other":
//       "iapitemplate",
//       "dataitem":"type","label","key"
//       "dataattribute":"type","label","key"
function stampMyObj(ret) {
    console.log("url->" + ret.url);
    console.log("type->" + ret.type);
    console.log("iapiid->" + ret.iapiid);
    if (ret.hide.length !== 0) {
        var txt = "";
        console.log("hide:");
        for (var i = 0; i < ret.hide.length; i++) {
            if (i === 0)
                txt+="\t" + ret.hide[i];
            else
                txt+=" - " + ret.hide[i];
        }
        console.log(txt);
    }
    console.log("other:");
    console.log("\t iapitemplate->" + ret.other.iapitemplate);
    console.log("\t " + ret.other.dataitem.type + " 'label'->" + ret.other.dataitem.label + " 'key'->" + ret.other.dataitem.key);
    for (var i = 0; i < ret.other.dataattribute.length; i++) {
        console.log("\t " + ret.other.dataattribute[i].type + " [" + i + "] 'label'->" + ret.other.dataattribute[i].label + " 'key'->" + ret.other.dataattribute[i].key);
    }
}