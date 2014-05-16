var idtarget = "";
var code = "";
var over = false;
var overlay = false;
var filters = new Array();


var idsource;
var source;
var idsourcepage;
var annotation;
var pageID;
var eventDrop;
var numRemoveFilter = 0;



function allowDrop(ev, pageId) {
    ev.preventDefault();
    if (!over) {
        getParentIAPI(ev.target, function (parent) {

            overlay = true;
            offset = $(parent).offset();
            idtarget = $(parent).prop('id');
            console.log("id:" + idtarget);

            filterBox = '<div class="info" style="pointer-events:none ; font-weight:bold; position:absolute;left:0;right:0;text-align: center;">Drop Here</div>'
            eventDrop = ev;

            $(parent).append(filterBox);

            var imgWidth = $(parent).width();
            var imgHeight = $(parent).height();
            var negImgWidth = imgWidth - imgWidth - imgWidth;

            $(parent).children(".info").fadeTo(0, 0.8);
            $(parent).children(".info").css("width", (imgWidth) + "px");
            $(parent).children(".info").css("height", (imgHeight) + "px");
            $(parent).children(".info").css("top", offset.top + "px");
            $(parent).children(".info").css("left", negImgWidth + "px");
            $(parent).children(".info").css("visibility", "visible");

            $(parent).children(".info").animate({ "left": offset.left }, 250);

        });
    }
    over = true;


    //$(ev.target).addClass("over");




}

//This function gather and set parameters that must be transfered in the drag operation
function drag(ev, source, idPage) {

    ev.dataTransfer.setData("source", source);
    ev.dataTransfer.setData("id", ev.target.id);
    ev.dataTransfer.setData("classAttribute", $("#" + ev.target.id).attr("class"));
    ev.dataTransfer.setData("idpagesource", idPage);

    console.log("id____________________:" + idPage);

    /*getPageIdFromURL(source,function () {

        //Listener for the page ID
        var flag = true;
        window.addEventListener('message', function (e) {
            try {
                if (JSON.parse(e.data).action === "pageidResponseFromURL" && flag) {

                    flag = false;
                    console.log(",,,,,,,,,,DRAG,,,,,,,,,,,,,," + JSON.parse(e.data).pageid);
                    var id= JSON.parse(e.data).pageid;
                    ev.dataTransfer.setData("idpagesource", id);
                    hasIdTemplate(ev.target.id, function (msg) {
                        if (msg !== "NOIDTEMPLATE")
                            ev.dataTransfer.setData("idtemplate", msg);
                        else
                            ev.dataTransfer.setData("idtemplate", msg);
                    });
                    return true;
                }
            } catch (err) { }
        }, false);
    });   */

}

//Control whether the element has an IdTemplate (means that the template is predifined, so it will load it )
function hasIdTemplate(id, call) {

    var yourFindElement = $("#" + id);
    var items = $(yourFindElement).find("[class*='dataitem:']");
    if (items.html() !== undefined) {
        var elementsItem = $(items).attr("class").split(" ");
        var presenceIdtemplate = false;
        var idTemplate;
        for (var i = 0; i < elementsItem.length && presenceIdtemplate === false; i++) {
            if (elementsItem[i].substr(0, 11) === "idTemplate:") {
                idTemplate = elementsItem[i].substr(11);
                presenceIdtemplate = true;
            }
        }
    }
    if (presenceIdtemplate === true) {
        call(idTemplate);
    } else {
        call("NOIDTEMPLATE");
    }

}

// leave iapi element
function leave(ev) {
    if (over) {
        getParentIAPI(ev.target, function (parent) {

            //console.log("uguali?:" + $(parent).prop('id') === idtarget);
            //console.log("attuale:" + $(parent).prop('id'));
            //console.log("vecchio:" + idtarget);

            // if ($(parent).prop('id') !== idtarget) {
            var imgWidth = $(parent).width();
            var imgHeight = $(parent).height();
            var negImgWidth = imgWidth - imgWidth - imgWidth;

            $(parent).children(".info").animate({ "left": negImgWidth }, 250, function () {
                $(parent).children(".info").remove();
                overlay = false;
                over = false;
            });
            // }
        });

    }


    //$(ev.target).removeClass("over");
}

