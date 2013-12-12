
chrome.extension.sendMessage({ "type": "extension_status" }, function (msg) {

    scriptBody(msg.disable);
});


function scriptBody(disa) {
    if (disa === false && !document.getElementById("iapi_frame")) {
        //use pointer-events: none;
        iapi_control = "<div id='iapi_frame' style='border: 3px solid black;display: none;'>" +
                        '<div id="iapi_menu" class="iapi_menu" style="background-color:black; padding: 3px; width: 200px;">' +
                           '<div style="font-size: 16px;font-weight: bold; color:white;"></div>' +
                           '<div style="font-size: 16px;font-weight: bold; color:white;">Formatting:<br/>' +

                               '<input type="radio" name="format" value="table">Table<br/>' +
                               '<input type="radio" name="format" value="list">List<br/>' +
                               '<input type="radio" name="format" value="numlist">NumList<br/>' +

                           '</div>' +
                           '<div style="font-size: 16px;font-weight: bold; color:white;">More data:<br/>'+
                          ' </div>' +
                           '<div class="iapiactions"></div>' +
                           '<a href="#" style="color:white">For each...</a>' +
                        '</div>'+
                       '</div>';

            

        $('body').append(iapi_control);

        $('#iapi_frame').on('mouseleave', function () { $('#iapi_frame').hide(); });


        $('.iapi').on('mouseenter', function () {
            $('#iapi_frame').show();

               
            getActions($(this).attr("class"), $(this).attr("id"));

            offset = $(this).offset();
            $('#iapi_frame').offset({ top: offset.top, left: offset.left });
            $('#iapi_frame').height($(this).height() - 6);
            $('#iapi_frame').width($(this).width() - 6);
            $('#iapi_menu').offset({ top: offset.top, left: offset.left + $(this).width() - 3 });
                
            //SET THE TITLE OF IAPI_FRAME
            $('#iapi_menu').children().first().html(messageIapi_menu($(this).attr("id")));

            //if is Source page hide the Formatting options
            if (isSrcPage($(this)) === true) {
                secondchild = $("#iapi_menu div:nth-child(2)").css("display", "none");
                thirdchild = $("#iapi_menu div:nth-child(3)").css("display", "none");

            }
            else {
                secondchild = $("#iapi_menu div:nth-child(2)").css("display", "block");
                //SET THE IAPI FORMATTING 
                //console.log($("#iapi_menu :nth-child(2)").html());



                //SET SELECTED RADIOBUTTON FOR SECONCHILD
                var tag = $(this).prop("tagName");
                tag = tag.toLowerCase();
                //console.log("tag: " + tag);
                if (tag === "table") {

                    //secondchild.children().filter("[value=table]").css("display", "none");
                    //must hide text (Table)
                    //secondchild.children().filter("[value=table]").next().hide();//hide <br/>
                    //secondchild.children().filter("[value=numlist]").css("display", "block");
                    //secondchild.children().filter("[value=list]").css("display", "block");

                    secondchild.children().filter("[value=table]").prop('checked', 'checked');
                } else if (tag === "ul") {
                    //secondchild.children().filter("[value=list]").css("display", "none");
                    //secondchild.children().filter("[value=numlist]").css("display", "block");
                    //secondchild.children().filter("[value=table]").css("display", "block");

                    secondchild.children().filter("[value=list]").prop('checked', 'checked');
                } else if (tag === "ol") {
                    //secondchild.children().filter("[value=numlist]").css("display", "none");
                    //secondchild.children().filter("[value=table]").css("display", "block");
                    //secondchild.children().filter("[value=list]").css("display", "block");
                    secondchild.children().filter("[value=numlist]").prop('checked', 'checked');
                }



                //SET MORE ATTRIBUTE FOR THIRDCHILD
                //TODO
                //ANIS
                /*
                getAttributeTags($(this).prop("id"), function (actualObj) {

                    //stampMyObj(actualObj);

                    getSourceData(actualObj, function (sourceObj) {
                        //thirdchild = $("#iapi_menu div:nth-child(3)");
                        //console.log(thirdchild.html());

                        //REMOVE AFTER
                        if (actualObj.type === "iapi") {
                            stampMyObj(sourceObj);
                            if (sourceObj.other.dataattribute.length > 0) {
                                thirdchild.html('');
                                thirdchild.html('More data:<br/>');
                                thirdchild.css("display", "block");
                            }
                            else {
                                thirdchild.css("display", "none");
                            }
                            console.log(sourceObj.other.dataattribute.length);
                            for (var i = 0; i < sourceObj.other.dataattribute.length; i++) {
                                var find = false;
                                for (var j = 0; j < actualObj.other.dataattribute.length && find === false; j++) {
                                    if (sourceObj.other.dataattribute[i].label === actualObj.other.dataattribute[j].label) {
                                        find = true;
                                    }
                                }
                                var newchi = '<input type="checkbox" name="more_data" value="' + sourceObj.other.dataattribute[i].label + '" >' + sourceObj.other.dataattribute[i].label + '<br/>';
                                thirdchild.append(newchi);
                                if (find === true) {
                                    thirdchild.children("input").last().prop('checked', 'checked');
                                }

                            }
                        }
                        else {
                            thirdchild.css("display", "none");
                        }
                    });
                });*/
                
                
                //SET MORE ATTRIBUTE FOR THIRDCHILD
                //TODO GET SOURCE DATAATTRIBUTE
                //FLORIAN
                
                getAttributeTags($(this).prop("id"), function (actualObj) {

                   //stampMyObj(actualObj);

                   thirdchild = $("#iapi_menu div:nth-child(3)");
                        if (actualObj.other.dataattribute.length > 0) {
                            thirdchild.html('');
                            thirdchild.html('More data:<br/>');
                            thirdchild.css("display", "block");
                        }
                        else {
                            thirdchild.css("display", "none");
                        }
                        for (var j = 0; j < actualObj.other.dataattribute.length ; j++) {
                            var newchi = '<input type="checkbox" name="more_data" value="' + actualObj.other.dataattribute[j].label + '" >' + actualObj.other.dataattribute[j].label + '<br/>';
                            thirdchild.append(newchi);
                            thirdchild.children("input").last().prop('checked', 'checked');
                        }
                        for (var i = 0; i < actualObj.hide.length; i++) {
                            thirdchild.children('[value=' + actualObj.hide[i] + ']').prop('checked',false);
                        }
                });
            }
        });

        //SET CLICK STATUS FORMATTING
        $("#iapi_menu div:nth-child(2)").children().click(function () {
            formattingDOM($("#iapi_menu [class='getAll']").attr("id"), $(this).val());
        });

        //SET CLICK STATUS MORE DATA
        $("#iapi_menu div:nth-child(3)").change(function (i) {
            var obj ={"type_dataattribute":$(i.target).attr("value"),"value":$(i.target).is(":checked")};
            hideShowDataattributeDOM($("#iapi_menu [class='getAll']").attr("id"), obj);
        });
    }

    //Qui controllo se ci sono iApi nella pagina e nel caso ci siano lo notifico all'utente
    if (document.getElementsByClassName("iapi").length > 0) {

        var sjq = document.createElement('script');
        sjq.src = chrome.extension.getURL("lib/jquery-2.0.3.js");
        sjq.onload = function () {
            this.parentNode.removeChild(this);
        };
        
        (document.head || document.documentElement).appendChild(sjq);

        var s = document.createElement('script');
        s.src = chrome.extension.getURL("scripttoinject.js");
        s.onload = function () {
            this.parentNode.removeChild(this);
        };
        (document.head || document.documentElement).appendChild(s);

        $(".iapi").attr("ondragover", "allowDrop(event)");
        $(".iapi").attr("ondrop", "drop(event)");

        //alert("Sono state individuate delle iapi nella pagina");
        chrome.extension.sendMessage({ "type": "iAPI presence", "presence": "yes" }, function () { });
    }
    else {
        chrome.extension.sendMessage({ "type": "iAPI presence", "presence": "no" }, function () { });
    }

    if (document.getElementsByClassName("iapi").length > 0) {

        //Da qui in poi mi occupo di settare le variabili da passare alle funzioni di generazione del codice 
        var YourFindElement = $(".iapi").get();
        var stamp = document.getElementsByClassName("iapi")[0].innerHTML;

        lib = false
        console.log("number execute---------------" + YourFindElement.length);

        console.log(YourFindElement);

        $.each(YourFindElement, function (i, rowValue) {
            var tagtarg = $(this).attr("class").split(" ");
            var id = $(this).attr('id');

            var urlsource;
            var sourcetype;
            var iapiid;

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

            }

            if (sourcetype == "iapi" && iapiid == undefined) {
                console.log("ERROR: you must declare iapiid");
                //TODO
            }


            if (urlsource != undefined && sourcetype != undefined) {
                var YourFindElement2 = $(".iapi [class*='dataitem:']");

                iapitemplate = false;
                $.each(YourFindElement2, function (i, rowValue) {

                    var tagtarg2 = $(this).attr("class").split(" ");
                    for (i = 0; i < tagtarg2.length; i++) {

                        if (tagtarg2[i] == "iapitemplate") {
                            iapitemplate = true;
                        }
                    }
                });

                //////////////////////////////////////////
                //////////////DEBUG
                //////////////////////////////////////////
                /*console.log("YourFindElement2    :" + YourFindElement2);
                console.log("urlsource    :" + urlsource);
                if (iapiid != undefined)
                    console.log("iapiid    :" + iapiid);
                console.log("sourceType   :" + sourcetype);
                console.log("iapitemplate   :" + iapitemplate);
                console.log("id   :" + id);
                */
                /*
                console.log("dataitem    :type: [" + dataitem.type + "] ref: [" + dataitem.ref + "] extref: [" + dataitem.extref + "]");
                
                if (sourcetype != "iapi") {
                    for (var i = 0; i < dataattribute.length; i++) {
                        console.log("attribute[" + i + "]    : type: [" + dataattribute[i].type + "] ref: [" + dataattribute[i].ref + "] extref: [" + dataattribute[i].extref + "]");
                    }
                } else {
                    for (var i = 0; i < dataattribute.length; i++) {
                        console.log("attribute[" + i + "]    : type: [" + dataattribute[i].type + "] ref: [" + dataattribute[i].ref + "]");
                    }
                }*/


                //////////////////////////////////////////
                //////////////LoadTemplate()
                //////////////////////////////////////////
                if (iapitemplate == false) {
                    LoadTemplate();
                }

                function LoadTemplate() {
                    console.log("LOADTEMPLATE");
                }

                //////////////////////////////////////////
                //////////////JSON
                //////////////////////////////////////////
                if (sourcetype == "json") {
                    console.log("JSON->>>>>>>>>>>>");
                    extractJSON(urlsource, id, function (ret) {
                        console.log(ret);
                    });

                }

                    //////////////////////////////////////////
                    //////////////RSS
                    //////////////////////////////////////////
                else if (sourcetype == "rss") {
                    console.log("RSS->>>>>>>>>>>>");
                    extractRSS(urlsource,id, function (ret) {
                        console.log(ret);
                    });
                }

                    //////////////////////////////////////////
                    //////////////XML
                    //////////////////////////////////////////
                else if (sourcetype == "xml") {
                    console.log("XML->>>>>>>>>>>>");
                    //generateXML(urlsource, $(this));
                }


                    //////////////////////////////////////////
                    //////////////IAPI
                    //////////////////////////////////////////
                else if (sourcetype == "iapi") {
                    console.log("IAPI->>>>>>>>>>>>");
                    extractIAPI(iapiid, urlsource, function (datas) {
                        generate(datas, id);
                    });

                }
            }
        });
    }
}

