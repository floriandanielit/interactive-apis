// the iApiLayer status
chrome.extension.sendMessage({
    "type": "extension_status"
}, function (msg) {
    middleware(msg.disable, msg.IApiLayerStatus);
});

// listeners to intercept the editor.js messages (request)
window.addEventListener('message', function (e) {
    //console.log(JSON.parse(e.data).action)
    try {
        if (JSON.parse(e.data).action === "getExternal") {
            // if the request from the inject scripts is "getExternal",
            // send to background.js the relative action
            chrome.extension.sendMessage({
                "type": "getExternal",
                "value": JSON.parse(e.data).value
            }, function (data) {
                var pass_data = {
                    'action': "getPage",
                    'value': data,
                    'idtarget': JSON.parse(e.data).idtarget
                };
                e.source.postMessage(JSON.stringify(pass_data), e.origin);
            });
        }
        if (JSON.parse(e.data).action === "middlewareAction") {
            // if the request from the inject scripts is "middlewareAction",
            // execute the  generate
            var messageReturn = "done";
            generate(JSON.parse(e.data).id, JSON.parse(e.data).idPage, function () {
                var pass_data = {
                    'action': "middlewareResponse",
                    'ret': "MiddlewareGenerate"
                };
                e.source.postMessage(JSON.stringify(pass_data), e.origin);
            });
        }
        if (JSON.parse(e.data).action === "getStoredObject") {
            // if the request from the inject scripts is "getStoredObject",
            // extract the data then provide it
            chrome.extension.sendMessage({
                "type": "Extract",
                "value": JSON.parse(e.data)
            }, function (data) {
                chrome.extension.sendMessage({
                    "type": "getStoredObject",
                }, function (data) {
                    var pass_data = {
                        'action': "getData",
                        'value': data,
                        'idTarget': JSON.parse(e.data).idTarget
                    };
                    e.source.postMessage(JSON.stringify(pass_data), e.origin);
                });
            });
        } if (JSON.parse(e.data).action === "STUnion") {
            getSpecificStoredObject(JSON.parse(e.data).idPageSource, function (data1) {
                data1 = JSON.parse(data1);
                try {
                    var idsource = JSON.parse(e.data).idSource;
                    data1 = data1[idsource];
                } catch (er) {
                    data1 = null;
                }
                getSpecificStoredObject(JSON.parse(e.data).idPageTarget, function (data2) {
                    data2 = JSON.parse(data2);
                    try {
                        var idtarget = JSON.parse(e.data).idTarget;
                        data2 = data2[idtarget];
                    } catch (er) {
                        data2 = null;
                    }
                    if (JSON.parse(e.data).subAction === "Extended") {
                        STUnionExtended(data1, data2, function (resultObj) {
                            saveSpecificObject(JSON.parse(e.data).idPageTarget, JSON.parse(e.data).idTarget, resultObj, function (res) {
                                //Send to eventHandler if I would generate dinamic Message
                            });
                        });
                    } else if (JSON.parse(e.data).subAction === "Restricted") {
                        STUnionRestricted(data1, data2, function (resultObj) {
                            saveSpecificObject(JSON.parse(e.data).idPageTarget, JSON.parse(e.data).idTarget, resultObj, function (res) {
                                //Send to eventHandler if I would generate dinamic Message
                            });
                        });
                    }
                });
            });
        } if (JSON.parse(e.data).action === "generate") {
            //  execute the  generate
            idTargte = JSON.parse(e.data).id;
            pageId = JSON.parse(e.data).pageId;
            generate(idTargte, pageId, function () {
            });
        } if (JSON.parse(e.data).action === "filters") {
            pageIdRequest(function (pageid) {
                getStoredObject(function (data) {
                    doFilter(data, JSON.parse(e.data).values, JSON.parse(e.data).id, function () {
                        /*generate(JSON.parse(e.data).id, pageid, function () {
                        }); */
                    });
                });
            });
        }
        if (JSON.parse(e.data).action === "getObject") {
            // if the request from the inject scripts is "getObject",
            // retrieve data from the localStorage
            getStoredObject(function (data) {
                var pass_data = {
                    'action': "getStored",
                    'value': data
                };
                e.source.postMessage(JSON.stringify(pass_data), e.origin);
            });
        }
        if (JSON.parse(e.data).action === "getSame") {
            console.log("EnterContentEngine.js");
            getSpecificStoredObject(JSON.parse(e.data).idPageSource, function (data1) {
                data1 = JSON.parse(data1);
                try {
                    var idsource = JSON.parse(e.data).idSource;
                    data1 = data1[idsource];
                } catch (er) {
                    data1 = null;
                }

                getSpecificStoredObject(JSON.parse(e.data).idPageTarget, function (data2) {
                    data2 = JSON.parse(data2);
                    try {
                        var idtarget = JSON.parse(e.data).idTarget;
                        data2 = data2[idtarget];
                    } catch (er) {
                        data2 = null;
                    }

                    console.log("data1:" + data1);
                    SameType(data1, data2, function (same) {
                        var pass_data = {
                            'action': "getSameObjects",
                            'same': same
                        };
                        e.source.postMessage(JSON.stringify(pass_data), e.origin);
                    });
                });
            });
        }
        if (JSON.parse(e.data).idTemp !== undefined) {
            chrome.extension.sendMessage({
                "type": "StoreTemplate",
                "value": JSON.parse(e.data)
            });
        }
        if (JSON.parse(e.data).action === "pageidRequest") {
            // if the request from the inject scripts is "pageidRequest",
            // provide the injected script with the pageId
            pageIdRequest(function (pageid) {
                var pass_data = {
                    'action': "pageidResponse",
                    'pageid': pageid,
                };
                e.source.postMessage(JSON.stringify(pass_data), e.origin);
            });
        } if (JSON.parse(e.data).action === "getTEMPLATE") {
            chrome.extension.sendMessage({
                "type": "getExternal",
                "value": chrome.extension.getURL('html/templates.html')

            }, function (data) {
                var pass_data = {
                    'action': "loadTemplate",
                    'value': data
                };
                e.source.postMessage(JSON.stringify(pass_data), e.origin);
            });
        } if (JSON.parse(e.data).action === "getTEMPLATEeditor") {
            chrome.extension.sendMessage({
                "type": "getExternal",
                "value": chrome.extension.getURL('html/templates.html')
            }, function (data) {
                var pass_data = {
                    'action': "loadTemplateEditor",
                    'value': data
                };
                e.source.postMessage(JSON.stringify(pass_data), e.origin);
            });
        }

    }
    catch (err) {

    }
}, false);