//Drop operation (event handler contains a set of parameters from the drag op)
function drop(ev, pageId) {

    over = false;
    ev.preventDefault();
    //$(ev.target).removeClass("over");
    //get the datas from datatransfer
    idsource = ev.dataTransfer.getData("id");
    source = ev.dataTransfer.getData("source");
    idsourcepage = ev.dataTransfer.getData("idpagesource");
    pageID = pageId;


    /////////TEST////////
    pageID = 35;
    idsourcepage = 57;
    idsource = "PRIMO";

    /////////////////////

    console.log("..........SOURCE.............." + idsourcepage);
    console.log("..........TARGET.............." + pageID);
    var findHide = false;
    var tagtarg = ev.dataTransfer.getData("classAttribute").split(" ");
    for (i = 0; i < tagtarg.length && findHide === false; i++) {
        if (tagtarg[i].substr(0, 5) === "hide:") {
            findHide = true;
            annotation = tagtarg[i];
        }
    }

    //////////////////////DATA_INTEGRATION//////////////////////////////


    //Rendering
    //send messages to middleware
    try {
        var pass_data = {
            'action': "getSame",
            'idPageSource': idsourcepage,
            'idSource': idsource,
            'idPageTarget': pageID,
            'idTarget': idtarget

        };
        window.postMessage(JSON.stringify(pass_data), window.location.href);

        var flag = true;
        window.addEventListener('message', function (event) {
            if (JSON.parse(event.data).action == "getSameObjects" && flag) {
                flag = false;
                if (JSON.parse(event.data).same) {
                    MainOverlayST();
                }
                    ////If they aren't the same type
                else {
                    MainOverlayDT();
                }
            }
        });
    } catch (e) {
        alert(e);
    }

    /////////////////////////////////////////////////
    ////////////////////NEW//////////////////////////
    /*
   getObject(idsourcepage, idsource, pageID, idtarget, function (first, second) {
       ///////////              
       console.log("first_________________________________________________________" + first);
       console.log("second_________________________________________________________" + second);
       var arrDifferentColumn = new Array();
       try {
           getFirstRowKeyObject(true, first, function (arr) {
               getFirstRowKeyObject(true, second, function (arr2) {


                   sameType(first, second, function (same) {

                       offset = $(parent).offset();
                       $("#iapi_frame").css('pointer-events', 'none');
                       $(parent).find(".info").remove();



                       //If they are the same type
                       if (same) {
                           MainOverlayST();
                       }
                           ////If they aren't the same type
                       else {
                           MainOverlayDT();
                       }

                       $(parent).append(filterBox);

                       var imgWidth = $(parent).width();
                       var imgHeight = $(parent).height();
                       var negImgWidth = imgWidth - imgWidth - imgWidth;

                       $(parent).children(".info").fadeTo(0, 0.8);
                       $(parent).children(".info").css("width", (imgWidth) + "px");
                       $(parent).children(".info").css("height", (imgHeight) + "px");
                       $(parent).children(".info").css("top", offset.top + "px");
                       $(parent).children(".info").css("left", negImgWidth + "px");
                       $(parent).children(".info").css("visibility", "visible");

                       $(parent).children(".info").animate({ "left": offset.left }, 250);

                   });
               });
           });
       } catch (er) {
           console.log("There was an error:" + er);
       }
       ///////////

   }); */

    /////////////////////////////////////////////////

}

function old(source, idsource, idtarget, pageId, ev, callback) {
    var idTemplate;
    //load the page
    getPage(source, idtarget, function () {
        // Draged element is a source or a target, then extract related data
        getTypeSource(source, document.URL, idsource, idtarget, function (urlsource, sourceType, iapiid, arr) {


            if (arr === undefined) {
                arr = new Array();
                arr.length = 0;
            }



            hasIdTemplate(idtarget, function (msg) {
                if (msg !== "NOIDTEMPLATE")
                    idTemplate = msg;

                loadTemplate(idTemplate, $("#" + idtarget).prop("tagName"), function (ret) {
                    console.log("ret:" + $(ret).html());
                    compileTemplate(urlsource, idsource, ret, ev.target.id, pageId, arr, sourceType, iapiid, function (ret2, hideArr) {
                        $("#" + idtarget).empty();
                        var replacementTag = ret2.prop("tagName");
                        var $a = $("#" + idtarget);
                        var aid = $a.attr('id');
                        $a.replaceWith('<' + replacementTag + ' id="' + aid + '"></' + replacementTag + '>');
                        $("#" + idtarget).html(ret2.html());

                        //get the annotation (hide:#:#:#) from the source
                        if (annotation !== undefined)
                            $("#" + idtarget).addClass(annotation);
                        else {

                            if (hideArr !== undefined && hideArr.length !== 0) {
                                var hideString = "hide:";
                                for (var i = 0; i < hideArr.length; i++) {
                                    if (i === hideArr.length - 1)
                                        hideString += hideArr[i];
                                    else
                                        hideString += hideArr[i] + ":";
                                }
                                $("#" + idtarget).addClass(hideString);
                            }
                        }
                        $("#" + idtarget).addClass("iapi");
                        $("#" + idtarget).addClass("datasource:" + urlsource);
                        if (urlsource !== source)
                            $("#" + idtarget).addClass("provenance:" + source);
                        $("#" + idtarget).addClass("sourcetype:" + sourceType.toLowerCase());
                        if (sourceType.toLowerCase() === "iapi")
                            $("#" + idtarget).addClass("iapiid:" + iapiid);

                        //Rendering
                        //send messages to middleware
                        try {

                            var pass_data = {
                                'action': "generate",
                                'id': idtarget,
                                'pageId': pageId
                            };
                            window.postMessage(JSON.stringify(pass_data), window.location.href);
                        } catch (e) {
                            alert(e);
                        }

                        //Store template
                        try {

                            var pass_data = {
                                'idTemp': idtarget,
                                'value': $('#' + idtarget)[0].outerHTML
                            };
                            window.postMessage(JSON.stringify(pass_data), window.location.href);
                        } catch (e) {
                            alert(e);
                        }
                        try {

                            var pass_data = {
                                'action': "startIApiLayer"
                            };
                            window.postMessage(JSON.stringify(pass_data), window.location.href);
                        } catch (e) {
                            alert(e);
                        }
                        callback();

                    });
                });
            });
        });
    });
}