//function: if is Srcpage return true else false (presence  "datasource:")
function isSrcPage(YourFindElement) {
       var tagtarg = YourFindElement.attr("class").split(" ");

            var presenceDataSource = false;

            for (i = 0; i < tagtarg.length; i++) {
                if (tagtarg[i].slice(0, 11) == ("datasource:")) {
                    presenceDataSource = true;
                }
            }
            if (presenceDataSource === true) {
                //console.log("\nYES (presence DataSource)\n");
                return false;
            }
            else {
                //console.log("\nNO(no presence DataSource)\n");
                return true;
            }

    }

//send a message to Middleware and wait a response
//TODO
function sendMessageMiddleware(action,id,call) {
    if (action === "formatting") {
        console.log("call liben.js");
        middlewareAction(action,id,function(ret){
            console.log("return from liben.js");
            call(ret);
        });
    } else if (action === "more_data") {
        console.log("call liben.js");
        middlewareAction(action, id, function (ret) {
            console.log("return from liben.js");
            call(ret);
        });
    } else if (action === "save") {
        console.log("call liben.js");
        middlewareAction(action, id, function (ret) {
            console.log("return from liben.js");
            call(ret);
        });
    }
}

//call sendMessageMiddleware with the current iapiid and the tag "formatting"
//TODO
function formattingDOM(id, tag) {

    console.log("SCRIPT.JS:format the DOM");

    sendMessageMiddleware("formatting", id, function (ret) {
        console.log("formatting: "+ret);
    });
}

