
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
                           '</div>' +
                           '<div style="font-size: 16px;font-weight: bold; color:white;">More data:<br/>'+
                          ' </div>' +
                           '<div class="iapiactions"></div>' +
                           '<a href="#" style="color:white">For each...</a>' +
                        '</div>' +
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

                var id = $(this).attr("id");
                var items = $(this).find("[class*='dataitem:']")
                var elementsItem = $(items).attr("class").split(" ");
                var presenceIdtemplate=false;
                var idTemplate;
                for (var i = 0; i < elementsItem.length && presenceIdtemplate === false; i++) {
                    //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA:" + i + " = " + elementsItem[i]);

                    if (elementsItem[i].substr(0, 11) === "idTemplate:")
                    {
                        idTemplate = elementsItem[i].substr(11);
                        presenceIdtemplate = true;
                    }
                }
                if (presenceIdtemplate === false) {
                    secondchild = $("#iapi_menu div:nth-child(2)").css("display", "none");
                    thirdchild = $("#iapi_menu div:nth-child(3)").css("display", "none");
                }
                else
                {
                        //SET THE IAPI FORMATTING 
                        //TODO must be checked atrual template
                        getTemplateList(function (array) {

                            secondchild = $("#iapi_menu div:nth-child(2)");

                            if (array.length > 0) {
                                secondchild.html('');
                                secondchild.html('Formatting:<br/>');
                                secondchild.css("display", "block");
                            }
                            else {
                                secondchild.css("display", "none");
                            }
                            for (var i = 0; i < array.length; i++) {
                                var newchi = '<input type="radio" class="idtemplate:' + array[i].key + '" value="' + array[i].value + '" >' + array[i].value + '<br/>';
                                secondchild.append(newchi);
                                if(array[i].key===idTemplate)
                                    secondchild.children("input").last().prop('checked', 'checked');
                            }
                        });


                    //SET MORE ATTRIBUTE FOR THIRDCHILD
                    //TODO GET SOURCE DATAATTRIBUTE Load from array ANIS

                    var arr = new Array();
                    var parentNode = $(this);
                    pageIdRequest(function (data) {
                        //console.log("ssssssssssssssssssssssssssss" + JSON.parse(localStorage.getItem(data)));

                        var tmp = JSON.parse(localStorage.getItem(data));

                        tmp = tmp[id];

                        
                        if (tmp !== null) {
                            
                            getFirstRowKeyObject(tmp, function(arr){
                                thirdchild = $("#iapi_menu div:nth-child(3)");

                                if (arr.length > 0) {
                                    thirdchild.html('');
                                    thirdchild.html('More data:<br/>');
                                    thirdchild.css("display", "block");
                                }
                                else {
                                    thirdchild.css("display", "none");
                                }
                                for (var j = 0; j < arr.length ; j++) {
                                    var newchi = '<input type="checkbox" name="more_data" value="' + arr[j] + '" >' + arr[j] + '<br/>';
                                    thirdchild.append(newchi);
                                    thirdchild.children("input").last().prop('checked', 'checked');
                                }

                                var arrAttr = parentNode.attr("class").split(" ");
                                for (var i = 0; i < arrAttr.length; i++) {
                                    console.log(arrAttr[i]);
                                    if (arrAttr[i].substr(0, 5) === "hide:") {
                                        var attribute = arrAttr[i].split(":");
                                        for (var j = 1; j < attribute.length; j++) {
                                            thirdchild.children('[value=' + attribute[j] + ']').prop('checked', false);
                                        }
                                    }

                                }
                            });
                        }
                    });
                }
            }
        });

        //SET CLICK STATUS FORMATTING
        $("#iapi_menu div:nth-child(2)").change(function (i) {
            var values = $(i.target).attr("class").split(" ");
            var idTemplate;
            for (var i = 0; i < values.length; i++) {
                if (values[i].substr(0, 11) === "idtemplate:")
                {
                    idTemplate = values[i].substr(11);
                    break;
                }
            }
            formattingDOM($("#iapi_menu [class='getAll']").attr("id"), idTemplate);
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
        /*
        var k = document.createElement('script');
        k.src = chrome.extension.getURL("parsers/iAPI.js");
        k.onload = function () {
            this.parentNode.removeChild(this);
        };
        (document.head || document.documentElement).appendChild(k);
          */
        var ks = document.createElement('script');
        ks.src = chrome.extension.getURL("libgen.js");
        ks.onload = function () {
            this.parentNode.removeChild(this);
        };
        (document.head || document.documentElement).appendChild(ks);
        
        var s = document.createElement('script');
        s.src = chrome.extension.getURL("scripttoinject.js");
        s.onload = function () {
            this.parentNode.removeChild(this);
        };
        (document.head || document.documentElement).appendChild(s);
          
        $(".iapi").attr("ondragover", "allowDrop(event)");
        $(".iapi").attr("ondrop", "drop(event)");
        $(".iapi").attr("ondragleave", "leave(event)");

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
            console.log("idSCRIPOT:JS" + id);
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
                        generate(id);
                    }); 

                }

                    //////////////////////////////////////////
                    //////////////RSS
                    //////////////////////////////////////////
                else if (sourcetype == "rss") {
                    console.log("RSS->>>>>>>>>>>>");
                    /*extractRSS(urlsource, id, function (ret) {
                       console.log(ret);
                    });*/
                }

                    //////////////////////////////////////////
                    //////////////XML
                    //////////////////////////////////////////
                else if (sourcetype == "xml") {
                    console.log("XML->>>>>>>>>>>>");
                        //extractXML(urlsource, id, function (ret) {
                        //    console.log(ret);
                        //});
                }

                    //////////////////////////////////////////
                    //////////////IAPI
                    //////////////////////////////////////////
                else if (sourcetype == "iapi") {
                    console.log("IAPI->>>>>>>>>>>>");
                    extractIAPI(iapiid, urlsource,id, function () {
                        generate(id);
                    });
                }
            }
        });
    }
}