function getParentIAPI(tag, call) {
    if (!$(tag).hasClass("iapi"))
        getParentIAPI($(tag).parent(), call);
    else
        call(tag);
}

//get type of the Draged element
function getTypeSource(urlSource, currentURL, idSource, idtarget, callBack) {
    var flag = true;
    window.addEventListener('message', function (event) {
        try {
            if (JSON.parse(event.data).action == "getPage" && JSON.parse(event.data).idtarget === idtarget && flag) {

                flag = false;
                data = JSON.parse(event.data).value;
                if (urlSource === currentURL) {
                    var template = $('#' + idSource);
                    var tagtarg = $('#' + idSource).attr("class").split(" ");
                    var id = $('#' + idSource).attr('id');

                } else {
                    var template = $("<div>" + data + "</div>").find('#' + idSource);
                    var tagtarg = $(template).attr("class").split(" ");
                    var id = $(template).attr('id');
                }

                var presenceDataSource = false;

                for (i = 0; i < tagtarg.length; i++) {
                    if (tagtarg[i].slice(0, 11) === ("datasource:")) {
                        presenceDataSource = true;
                    }
                }
                if (presenceDataSource === true) {
                    parseTRG(template, id, function (urlsource, sourcetype, iapiid, arr) {
                        callBack(urlsource, sourcetype, iapiid, arr);
                    });
                } else {
                    parseSRC(template, id, function (urlsource, sourcetype, iapiid, arr) {
                        if (sourcetype.toLowerCase() === "iapi") {
                            urlsource = urlSource;
                        }
                        callBack(urlsource, sourcetype, id, arr);
                    });
                }
            }
        } catch (err) { }

    });
}

// parse the source page then extract annotation: dataattribute, url and sourcetype
function parseSRC(template, id, call) {

    var tagtarg = $(template).attr("class").split(" ");
    var urlsource;
    var iapiid;
    var sourcetype;

    for (i = 0; i < tagtarg.length; i++) {
        if (tagtarg[i].slice(0, 5) == ("json:")) {
            sourcetype = tagtarg[i].substr(0, 4);
            urlsource = tagtarg[i].substr(5);
        } else if (tagtarg[i].slice(0, 4) == ("rss:")) {
            sourcetype = tagtarg[i].substr(0, 3);
            urlsource = tagtarg[i].substr(4);
        } else if (tagtarg[i].slice(0, 4) == ("xml:")) {
            sourcetype = tagtarg[i].substr(0, 3);
            urlsource = tagtarg[i].substr(4);
        }
    }
    if (sourcetype === undefined)
        sourcetype = "iapi";
    if (sourcetype.toLowerCase() !== "iapi") {
        scanDOMSpecialObject(template, function (arr) {

            call(urlsource, sourcetype, iapiid, arr);
        });
    } else
        call(urlsource, sourcetype);

}

// parse the target page then extract annotation: urlsource,iapiid and sourcetype
function parseTRG(YourFindElement, id, call) {

    var tagtarg = $(YourFindElement).attr("class").split(" ");

    var urlsource;
    var sourcetype;
    var iapiid;

    for (i = 0; i < tagtarg.length; i++) {
        if (tagtarg[i].slice(0, 11) == ("datasource:")) {
            urlsource = tagtarg[i].substr(11);
        } else if (tagtarg[i].slice(0, 7) == ("iapiid:")) {
            iapiid = tagtarg[i].substr(7);
        } else if (tagtarg[i].slice(0, 11) == ("sourcetype:")) {
            sourcetype = tagtarg[i].substr(11);
        }

    }

    if (sourcetype.toLowerCase() !== "iapi") {
        scanDOMObject(YourFindElement, function (arr) {
            call(urlsource, sourcetype, iapiid, arr);
        });
    } else
        call(urlsource, sourcetype, iapiid);
}

//Load template
function loadTemplate(idTemplate, tagtarget, callback) {
    getTemplateFile(function (data) {
        function template(data) {
            if (idTemplate !== undefined) {
                var template = $("<div>" + data + "</div>").find('#' + idTemplate);
                return template;
            } else {
                var template = $("<div>" + data + "</div>").find("#2D");
                template = $(template).children().filter(tagtarget).first();

                return template;
            }
        }
        callback(template(data));
    });
}