//call sendMessageMiddleware with the current iapiid and the tag "more_data"
//format
//<table class="iapi datasource:http://source sourcetype:iapi hide:Author">
//TODO
function hideShowDataattributeDOM(id, obj) {
    console.log("dataattribute :" + obj.type_dataattribute + " value:" + obj.value);
    if(obj.value){
        showDataattribute(id,obj.type_dataattribute);
    }else{
        hideDataattribute(id,obj.type_dataattribute);
    }

    console.log("SCRIPT.JS:hide/show element of the DOM");
    sendMessageMiddleware("more_data", id, function (ret) {
        console.log("more_data: " + ret);
    });
}

//hide the dataAttribute
//Before:<table class="iapi datasource:http://source sourcetype:iapi hide:Title:Where">
//After:<table class="iapi datasource:http://source sourcetype:iapi hide:Author:Title:Where">
//TODO
function hideDataattribute(id,type) {
    var YourFindElement = $(".iapi").filter("#" + id);
    var findHide = false;
    var tagtarg = YourFindElement.attr("class").split(" ");
    var tagtarg2;
    for (i = 0; i < tagtarg.length && findHide === false; i++) {
        if (tagtarg[i].substr(0,5) === "hide:") {
            findHide = true;
            tagtarg[i] += ":" + type;
        }
        console.log("tag:"+tagtarg[i]);
    }
    
    if (findHide === false) {
        tagtarg2 = YourFindElement.attr("class");
        tagtarg2 += " hide:"+type;
    }

    console.log(tagtarg2);
}