//Controls if the source and the target object are the same tipe
function SameType(objSource, objTarget, call) {
    call(false);
}

function STUnionExtended(objSource, objTarget, call) {
    call();
}

function STUnionRestricted(objSource, objTarget, call) {
    call();
}

function doFilter(localObject, filters, id, call) {

    call();
}

//the Middleware script
function middleware(disa, iAPILayerDisable) {

    //Check whether the page contains iapi;s annotation
    if (document.getElementsByClassName("iapi").length > 0) {
        var sjq = document.createElement('script');
        sjq.src = chrome.extension.getURL("lib/jquery-2.0.3.js");
        sjq.onload = function () {
            this.parentNode.removeChild(this);
        };
        (document.head || document.documentElement).appendChild(sjq);

        var sq = document.createElement('script');
        sq.src = chrome.extension.getURL("EventHandler.js");
        sq.onload = function () {
            this.parentNode.removeChild(this);
        };
        (document.head || document.documentElement).appendChild(sq);

        //send a message to the backround to notify the presence of iapi/s
        chrome.extension.sendMessage({
            "type": "iAPI presence",
            "presence": "yes"
        });
    } else {
        chrome.extension.sendMessage({
            "type": "iAPI presence",
            "presence": "no"
        });
    }

    if (document.getElementsByClassName("iapi").length > 0) {
        getStoredTemplate(function (data) {
            if (data !== null) {
                data = JSON.parse(data);

                $.each(data, function (id, value) {
                    data = value;
                    html = $.parseHTML(data);

                    StoredTemplate = $(html);
                    $("#" + id).empty();
                    var replacementTag = StoredTemplate.prop("tagName");

                    ////////////////////////////
                    var $a = $("#" + id);
                    var aid = $a.attr('id');
                    $a.replaceWith('<' + replacementTag + ' id="' + aid + '"></' + replacementTag + '>');

                    //////////////////////////////
                    $("#" + id).html(StoredTemplate.html());
                    $("#" + id).removeAttr("class");
                    $("#" + id).addClass(StoredTemplate.attr("class"));

                });
            }

            var YourFindElement = $(".iapi").get();
            var stamp = document.getElementsByClassName("iapi")[0].innerHTML;

            $.each(YourFindElement, function (i, rowValue) {
                var tagtarg = $(this).attr("class").split(" ");
                var id = $(this).attr('id');
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

                    pageIdRequest(function (pageid) {
                        var pass_data = {
                            'action': "extract",
                            'sourceType': sourcetype,
                            'iapiid': iapiid,
                            'urlsource': urlsource,
                            'idTarget': id,
                            'pageId': pageid
                        };

                        chrome.extension.sendMessage({
                            "type": "Extract",
                            "value": JSON.parse(JSON.stringify(pass_data))
                        }, function (data) {
                            generate(id, pageid, function () {

                                var pass_data = {
                                    'action': "startIApiLayer"
                                };
                                window.postMessage(JSON.stringify(pass_data), window.location.href);

                            });
                        });
                    });
                }
            });
        });
    }
}