//Edit and process the template
function compileTemplate(source, idsource, ret, idtarget, pageId, arraySourceSpecial, sourceType, iapiid, callback) {

    var idTemplate;
    getStored(sourceType, iapiid, source, idtarget, pageId, function () {
        //respond to events
        var flag = true;
        window.addEventListener('message', function (event) {
            try {
                if (JSON.parse(event.data).action == "getData" && JSON.parse(event.data).idTarget === idtarget && flag) {

                    flag = false;
                    tmp = JSON.parse(event.data).value;
                    data = JSON.parse(tmp);

                    data = data[idtarget];

                    if (arraySourceSpecial.length === 0) {
                        getFirstRowKeyObject(true, data, function (arr) {

                            idTemplate = $(ret).attr("id");
                            $(ret).removeAttr('id');
                            $(ret).removeAttr("name");

                            if ($(ret).prop("tagName").toLowerCase() === "table") {

                                ret = $(ret).children();
                                var ret2 = $(ret).children().first();
                                var titleAttribute = ret2.html();

                                for (var k = 2; k < arr.length; k++)
                                    $(ret2).append(titleAttribute);

                                //set the j children with array keys
                                $(ret2).children().each(function (i) {
                                    $(this).empty();
                                    $(this).html("" + arr[i + 1]);
                                    i++;

                                });
                            }

                            var dataitemIterator = $(ret).find("[class*='iapitemplate:item']");
                            $(dataitemIterator).removeClass('dataitem:[label]');
                            $(dataitemIterator).addClass("dataitem:" + arr[0]);
                            arr.shift();
                            $(dataitemIterator).addClass("idTemplate:" + idTemplate);

                            var dataattributeIterator = $(dataitemIterator).children().filter("[class*='iapitemplate:attribute']");
                            $(dataattributeIterator).removeClass("iapitemplate:attribute");
                            var dataattribute = dataattributeIterator[0].outerHTML;

                            //insert j children
                            for (var j = 1; j < arr.length; j++)
                                $(dataitemIterator).append(dataattribute);

                            //set the j children with array keys
                            $(dataattributeIterator).parent().children().each(function () {
                                $(this).removeClass();
                                $(this).addClass("dataattribute:" + arr[0]);
                                arr.shift();

                            });

                            if ($(ret).prop("tagName").toLowerCase() === "tbody") {
                                callback($(ret).parent());
                            } else
                                callback(ret);
                        });
                    } else {

                        getFirstRowKeyObject(true, data, function (arr) {

                            idTemplate = $(ret).attr("id");
                            $(ret).removeAttr('id');
                            $(ret).removeAttr("name");

                            if ($(ret).prop("tagName").toLowerCase() === "table") {
                                ret = $(ret).children();
                                var ret2 = $(ret).children().first();
                                var titleAttribute = ret2.html();

                                for (var k = 2; k < arr.length; k++)
                                    $(ret2).append(titleAttribute);

                                var tmpArray = new Array();
                                for (var h = 1; h < arr.length; h++) {
                                    tmpArray.push(arr[h]);
                                }
                                var tmpArraySpecial = new Array();
                                for (var h = 1; h < arraySourceSpecial.length; h++) {
                                    var obj = { "key": arraySourceSpecial[h].key.replace(/(\r\n|\n|\r)/gm, ""), "label": arraySourceSpecial[h].label.replace(/(\r\n|\n|\r)/gm, "") };
                                    tmpArraySpecial.push(obj);
                                }


                                //set the j children with array keys
                                $(ret2).children().each(function (i) {
                                    $(this).empty();
                                    if (tmpArraySpecial.length !== 0) {
                                        var g;
                                        var find = false;

                                        for (g = 0; g < tmpArray.length && find === false; g++) {
                                            if (tmpArraySpecial[0].label === tmpArray[g]) {
                                                find = true;
                                                $(this).html("" + tmpArraySpecial[0].key);
                                            }
                                        }
                                        tmpArraySpecial.shift();
                                        if (find === true) {
                                            tmpArray.splice(g - 1, 1);
                                        }
                                    } else {
                                        $(this).html("" + tmpArray[0]);
                                        tmpArray.shift();
                                    }
                                });
                            }
                            var dataitemIterator = $(ret).find("[class*='iapitemplate:item']");
                            $(dataitemIterator).removeClass('dataitem:[label]');
                            if (arraySourceSpecial[0].key !== undefined)
                                $(dataitemIterator).addClass("dataitem:" + arraySourceSpecial[0].key.replace(/(\r\n|\n|\r)/gm, "") + ":" + arr[0]);
                            else
                                $(dataitemIterator).addClass("dataitem:" + arr[0]);
                            arr.shift();
                            arraySourceSpecial.shift();
                            $(dataitemIterator).addClass("idTemplate:" + idTemplate);

                            var dataattributeIterator = $(dataitemIterator).children().filter("[class*='iapitemplate:attribute']");
                            $(dataattributeIterator).removeClass("iapitemplate:attribute");

                            var dataattribute = dataattributeIterator[0].outerHTML;

                            //insert j children
                            for (var j = 1; j < arr.length; j++)
                                $(dataitemIterator).append(dataattribute);

                            var j = 0;
                            //set the j children with array keys
                            arrhide = new Array();
                            $(dataattributeIterator).parent().children().each(function () {
                                $(this).removeClass();
                                if (arraySourceSpecial.length !== 0) {
                                    var i;
                                    var find = false;

                                    for (i = 0; i < arr.length && find === false; i++) {
                                        if (arraySourceSpecial[0].label.replace(/(\r\n|\n|\r)/gm, "") === arr[i]) {
                                            find = true;
                                            $(this).addClass("dataattribute:" + arraySourceSpecial[0].key.replace(/(\r\n|\n|\r)/gm, "") + ":" + arr[i]);
                                        }
                                    }
                                    arraySourceSpecial.shift();
                                    if (find === true) {
                                        arr.splice(i - 1, 1);
                                    }
                                } else {
                                    $(this).addClass("dataattribute:" + arr[0] + ":" + arr[0]);
                                    arrhide.push(arr[0]);
                                    arr.shift();
                                }
                                j++;
                            });

                            if ($(ret).prop("tagName").toLowerCase() === "tbody") {
                                callback($(ret).parent(), arrhide);
                            } else
                                callback(ret, arrhide);
                        });
                    }
                }
            } catch (err) { }
        }, false);
    });

}

