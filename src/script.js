
chrome.extension.sendMessage({ "type": "extension_status" }, function (msg) {

    scriptBody(msg.disable);
});


function scriptBody(disa) {

    if (disa === false && !document.getElementById("iapi_frame")) {
        //use pointer-events: none;
        iapi_control = "<div id='iapi_frame' style='border: 3px solid black;display: none;'>" +
                        '<div id="iapi_menu" class="iapi_menu" style="background-color:black; padding: 3px; width: 200px;">' +
                           '<div style="font-size: 16px;font-weight: bold; color:white;"></div>' +
                           '<div id="ciao"style="font-size: 16px;font-weight: bold; color:white;">Formatting:<br/>' +

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
                
                getAttributeTags($(this).prop("id"), function (actualObj) {

                   //stampMyObj(actualObj);

                    //TODO
                   thirdchild = $("#iapi_menu div:nth-child(3)");
                        if (actualObj.type === "iapi") {
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
                        }
                        else {
                            thirdchild.css("display", "none");
                        }
                });             
            }
        });

        //SET CLICK STATUS FORMATTING
        $("#iapi_menu div:nth-child(2)").children().click(function () {
            console.log($(this).val());
            formattingDOM(5, $(this).val());
        });

        //SET CLICK STATUS MORE DATA
        //TODO
        $("#iapi_menu div:nth-child(3)").children().click(function () {
            //console.log("aaaaaaaaaaaaa");
            hideShowDataattributeDOM(5, $(this).val());
            //checkCheckBoxFormatting($(this).val());
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
            var YourFindElement2 = $(".iapi [class*=data]");

            iapitemplate = false;
            $.each(YourFindElement2, function (i, rowValue) {

                var tagtarg2 = $(this).attr("class").split(" ");
                for (i = 0; i < tagtarg2.length; i++) {

                    if (tagtarg2[i] == "iapitemplate") {
                        iapitemplate = true;
                    }
                }
            });




            /*
            dataattribute = new Array();
            iapitemplate=false;
            var dataitem;
            $.each(YourFindElement2, function (i, rowValue) {

                 var tagtarg2 = $(this).attr("class").split(" ");
                 for (i = 0; i < tagtarg2.length; i++) {
            
                        if (tagtarg2[i] == "iapitemplate") {
                            iapitemplate =true;
                        }
                        else if (tagtarg2[i].slice(0,9) == "dataitem:") {
                            var temp2 = tagtarg2[i].substr(9);//Publication:pubs or //Publication
                            console.log("console" + temp2);
                            if (sourcetype != "iapi") {
                                var n = temp2.indexOf(":");//Publication:pubs
                                var a = temp2.substr(0, n);//Publication
                                var b = temp2.substr(n + 1);//pubs

                                if (a == "" || b == "") {
                                    console.log("ERROR");
                                }
                                dataitem = ({ "type": tagtarg2[i].slice(0, 8), "ref": a, "extref": b });
                            }
                            else {//Publication
                                dataitem = ({ "type": tagtarg2[i].slice(0, 8), "ref": temp2 });
                            }
                        }
                    }
                    if ($(this).attr("class").slice(0, 14) == ("dataattribute:")) {

                    var temp = $(this).attr("class").substr(14);//Author:auth or //Author

                    if (sourcetype != "iapi") {
                        var n = temp.indexOf(":");//Author:auth
                        var a = temp.substr(0, n);//Author
                        var b = temp.substr(n + 1);//auth


                        if (a == "" || b == "") {
                            console.log("ERROR");
                        }
                        dataattribute.push({ "type": $(this).attr("class").substr(0, 13), "ref": a, "extref": b });
                    }
                    else {//Author
                        dataattribute.push({ "type": $(this).attr("class").substr(0, 13), "ref": temp});
                    }
                }
            });*/


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
                generateJSON(urlsource, $(this));
                
            }

                //////////////////////////////////////////
                //////////////RSS
                //////////////////////////////////////////
            else if (sourcetype == "rss") {
                console.log("RSS->>>>>>>>>>>>");
                //generateRSS(urlsource, $(this));
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
                //generateIAPI(urlsource, iapiid, id);
                
            }
        }
    });
}


//function select radio button  MORE DATA
function checkCheckBoxFormatting(value) {
    console.log("value"+value);
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
function formattingDOM(id, tag) {

    console.log("SCRIPT.JS:format the DOM");

    sendMessageMiddleware("formatting", id, function (ret) {
        console.log("formatting: "+ret);
    });
}

//call sendMessageMiddleware with the current iapiid and the tag "more_data"
function hideShowDataattributeDOM(id, tag) {
    //format
    //<table class="iapi datasource:http://source sourcetype:iapi hide:dataattribute:author">
    console.log("SCRIPT.JS:hide/show element of the DOM");
    sendMessageMiddleware("more_data", id, function (ret) {
        console.log("more_data: " + ret);
    });
}

//call sendMessageMiddleware with the current iapiid and the tag "save"
function saveTemplateDOM(id, tag) {

    console.log("SCRIPT.JS:save the DOM");
    sendMessageMiddleware("save", id, function (ret) {
        console.log("save: " + ret);
    });
}

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