// rendering
function generate(idTemplate, idPage, call) {

    getStoredObject(function (data) {
        data = JSON.parse(data);
        data = data[idTemplate];
        template = $('#' + idTemplate);
        // select the template
        var arr = {};
        var arrAttr = template.attr("class").split(" ");
        for (var i = 0; i < arrAttr.length; i++) {
            if (arrAttr[i].substr(0, 5) === "hide:") {
                var attribute = arrAttr[i].split(":");
                for (var j = 1; j < attribute.length; j++) {
                    arr[attribute[j]] = attribute[j];
                }
            }
            if (arrAttr[i].slice(0, 11) === ("sourcetype:")) {
                var sourceType = arrAttr[i].substr(11);
            }
        }
        if (sourceType === "iapi") {
            var txt = "";
            $.each(data, function (key, value) {
                var subtemplate = template.find("[class*='dataitem:']");
                //get the dataitem
                // checks whether the template is auto implemented or given by the developer  "Presence of iapitemplate "
                var SplitDataAttribute = subtemplate.attr("class").split(" ");
                var iapiTemplatePresence;
                for (i = 0; i < SplitDataAttribute.length; i++) {
                    if (SplitDataAttribute[i].slice(0, 12) == ("iapitemplate")) {
                        iapiTemplatePresence = SplitDataAttribute[i].substr(0, 12);
                    }
                }

                $.each(value, function (key, value) {
                    var tmpChild = subtemplate.children();
                    for (var j = 0; j < $(tmpChild).length; j++) {
                        $(tmpChild).eq(j).html(function () {
                            for (var key in value) {
                                if ($(tmpChild).eq(j).attr("class").substr(14) === key) {
                                    if (arr[key] !== key)
                                        return value[key];
                                    else
                                        return null;
                                }
                            }
                        });
                    }
                    txt = txt.concat($(subtemplate)[0].outerHTML);
                });
            });
        } else if (sourceType === "json") {
            var txt = "";
            $.each(data, function (key, value) {
                var subtemplate = template.find("[class*='dataitem:']");
                //get the dataitem
                // checks whether the template is auto implemented or given by the developer  "Presence of iapitemplate "
                var SplitDataAttribute = subtemplate.attr("class").split(" ");
                var iapiTemplatePresence;
                for (i = 0; i < SplitDataAttribute.length; i++) {
                    if (SplitDataAttribute[i].slice(0, 12) == ("iapitemplate"))
                        iapiTemplatePresence = SplitDataAttribute[i].substr(0, 12);
                }
                $.each(value, function (key, value) {
                    var tmpChild = subtemplate.children();
                    for (var j = 0; j < $(tmpChild).length; j++) {
                        var arrAtt = $(tmpChild).eq(j).attr("class").split(" ");
                        var array;
                        for (var i = 0; i < arrAtt.length; i++) {
                            if (arrAtt[i].substr(0, 14) === "dataattribute:") {
                                var attribute = arrAtt[i].split(":");
                                array = attribute[2];
                                $(tmpChild).eq(j).html(function () {
                                    for (var key in value) {
                                        if (array === key) {
                                            if (arr[key] !== key)
                                                return value[key];
                                            else
                                                return null;
                                        }
                                    }
                                });
                            }
                        }
                    }
                    txt = txt.concat($(subtemplate)[0].outerHTML);
                });
            });
        }
        template.find('[class*=data]').remove();
        $(template).append(txt);
        call();
    });
}

//Fetch stored data
function getStoredObject(call) {
    chrome.extension.sendMessage({
        "type": "getStoredObject"
    }, function (data) {
        call(data);
    });
}

//Save object
function saveSpecificObject(idPage, idTag, obj, call) {
    chrome.extension.sendMessage({
        "type": "saveSpecificObject",
        "idPage": idPage,
        "idTag": idTag,
        "obj": obj
    }, function (data) {
        call(data);
    });
}

//fetch stored templates
function getStoredTemplate(call) {
    chrome.extension.sendMessage({
        "type": "getStoredTemplate"
    }, function (data) {
        call(data);
    });
}

//get the page Id
function pageIdRequest(call) {
    chrome.extension.sendMessage({
        "type": "requestPageId"
    }, function (data) {
        call(data);
    });
}

//get stored object of a specific page id and a specific tag id
function getSpecificStoredObject(idPage, call) {
    //console.log("Ret:" + idPage);
    chrome.extension.sendMessage({
        "type": "getSpecificStoredObject",
        "PageID": idPage
    }, function (data) {
        call(data);
    });
}