//  scan the Dom object
function scanDOMObject(objectDOM, calli) {
    var arrdataAttributeKey = new Array();
    var dataItemLabel;
    var isRefExt = false;
    var arrObjectDOM = $(objectDOM).attr("class").split(" ");

    for (var i = 0; i < arrObjectDOM.length && isRefExt === false; i++) {
        if (arrObjectDOM[i].substr(0, 11) === "sourcetype:") {
            if (arrObjectDOM[i].substr(11).toLowerCase() !== "iapi")
                isRefExt = true;
        }

    }

    if (isRefExt === true) {
        var tmp = false;
        var ItemTag = $(objectDOM).find("[class*='iapitemplate:item']");
        var classdataItem = $(ItemTag).attr("class").split(" ");
        for (var i = 0; i < classdataItem.length; i++) {
            if (classdataItem[i].substr(0, 9).toLowerCase() === "dataitem:") {
                var subArrKeyLabel = classdataItem[i].split(":");
                if (subArrKeyLabel.length === 3) {
                    object = {
                        "key": subArrKeyLabel[1],
                        "label": subArrKeyLabel[2]
                    };
                    arrdataAttributeKey.push(object);
                } else if (subArrKeyLabel.length === 2) {
                    object = {
                        "key": subArrKeyLabel[1],
                    };
                    arrdataAttributeKey.push(object);
                }
            }
        }
        $(ItemTag).first().children("[class*='dataattribute:']").each(function () {

            var classdataAttribute = $(this).attr("class").split(" ");
            for (var i = 0; i < classdataAttribute.length; i++) {
                if (classdataAttribute[i].substr(0, 14) === "dataattribute:") {
                    var subArrKeyLabel = classdataAttribute[i].split(":");
                    if (subArrKeyLabel.length === 3) {
                        object = {
                            "key": subArrKeyLabel[1],
                            "label": subArrKeyLabel[2]
                        };
                        arrdataAttributeKey.push(object);
                    }
                }
            }
        });
    }
    calli(arrdataAttributeKey);
}

// scan the "special" Dom object
// (EXAMPLE)   all attribute on a row
//<div class="tab-pane
//iapi
//data:Publications
//json: http://www.floriandaniel.it/ops/pubs.json
//dataitem:Publication
//dataattribute:Authors:author
//dataattribute:Title:title
//dataattribute:Event:where
//dataattribute:Abstract:abstract >

function scanDOMSpecialObject(objectDOM, calli) {

    var arrdataAttributeKey = new Array();
    var dataItemLabel;
    var isRefExt = false;
    var arrObjectDOM = $(objectDOM).attr("class").split(" ");

    var itemValue;
    tagtarg = $(objectDOM).attr("class").split(" ");
    for (var i = 0; i < tagtarg.length; i++) {
        if (tagtarg[i].slice(0, 9) == ("dataitem:")) {
            var subArrKeyLabel = tagtarg[i].split(":");
            if (subArrKeyLabel.length === 3) {
                object = {
                    "key": subArrKeyLabel[1],
                    "label": subArrKeyLabel[2]
                };
                arrdataAttributeKey.push(object);
            } else if (subArrKeyLabel.length === 2) {
                object = {
                    "key": subArrKeyLabel[1],
                };
                arrdataAttributeKey.push(object);
            }

        } else if (tagtarg[i].slice(0, 14) == ("dataattribute:")) {
            var subArrKeyLabel = tagtarg[i].split(":");
            if (subArrKeyLabel.length === 3) {
                object = {
                    "key": subArrKeyLabel[1],
                    "label": subArrKeyLabel[2]
                };
                arrdataAttributeKey.push(object);
            } else if (subArrKeyLabel.length === 2) {
                object = {
                    "key": subArrKeyLabel[1],
                };
                arrdataAttributeKey.push(object);
            }
        }
    }
    calli(arrdataAttributeKey);
}

// get all dataattribute from the stored object
function getFirstRowKeyObject(dataitem, tmp, call) {
    var arr = new Array();
    $.each(tmp, function (key, value) {
        $.each(value, function (key, value) {
            arr.length = 0;
            if (dataitem === true)
                arr.push(key);
            for (var key in value) {
                arr.push(key);
            }
            call(arr);
        });
        return false;
    });
}

//  send a message to middleware to load and Externale page
function getPage(urlSource, idtarget, call) {
    try {
        var pass_data = {
            'action': "getExternal",
            'value': urlSource,
            'idtarget': idtarget
        };
        window.postMessage(JSON.stringify(pass_data), window.location.href);
    } catch (e) {
        alert(e);
    }
    call();
}

//Fetch stored data
function getStored(sourceType, iapiid, source, idtarget, pageId, call) {

    try {
        var pass_data = {
            'action': "getStoredObject",
            'sourceType': sourceType,
            'iapiid': iapiid,
            'urlsource': source,
            'idTarget': idtarget,
            'pageId': pageId

        };

        window.postMessage(JSON.stringify(pass_data), window.location.href);
    } catch (e) {

        alert(e);
    }

    call();
}

// get the HTML page which contains a list of templates
function getTemplateFile(call) {
    try {
        var pass_data = {
            'action': "getTEMPLATE"
        };
        window.postMessage(JSON.stringify(pass_data), window.location.href);
        var flag = true;
        window.addEventListener('message', function (event) {


            if (JSON.parse(event.data).action == "loadTemplate" && flag) {
                flag = false;
                call(JSON.parse(event.data).value);
            }
        });

    } catch (e) {
        alert(e);
    }

}