//show the dataAttribute
//Before:<table class="iapi datasource:http://source sourcetype:iapi hide:Author">
//After:<table class="iapi datasource:http://source sourcetype:iapi ">
//TODO
function showDataattribute(id,type) {
    var YourFindElement = $(".iapi").filter("#" + id).get();
    var findHide = false;
    var findDataAttribute = false;
    $.each(YourFindElement, function (i, rowValue) {
        var tagtarg = $(this).attr("class").split(" ");
        for (i = 0; i < tagtarg.length && findHide === false; i++) {
            if (tagtarg[i].substr(0, 5) === "hide:") {
                findHide = true;
                var arrayHideElement = tagtarg[i].substr(5).split(":");
                for (var j = 0; j < arrayHideElement.length && findDataAttribute===false; j++) {
                    if (arrayHideElement[j] === type) {
                        console.log("TROVATO");
                        findDataAttribute = true;
                    }
                }
            }
        }
        if (findHide === false)
            console.log("ERROR");
        if (findHide === false)
            console.log("ERROR");
    });

}

//call sendMessageMiddleware with the current iapiid and the tag "save"
//TODO
function saveTemplateDOM(id, tag) {

    console.log("SCRIPT.JS:save the DOM");
    sendMessageMiddleware("save", id, function (ret) {
        console.log("save: " + ret);
    });
}

