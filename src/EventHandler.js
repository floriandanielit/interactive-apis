var idtarget = "";
var code = "";
var over = false;
var overlay = false;


var idsource;
var tagsource;
var source;
var idTemplate;
var annotation;
var pageID;
var eventDrop;



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
function drag(ev, source) {

    ev.dataTransfer.setData("source", source);
    ev.dataTransfer.setData("tagsource", $("#" + ev.target.id).prop("tagName"));
    ev.dataTransfer.setData("id", ev.target.id);
    ev.dataTransfer.setData("classAttribute", $("#" + ev.target.id).attr("class"));

    hasIdTemplate(ev.target.id, function (msg) {
        if (msg !== "NOIDTEMPLATE")
            ev.dataTransfer.setData("idtemplate", msg);
        else
            ev.dataTransfer.setData("idtemplate", msg);
    });

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

            console.log("uguali?:" + $(parent).prop('id') === idtarget);
            console.log("attuale:" + $(parent).prop('id'));
            console.log("vecchio:" + idtarget);

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
    tagsource = ev.dataTransfer.getData("tagsource");
    source = ev.dataTransfer.getData("source");
    pageID = pageId;
    var findHide = false;
    var tagtarg = ev.dataTransfer.getData("classAttribute").split(" ");
    for (i = 0; i < tagtarg.length && findHide === false; i++) {
        if (tagtarg[i].substr(0, 5) === "hide:") {
            findHide = true;
            annotation = tagtarg[i];
        }
    }

    idTemplate;
    if (ev.dataTransfer.getData("idtemplate") !== "NOIDTEMPLATE") {
        idTemplate = ev.dataTransfer.getData("idtemplate");
    }


    //////////////////////DATA_INTEGRATION//////////////////////////////

    getParentIAPI(ev.target, function (parent) {
        overlay = true;
        offset = $(parent).offset();
        $("#iapi_frame").css('pointer-events', 'none');
        $(parent).find(".info").remove();
        sameType(source, parent, function (same) {

            //If they are the same type
            if (same) {
                filterBox = '<div class="info">'
                    + 'Filter Page...'
                    + '<button id="unionButtonST" onclick="STUnion()" >Union</button>'
                    + '<button id="substituteButtonST" onclick="Substitute()">Substitute</button>'
                    + '<button id="eliminateDuplicatesButtonST"  onclick="STEliminateDuplicates()">Eliminate Duplicates</button>'
                    + '</div>'
            }
                ////If they aren't the same type
            else {
                filterBox = '<div class="info">'
                   + 'Filter Page...'
                   + '<button id="unionButtonRestrictedDT" onclick="DTUnionRestricted()" >Union Restricted</button>'
                   + '<button id="unionButtonExtendedDT" onclick="DTUnionExtended()" >Union Extended</button>'
                   + '<button id="substituteButtonDT" onclick="Substitute()">Substitute</button>'
                   + '<button id="joinButtonDT"  onclick="DTJoin()">Join</button>'
                   + '</div>'
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
    /////////////////////////////////////////////////


}

function old(source, idsource, idtarget, tagsource, pageId, idTemplate, ev, callback) {

    //load the page
    getPage(source, idtarget, function () {
        // Draged element is a source or a target, then extract related data
        getTypeSource(source, document.URL, idsource, idtarget, function (urlsource, sourceType, iapiid, arr) {


            if (arr === undefined) {
                arr = new Array();
                arr.length = 0;
            }

            loadTemplate(idTemplate, ev.target.id, tagsource, pageId, function (ret) {
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
function loadTemplate(idTemplate, idTarget, tagsource, pageId, callback) {
    getTemplateFile(function (data) {
        function template(data) {
            if (idTemplate !== undefined) {
                var template = $("<div>" + data + "</div>").find('#' + idTemplate);
                return template;
            } else {
                var template = $("<div>" + data + "</div>").find("#2D");
                template = $(template).children().filter(tagsource).first();

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

//Add filter button
function addFilter(id) {
    console.log("click add" + id[1] + "_" + idtarget);
    //TODO
}

//Apply function button
function apply(id) {
    console.log("apply" + idtarget);
    closeOverlay(idtarget);
    //TODO
}

//Apply function button
function cancel(id) {
    console.log("cancel" + idtarget);
    closeOverlay(idtarget);
    //TODO
}

//Same type union
function STEliminateDuplicates() {
    console.log("STEliminateDuplicates" + idtarget);
}

//Same type union
function STUnion() {
    console.log("STUnion" + idtarget);
    //TODO
}

//Sobstitute the target with the source
function Substitute() {
    console.log("Substitute" + idtarget);
    $("#" + idtarget).empty();
    $("#" + idtarget).removeAttr("style");
    $("#" + idtarget).removeAttr("class");
    $("#" + idtarget).addClass("iapi");
    old(source, idsource, idtarget, tagsource, pageID, idTemplate, eventDrop, function () {
        closeOverlay(idtarget);
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

//Different type function Union Extended
function DTUnionExtended() {
    console.log("DTUnionExtended" + idtarget);
    //TODO
}

//Different type function Union Extended
function DTUnionRestricted() {
    console.log("DTUnionRestricted" + idtarget);
    //TODO
}

//Different type function join
function DTJoin() {
    console.log("DTJoin" + idtarget);
    closeOverlay(idtarget, function () {

        offset = $("#"+idtarget).offset();
        $("#iapi_frame").css('pointer-events', 'none');
        $("#" + idtarget).find(".info").remove();
        filterBox = '<div class="info">'
                    + 'Type of join...'
                    + '<button id="joinComparisonButton" onclick="DTJoinComparison()" >Join Comparison</button>'
                    + '<button id="joinOperatorButton" onclick="DTJoinOperator()">Join Operator</button>'
                    + '<button id="joinXXXButton"  onclick="DTJoinXXXX()">Join XXX</button>'
                    + '</div>'

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
    });
    //TODO
}

//Different type function join comparison
function DTJoinComparison() {
    console.log("DTJoinComparison" + idtarget);
    closeOverlay(idtarget, function () {
    });
    //TODO
}

//Different type function join operator
function DTJoinOperator() {
    console.log("DTJoinOperator" + idtarget);
    closeOverlay(idtarget, function () {
    });
    //TODO
}
//Close the overlayer with an animation 
function closeOverlay(id, call) {
    var imgWidth = $("#" + id).width();
    var imgHeight = $("#" + id).height();
    var negImgWidth = imgWidth - imgWidth - imgWidth;

    $("#" + id).children(".info").animate({ "left": negImgWidth }, 250, function () {
        $("#" + id).children(".info").remove();
        $("#iapi_frame").css('pointer-events', 'auto');
        call();

    });

}

//Detect if the source and the target object are the same type
function sameType(objSource, objTarget, callback) {

    //TODO
    callback(false);
}