//Remove the filter in the Overlay
function removeFilter(position) {
    console.log("click remove" + position);
    var id = $("#iapi_menu [class='getAll']").attr("id");
    idtarget = id;
    for (var i = position; i < numRemoveFilter; i++) {
        console.log("iiiiii:" + i);
        $("#" + id).children(".info").children("div:eq(" + i + ")").children("button").each(function () {
            console.log("i:" + i + "_" + $(this)[0].outerHTML);
            if ($(this).attr("name") === "Update" || $(this).attr("name") === "Remove") {
                var name = $(this).attr("name").substr(0, $(this).attr("name").length);
                name += "" + i - 1;
                $(this).attr("name", name);
                var value = $(this).attr("value").substr(0, $(this).attr("value").length - 1);
                value += "" + i - 1;
                $(this).attr("value", value);
                var onclick = $(this).attr("onclick").substr(0, $(this).attr("onclick").length - 2);
                onclick += "" + i - 1 + ")";
                $(this).attr("onclick", onclick);
            }
        });
    }
    $("#" + id).children(".info").children("div:eq(" + position + ")").remove();
    filters.splice(position, 1);
    numRemoveFilter--;
}

//Update the filter in the Overlay
function updateFilter(position) {
    console.log("click update" + position);
    var id = $("#iapi_menu [class='getAll']").attr("id");
    idtarget = id;
    getFilterAtIndex(position, id, function (column, operator, value) {
        animationUpdateFilter(position, id, function () {
            console.log("column:" + column + "_" + operator + "_" + value);
            var ob = {};
            obj = { "column": column, "operator": operator, "value": value };
            filters[position] = obj;
        });
    });
}

//TODO
//Animation after Update (binking)
function animationUpdateFilter(position, id, call) {

}

//Extract the values of the filter in a determinate position ("0" to "numRemoveFilter")
function getFilterAtIndex(index, id, call) {
    var operator = null;
    var column = null;
    var value = null;

    $("#" + id).children(".info").children("div:eq(" + index + ")").children().each(function () {
        if ($(this).prop("tagName").toLowerCase() !== "button") {
            if ($(this).prop("tagName").toLowerCase() === "select") {
                if ($(this).children("option:selected").attr("value") !== "=" && $(this).children("option:selected").attr("value") !== ">" && $(this).children("option:selected").attr("value") !== "<" && $(this).children("option:selected").attr("value") !== ">=" && $(this).children("option:selected").attr("value") !== "<=") {
                    column = $(this).children().filter(":selected").attr("value");
                }
                else
                    operator = $(this).children("option:selected").attr("value");
            }
            else {
                value = $(this).val();
                if (column !== null && value !== null && operator !== null) {
                    call(column, value, operator);
                }
            }
        }
    });

}

//Add filter button
function addFilter() {
    console.log("click add");
    var id = $("#iapi_menu [class='getAll']").attr("id");
    idtarget = id;

    var filter = {};
    var columns = new Array();
    var columnsHide = new Array();
    var column = null;
    var operator = null;
    var value = null;


    getSelected(function () {

        console.log("_____________________________________________");
        filter = { "column": column, "operator": operator, "value": value };
        filters.push(filter);

        //MODIFY PREV FILTER
        var prev = $("#" + id).children(".info").children("div").last().before();

        $(prev).children("button").remove();
        var removeButton = '<button type="text" name="Update" value="Update' + numRemoveFilter + '" onclick="updateFilter(' + numRemoveFilter + ')">Update</button>'
                          + '<button type="text" name="Remove" value="Remove' + numRemoveFilter + '" onclick="removeFilter(' + numRemoveFilter + ')">Remove</button>';

        $(prev).append(removeButton);
        numRemoveFilter++;

        //ADD NEW FILTER
        var newchi = "<div>";
        $("#" + id).children(".info").children("button").first().before(newchi);
        var table = $("#" + id).children(".info").children("div").last();

        newchi = "";
        newchi = '<select class="iapicolumns">'
        for (var j = 0; j < columns.length; j++) {
            newchi += '<option value="' + columns[j] + '" >' + columns[j] + '</option>'
        }
        newchi += '</select><select >'
       + '<option value="=">=</option>'
       + '<option value=">">></option>'
       + '<option value="<"><</option>'
       + '<option value="<="><=</option>'
       + '<option value=">=">>=</option>'
       + '</select>'
       + '<input type="text" name="input_text"></input>'
       + '<button type="text" name="addFilter"  onclick="addFilter()">Add</button>';
        $(table).append(newchi);


        for (var j = 0; j < columnsHide.length; j++) {
            //console.log($("#" + id).children(".info").children("div").last().children(".iapicolumns").html());
            $("#" + id).children(".info").children("div").last().children(".iapicolumns").each(function () {
                $(this).children('[value=' + columnsHide[j] + ']').css("background-color", "red");

            });
        }

        columnsHide.length = 0;
        columns.length = 0;
        column = null;

    });


    function getSelected(call) {
        $("#" + id).children(".info").children("div").last().children().each(function () {
            if ($(this).prop("tagName").toLowerCase() !== "button") {
                if ($(this).prop("tagName").toLowerCase() === "select") {
                    if ($(this).children("option:selected").attr("value") !== "=" && $(this).children("option:selected").attr("value") !== ">" && $(this).children("option:selected").attr("value") !== "<" && $(this).children("option:selected").attr("value") !== ">=" && $(this).children("option:selected").attr("value") !== "<=") {
                        $(this).children().each(function () {
                            if ($(this).css('backgroundColor') === "rgb(255, 0, 0)")
                                columnsHide.push($(this).attr("value"));

                            columns.push($(this).attr("value"));
                            if ($(this).prop("selected") === true) {
                                column = $(this).attr("value");
                            }

                        });
                    }
                    else
                        operator = $(this).children("option:selected").attr("value");
                }
                else {
                    value = $(this).val();
                    if (column !== null && value !== null && operator !== null) {
                        call();
                    }
                }
            }
        });
    }
}