function getFirstRowKeyObject(tmp, call) {
    var arr = new Array();
    $.each(tmp, function (key, value) {

        $.each(value, function (key, value) {

            arr.length = 0;
            for (var key in value) {
                //console.log("key =" + key);

                arr.push(key);
            }
            call(arr);
        });
        return false;
    });
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

//return all 2D templates array with(id and name) 
function getTemplateList(callback) {
    var array = new Array();

    $.get(chrome.extension.getURL('html/templates.html'), function (data) {
        var template = $("<div>" + data + "</div>").find('#2D');   //source template
        var children = template.find("[id^='2D_']");
        $.each(children, function (key, value) {
            array.push({ "key": $(this).attr("id"), "value": $(this).attr("name") });
        });
        callback(array);
    });
}

//send a message to Middleware and wait a response
//TODO
function sendMessageMiddleware(action,id,call) {
    middlewareAction(action,id,function(ret){
            console.log("return from liben.js");
            call(ret);
    });
}

//call sendMessageMiddleware with the current iapiid and the tag "formatting"
//TODO
function formattingDOM(id, idTemplate) {

    console.log("SCRIPT.JS:format the DOM");
    console.log("idtemplate:" + idTemplate);

    $.get(chrome.extension.getURL('html/templates.html'), function (data) {
        var template = $("<div>" + data + "</div>").find('#' + idTemplate);   //source template
        var tmp = $(template).prop("tagName");

        console.log("tagName" + tmp);

        compileAndInjectTemplate(tmp, template, id,idTemplate, function (ret2) {

        
            /*sendMessageMiddleware("formatting", id, function (ret) {
                console.log("formatting: " + ret);
            });  */
        });
    });
}

function compileAndInjectTemplate(parentnode, template, idtarget,idTemplate, callback) {

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
    $(parentnode).html(template.html());


    console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT:"+$(parentnode).html());


    var temp = $(parentnode).children().filter("[class*='iapitemplate:item']");
    
    $(temp).addClass("idTemplate:" + idTemplate);



    pageIdRequest(function (data) {
        console.log("data:"+data);
        var tmp = JSON.parse(localStorage.getItem(data));
        tmp = tmp[idtarget];


                
        getFirstRowKeyObject(tmp, function (arr) {
            for (var i = 0; i < arr.length; i++) {
                console.log("DATA:" + arr[i]);
            }
            /*var dataattributeIterator = $(temp).children().filter("[class*='iapitemplate:dataattribute']");
            var txt = "";
            var txt2 = "";
            //console.log("arr" + arr.length);
            for (var i = 0; i < arr.length; i++) {  
                var items = $(dataattributeIterator).children().attr("class").split(" ");


                for (var j = 0; j < items.length; j++) {
                    
                    if(items[j].substr(0,14)==="dataattribute:")
                    {
                        var items2 = items[j].split(":");
                        
                        
                        $(dataattributeIterator).children().attr("class", items2[0] + ":" + arr[i]);
                        console.log($(dataattributeIterator).html());

                    }
                    else
                    {
                    }
                }
                txt += $(dataattributeIterator).html();
                 
            }
            $(dataattributeIterator).find("[class*='dataattribute:']").remove();
            $(dataattributeIterator).append(txt); */
        });

    });      


    callback("done3");
}

//call sendMessageMiddleware with the current iapiid and the tag "more_data"
//format
//<table class="iapi datasource:http://source sourcetype:iapi hide:Author">
function hideShowDataattributeDOM(id, obj) {
    console.log("dataattribute :" + obj.type_dataattribute + " value:" + obj.value);
    if(obj.value){
        showDataattribute(id, obj.type_dataattribute, function () {
            console.log("fineeeeeeeeeeeeeeeeeeeeeee");
            console.log("SCRIPT.JS:hide/show element of the DOM");
            sendMessageMiddleware("more_data", id, function (ret) {
                console.log("more_data: " + ret);
            });
        });
    }else{
        hideDataattribute(id, obj.type_dataattribute, function () {
            console.log("fineeeeeeeeeeeeeeeeeeeeeee");
            console.log("SCRIPT.JS:hide/show element of the DOM");
            sendMessageMiddleware("more_data", id, function (ret) {
                console.log("more_data: " + ret);
            });
            
        });
    }

    
}

//hide the dataAttribute
//Before:<table class="iapi datasource:http://source sourcetype:iapi hide:Title:Where">
//After:<table class="iapi datasource:http://source sourcetype:iapi hide:Author:Title:Where">
function hideDataattribute(id,type,call) {
    var YourFindElement = $(".iapi").filter("#" + id);
    var findHide = false;
    var tagtarg = YourFindElement.attr("class").split(" ");
    var tagtarg2;
    var tagClass ="";
    for (i = 0; i < tagtarg.length ; i++) {
        if (tagtarg[i].substr(0,5) === "hide:") {
            findHide = true;
            tagtarg[i] += ":" + type;
        }
        if (i === 0)
            tagClass += tagtarg[i];
        else
            tagClass += " " + tagtarg[i];
        
    }
    
    if (findHide === false) {
        tagtarg2 = YourFindElement.attr("class");
        tagtarg2 += " hide:"+type;
        tagClass = tagtarg2;
    }
    
    YourFindElement.attr("class", tagClass);
    call("done");
}

//show the dataAttribute
//Before:<table class="iapi datasource:http://source sourcetype:iapi hide:Author">
//After:<table class="iapi datasource:http://source sourcetype:iapi ">
function showDataattribute(id, type, call) {
    var YourFindElement = $(".iapi").filter("#" + id);
    var findHide = false;
    var tagClass = "";
    var findDataAttribute = false;
    var tagtarg = YourFindElement.attr("class").split(" ");
    for (i = 0; i < tagtarg.length ; i++) {
        if (tagtarg[i].substr(0, 5) === "hide:") {
            findHide = true;
            var arrayHideElement = tagtarg[i].substr(5).split(":");
            if(arrayHideElement.length!==1)
                tagClass += " "+tagtarg[i].substr(0, 4);
            for (var j = 0; j < arrayHideElement.length; j++) {
                if (arrayHideElement[j] === type) {
                    findDataAttribute = true;
                    tagClass.substr(0, tagClass.length - 1);
                }
                else {
                    tagClass += ":"+arrayHideElement[j];
                }

            }
        }
        if(findDataAttribute===false){
            if(i===0)
                tagClass +=tagtarg[i];
            else
                tagClass += " " + tagtarg[i];
        }

        //console.log("[" + i + "]" + tagClass);
    }
    YourFindElement.attr("class",tagClass);
    if (findHide === false)
        console.log("ERRORfindHide");
    if (findDataAttribute === false)
        console.log("ERRORfindDataAttribute");

    call("done");
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
    var presenceDataSourceOrData = false;
    var typeData;
    var elementsClass = iapiDiv.attr("class").split(" ");

    for (i = 0; i < elementsClass.length && presenceDataSourceOrData === false; i++) {
        if (elementsClass[i].substr(0, 11) == ("datasource:")) {
            typeData = 'Page with interactions';
            presenceDataSourceOrData = true;
        }
        else if (elementsClass[i].substr(0, 5) == ("data:")) {
            typeData = elementsClass[i].substr(5);
            presenceDataSourceOrData = true;
        }


    }
    if (presenceDataSourceOrData === true) {
        return typeData;
        //console.log('Page with interaction);
    
    } 

    
}

function pageIdRequest(call) {
    chrome.extension.sendMessage({ "type": "requestPageId" }, function (data) {
        call(data);
    });
}