//generate the dinamic title of iapi_menu
function messageIapi_menu(id) {

    var iapiDiv = $("#" + id);
    var sourcetype;
    var urlsource;
    var iapiid;
    var presenceDataSource = false;
    var firstRow = iapiDiv.attr("class").split(" ");

    for (i = 0; i < firstRow.length; i++) {
        if (firstRow[i].slice(0, 11) == ("datasource:")) {
            presenceDataSource = true;
        }
    }


    if (presenceDataSource === true) {
        for (i = 0; i < firstRow.length; i++) {
            if (firstRow[i].slice(0, 11) == ("datasource:")) {
                urlsource = firstRow[i].substr(11);
            }
            else if (firstRow[i].slice(0, 7) == ("iapiid:")) {
                iapiid = firstRow[i].substr(7);
            }
            else if (firstRow[i].slice(0, 11) == ("sourcetype:")) {
                sourcetype = firstRow[i].substr(11);
            }
        }
        if (iapiid === undefined) {
            return 'Target page with ' + sourcetype.toUpperCase() + ' interaction at <a href="' + urlsource + '">' + urlsource + '</a>';
            //console.log('Target page with ' + sourcetype.toUpperCase() + ' interaction at "' + urlsource+'"');
        }
        else {
            return 'Target page with ' + sourcetype.toUpperCase() + ' interaction at <a href="' + urlsource + '">' + urlsource + '</a>' + ' with id:' + iapiid;
            //console.log('Target page with ' + sourcetype.toUpperCase() + ' interaction at "' + urlsource + '" with id:' + iapiid);
        }
    } else {
        for (i = 0; i < firstRow.length; i++) {
            if (firstRow[i].slice(0, 5) == ("json:")) {
                sourcetype = firstRow[i].substr(0, 4);
                urlsource = firstRow[i].substr(5);
            }
            else if (firstRow[i].slice(0, 4) == ("rss:")) {
                sourcetype = firstRow[i].substr(0, 3);
                urlsource = firstRow[i].substr(4);
            }
            else if (firstRow[i].slice(0, 4) == ("xml:")) {
                sourcetype = firstRow[i].substr(0, 3);
                urlsource = firstRow[i].substr(4);
            }
        }

        if (sourcetype === undefined)
            sourcetype = "iapi";

        if (urlsource === undefined) {
            return 'Page with ' + sourcetype.toUpperCase() + ' interaction';
            //console.log('Page with ' + sourcetype.toUpperCase()+ ' interaction');
        } else {
            return 'Source page with ' + sourcetype.toUpperCase() + ' interaction at <a href="' + urlsource + '">' + urlsource + '</a>';
            //console.log('Source page with ' + sourcetype.toUpperCase() + ' interaction at "' + urlsource +'"');
        }

    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

//get more data (used only in targetpage) and call relative parser (RSS, JSON, XML, IAPI)
function getSourceData(obj, call) {

    if (obj.type.toLowerCase() === "iapi") {
        getDataFromIAPI(obj.url, obj.iapiid, function (r) {
            call(r);
        });
    } else if (obj.type.toLowerCase() === "json") {
        getDataFromJSON(obj.url, function (r) {
            call(r);
        });
    } else if (obj.type.toLowerCase() === "rss") {
        getDataFromRSS(obj.url, function (r) {
            call(r);
        });
    } else if (obj.type.toLowerCase() === "xml") {
        getDataFromXML(obj.url, function (r) {
            call(r);
        });
    }
}

//relative parser (JSON) to get data (MyObject)
//TODO
//MUST COMPLETE THE FUNCTION (getDataFromJSON)
function getDataFromJSON(url, callback) {
    console.log("getDataFromJSON--->>>>");
    callback("");
}

//relative parser (RSS) to get data (MyObject)
//TODO
//MUST COMPLETE THE FUNCTION (getDataFromRSS)
function getDataFromRSS(url, callback) {
    console.log("getDataFromRSS--->>>>");
    callback("");
}

//relative parser (XML) to get data (MyObject)
//TODO
//MUST COMPLETE THE FUNCTION (getDataFromXML)
function getDataFromXML(url, callback) {
    console.log("getDataFromXML--->>>>");
    callback("");
}

//relative parser (IAPI) to get data (MyObject)
function getDataFromIAPI(url, iapiid, callback) {
    console.log("getDataFromIAPI--->>>>");
    $.get(url, function (data) {
        var element = $("<Div>" + data + "</Div>").find('#' + iapiid, '.iapi'); // select the source
        getAttributeTags(iapiid, function (re) {
            callback(re);
        });
    });
}