//Apply function button
function apply() {
    var id = $("#iapi_menu [class='getAll']").attr("id");
    idtarget = id;
    console.log("apply" + id);

    ////////////////////////////////////////

    try {
        var pass_data = {
            'action': "filters",
            'values': filters,
            'id': id

        };
        window.postMessage(JSON.stringify(pass_data), window.location.href);
    } catch (e) {
        alert(e);
    }

    ////////////////////////////////////////

    filters.length = 0;
    numRemoveFilter = 0;
    closeOverlay(function () {
    });
    //TODO
}

//Cancel function button
function cancel(id) {
    console.log("Cancel");
    var id = $("#iapi_menu [class='getAll']").attr("id");
    idtarget = id;
    numRemoveFilter = 0;
    filters.length = 0;

    closeOverlay(function () { });
    //TODO
}

//Create and Display main Overlay Same Type
function MainOverlayST() {
    closeOverlay(function () {
        AnimationOverlay('<div class="info">'
               + 'Filter Page...'
               + '<button id="unionButtonST" onclick="STUnion()" >Union</button>'
               + '<button id="substituteButtonST" onclick="Substitute()">Substitute</button>'
               + '<button id="eliminateDuplicatesButtonST"  onclick="STEliminateDuplicates()">Eliminate Duplicates</button>'
               + '</div>');
    });
}

//Create and Display main Overlay Dfferent Type
function MainOverlayDT() {
    closeOverlay(function () {
        AnimationOverlay('<div class="info">'
                      + 'The source and the target object are different Type... So you can match columns Manually(Basic Mode) or Automatically (Advanced Mode)'
                      + '<button id="matchColumnsManuallyButtonDT" onclick="DTMatchColumnsManually()" >Match Columns Manually</button>'
                      + '<button id="matchColumnsAutomaticallyButtonDT" onclick="DTMatchColumnsAutomatically()" >Match Columns Automatically</button>'
                      + '</div>');
    });
}

//Same type Eliminate Duplicates
function STEliminateDuplicates() {
    console.log("STEliminateDuplicates" + idtarget);
    //TODO
}

//Same type function Union
function STUnion() {
    console.log("STUnion" + idtarget);
    closeOverlay(function () {
        AnimationOverlay('<div class="info">'
                    + 'Type of Union...'
                    + '<button id="unionRestrictedButtonST" onclick="STUnionRestricted()" >Restricted Union</button>'
                    + '<button id="unionExtendedButtonST" onclick="STUnionExtended()" >Extended Union</button>'
                    + '<button onclick="closeOverlay()">Cancel</button>'
                    + '<button onclick="MainOverlayST()">Back</button>'
                    + '</div>')
    });
}

//Same type function Union Extended
function STUnionExtended() {
    console.log("STUnionExtended" + idtarget);
    console.log("STUnionAll");
    console.log("idPageSource" + idsourcepage);
    console.log("idSource" + idsource);
    console.log("idPageTarget" + pageID);
    console.log("idTarget" + idtarget);

    /*try {
        var pass_data = {
            'action': "STUnion",
            'subaction': "Extended",
            'idPageSource': idsourcepage,
            'idSource': idsource,
            'idPageTarget': pageID,
            'idTarget': idtarget

        };
        window.postMessage(JSON.stringify(pass_data), window.location.href);

    } catch (e) {
        alert(e);
    }

    closeOverlay(function () {
    });  */
    //TODO
}

//Same type function Union Extended
function STUnionRestricted() {
    console.log("STUnionRestricted" + idtarget);
    console.log("STUnionAll");
    console.log("idPageSource" + idsourcepage);
    console.log("idSource" + idsource);
    console.log("idPageTarget" + pageID);
    console.log("idTarget" + idtarget);

    /*try {
        var pass_data = {
            'action': "STUnion",
            'subaction': "Restricted",
            'idPageSource': idsourcepage,
            'idSource': idsource,
            'idPageTarget': pageID,
            'idTarget': idtarget

        };
        window.postMessage(JSON.stringify(pass_data), window.location.href);

    } catch (e) {
        alert(e);
    }



    closeOverlay(function () {
    });*/
    //TODO
}

///////////COMMON////////////
//Sobstitute the target with the source
function Substitute() {
    console.log("Substitute" + idtarget);
    $("#" + idtarget).empty();
    $("#" + idtarget).removeAttr("style");
    $("#" + idtarget).removeAttr("class");
    $("#" + idtarget).addClass("iapi");

    console.log("source:" + source);
    console.log("idsource:" + idsource);
    console.log("idtarget:" + idtarget);
    console.log("pageID:" + pageID);
    console.log("eventDrop:" + eventDrop);
    old(source, idsource, idtarget, pageID, eventDrop, function () {
        closeOverlay();
    });
}
///////////////////////////

//Different type function Union
function DTUnion() {
    console.log("DTUnionExtended" + idtarget);
    closeOverlay(function () {

        AnimationOverlay('<div class="info">'
                    + 'Type of Union...'
                    + '<button id="unionRestrictedButtonDT" onclick="DTUnionRestricted()" >Restricted Union</button>'
                    + '<button id="unionExtendedButtonDT" onclick="DTUnionExtended()" >Extended Union</button>'
                    + '<button onclick="closeOverlay()">Cancel</button>'
                    + '<button onclick="MainOverlayDT()">Back</button>'
                    + '</div>');
    });
}

//Different type function Union Extended
function DTUnionExtended() {
    console.log("DTUnionExtended" + idtarget);
    closeOverlay(function () {
    });
    //TODO
}

//Different type function Union Extended
function DTUnionRestricted() {
    console.log("DTUnionRestricted" + idtarget);
    closeOverlay(function () {
    });
    //TODO
}

//Different type function join
function DTJoin() {
    console.log("DTJoin" + idtarget);
    closeOverlay(function () {

        AnimationOverlay('<div class="info">'
                    + 'Type of join...'
                    + '<button id="joinComparisonButton" onclick="DTJoinComparison()" >Join Comparison</button>'
                    + '<button id="joinOperatorButton" onclick="DTJoinOperator()">Join Operator</button>'
                    + '<button id="joinXXXButton"  onclick="DTJoinXXXX()">Join XXX</button>'
                    + '</div>');
    });
    //TODO
}

//Different type function join comparison
function DTJoinComparison() {
    console.log("DTJoinComparison" + idtarget);
    closeOverlay(function () {
    });
    //TODO
}

//Different type function join operator
function DTJoinOperator() {
    console.log("DTJoinOperator" + idtarget);
    closeOverlay(function () {
    });
    //TODO
}

//Different type function join operator
function DTMatchColumnsManually() {
    console.log("DTMatchColumnsManually" + idtarget);
    closeOverlay(function () {


        AnimationOverlay('<div class="info">'
                    + 'Select columns... TEST TEST TEST TEST'
                    + '<button onclick="closeOverlay()">OK</button>'
                    + '</div>');
    });
    //TODO
}

//Different type function join operator
function DTMatchColumnsAutomatically() {
    console.log("DTMatchColumnsAutomatically" + idtarget);
    closeOverlay(function () {
        AnimationOverlay('<div class="info">'
                    + 'Based on DBPedia.. The X column in the Source Object can be the Y column in teh Target Object'
                    + '<button onclick="closeOverlay()">OK</button>'
                    + '</div>');
    });
    //TODO
}

//Advanced// REquestDBPedia
function RequestOnDBPedia() {


}

//Close the overlayer with an animation (fadeOUT)
function closeOverlay(call) {
    var imgWidth = $("#" + idtarget).width();
    var imgHeight = $("#" + idtarget).height();
    var negImgWidth = imgWidth - imgWidth - imgWidth;

    $("#" + idtarget).children(".info").animate({ "left": negImgWidth }, 250, function () {
        $("#" + idtarget).children(".info").remove();
        $("#iapi_frame").css('pointer-events', 'auto');
        if (call !== undefined)
            call();
    });
}

//Amimate the Overlay (fadeIN)
function AnimationOverlay(Content) {
    offset = $("#" + idtarget).offset();
    $("#iapi_frame").css('pointer-events', 'none');
    $("#" + idtarget).find(".info").remove();
    filterBox = Content;

    $("#" + idtarget).append(filterBox);

    var imgWidth = $("#" + idtarget).width();
    var imgHeight = $("#" + idtarget).height();
    var negImgWidth = imgWidth - imgWidth - imgWidth;

    $("#" + idtarget).children(".info").fadeTo(0, 0.8);
    $("#" + idtarget).children(".info").css("width", (imgWidth) + "px");
    $("#" + idtarget).children(".info").css("height", (imgHeight) + "px");
    $("#" + idtarget).children(".info").css("top", offset.top + "px");
    $("#" + idtarget).children(".info").css("left", negImgWidth + "px");
    $("#" + idtarget).children(".info").css("visibility", "visible");

    $("#" + idtarget).children(".info").animate({ "left": offset.left }, 250);

}

//Get the titles of columns
function getFirstRowKeyObject(dataitem, tmp, call) {
    var arr = new Array();
    $.each(tmp, function (key, value) {
        $.each(value, function (key, value) {
            arr.length = 0;
            if (dataitem === true)
                arr.push(key);
            for (var key in value) {
                arr.push(key);
            }
            call(arr);
        });
        return false;
    });
}

//Listener resize page, for redraw the overlay
window.addEventListener('resize', function (event) {
    if (overlay) {
        var info = $("#" + idtarget).children(".info");
        $(info).width($("#" + idtarget).width());
        $(info).height($("#" + idtarget).height());
        $("#" + idtarget).children(".info").remove();
        $("#" + idtarget).append(info);
    }
});
