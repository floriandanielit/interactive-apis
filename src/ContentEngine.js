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
        //GETEXTERNAL////////////////////////////////////////////////////////////
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
        //MIDDLEWAREACTION////////////////////////////////////////////////////////////
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
        //GETSTOREDOBJECT////////////////////////////////////////////////////////////
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
        }
        //STUNION////////////////////////////////////////////////////////////
        if (JSON.parse(e.data).action === "STUnion") {
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


                    /*getFirstRowKeyObject(true, data1, function (ret1) {
                        getFirstRowKeyObject(true, data2, function (ret2) {
                            for (var i = 0; i < ret1.length; i++) {
                                console.log("arr1:" + ret1[i]);
                            }
                            for (var i = 0; i < ret2.length; i++) {
                                console.log("arr2:" + ret2[i]);
                            }
                        });

                    }); */
                    if (JSON.parse(e.data).subAction === "Extended") {
                        STUnionExtended(data1, data2, function (resultObj) {
                            saveSpecificObject(JSON.parse(e.data).idPageTarget, JSON.parse(e.data).idTarget, resultObj, function (res) {
                                //Send to eventHandler if I would generate dinamic Message in EventHandler.js

                                //Do the generate
                                var messageReturn = "done";
                                generate(JSON.parse(e.data).idTarget, JSON.parse(e.data).idPageTarget, function () {
                                    var pass_data = {
                                        'action': "middlewareResponse",
                                        'ret': "MiddlewareGenerate"
                                    };
                                    e.source.postMessage(JSON.stringify(pass_data), e.origin);
                                });
                            });
                        });
                    } else if (JSON.parse(e.data).subAction === "Restricted") {
                        STUnionRestricted(data1, data2, function (resultObj) {
                            saveSpecificObject(JSON.parse(e.data).idPageTarget, JSON.parse(e.data).idTarget, resultObj, function (res) {
                                //Send to eventHandler if I would generate dinamic Message

                                //Do the generate
                                var messageReturn = "done";
                                generate(JSON.parse(e.data).idTarget, JSON.parse(e.data).idPageTarget, function () {
                                    var pass_data = {
                                        'action': "middlewareResponse",
                                        'ret': "MiddlewareGenerate"
                                    };
                                    e.source.postMessage(JSON.stringify(pass_data), e.origin);
                                });
                            });
                        });
                    } else if (JSON.parse(e.data).subAction === "EliminateDuplicates") {
                        STEliminateDuplicates(data1, data2, function (resultObj) {
                            saveSpecificObject(JSON.parse(e.data).idPageTarget, JSON.parse(e.data).idTarget, resultObj, function (res) {

                                //Send to eventHandler if I would generate dinamic Message

                                //Do the generate
                                var messageReturn = "done";
                                generate(JSON.parse(e.data).idTarget, JSON.parse(e.data).idPageTarget, function () {
                                    var pass_data = {
                                        'action': "middlewareResponse",
                                        'ret': "MiddlewareGenerate"
                                    };
                                    e.source.postMessage(JSON.stringify(pass_data), e.origin);
                                });
                            });
                        });
                    }
                });
            });
        }
        //STJOIN////////////////////////////////////////////////////////////
        if (JSON.parse(e.data).action === "STJoin") {
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
                    if (JSON.parse(e.data).subAction === "Comparison") {
                        STJoinComparison(data1, data2, function (resultObj) {
                            saveSpecificObject(JSON.parse(e.data).idPageTarget, JSON.parse(e.data).idTarget, resultObj, function (res) {
                                //Send to eventHandler if I would generate dinamic Message

                                //Do the generate
                                var messageReturn = "done";
                                generate(JSON.parse(e.data).idTarget, JSON.parse(e.data).idPageTarget, function () {
                                    var pass_data = {
                                        'action': "middlewareResponse",
                                        'ret': "MiddlewareGenerate"
                                    };
                                    e.source.postMessage(JSON.stringify(pass_data), e.origin);
                                });
                            });
                        });
                    } else if (JSON.parse(e.data).subAction === "Operator") {
                        STJoinOperator(data1, data2, function (resultObj) {
                            saveSpecificObject(JSON.parse(e.data).idPageTarget, JSON.parse(e.data).idTarget, resultObj, function (res) {
                                //Send to eventHandler if I would generate dinamic Message

                                //Do the generate
                                var messageReturn = "done";
                                generate(JSON.parse(e.data).idTarget, JSON.parse(e.data).idPageTarget, function () {
                                    var pass_data = {
                                        'action': "middlewareResponse",
                                        'ret': "MiddlewareGenerate"
                                    };
                                    e.source.postMessage(JSON.stringify(pass_data), e.origin);
                                });
                            });
                        });
                    } else if (JSON.parse(e.data).subAction === "Attributes") {
                        STJoinAttributes(data1, data2, JSON.parse(e.data).columnSource, JSON.parse(e.data).columnTarget, JSON.parse(e.data).operator, function (resultObj) {
                            saveSpecificObject(JSON.parse(e.data).idPageTarget, JSON.parse(e.data).idTarget, resultObj, function (res) {
                                //Send to eventHandler if I would generate dinamic Message

                                //Do the generate
                                var messageReturn = "done";
                                generate(JSON.parse(e.data).idTarget, JSON.parse(e.data).idPageTarget, function () {
                                    var pass_data = {
                                        'action': "middlewareResponse",
                                        'ret': "MiddlewareGenerate"
                                    };
                                    e.source.postMessage(JSON.stringify(pass_data), e.origin);
                                });
                            });
                        });
                    }
                });
            });
        }
        //GENERATE////////////////////////////////////////////////////////////
        if (JSON.parse(e.data).action === "generate") {
            //  execute the  generate
            idTargte = JSON.parse(e.data).id;
            pageId = JSON.parse(e.data).pageId;
            generate(idTargte, pageId, function () {
            });
        }
        //FILTERS////////////////////////////////////////////////////////////
        if (JSON.parse(e.data).action === "filters") {
            pageIdRequest(function (pageid) {
                getStoredObject(function (dataPAGE) {
                    var dataID = JSON.parse(dataPAGE);
                    try {
                        var idsource = JSON.parse(e.data).id;
                        dataID = dataID[idsource];
                    } catch (er) {
                        dataID = undefined;
                    }

                    doFilter(dataID, JSON.parse(e.data).values, function (resultObj) {
                        saveSpecificObject(pageid, JSON.parse(e.data).id, resultObj, function (res) {
                            //Send to eventHandler if I would generate dinamic Message

                            //Do the generate
                            var messageReturn = "done";
                            generate(JSON.parse(e.data).id, pageid, function () {
                                var pass_data = {
                                    'action': "middlewareResponse",
                                    'ret': "MiddlewareGenerate"
                                };
                                e.source.postMessage(JSON.stringify(pass_data), e.origin);
                            });
                        });
                    });
                });
            });
        }
        //GETOBJECT////////////////////////////////////////////////////////////
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
        //GETSAME////////////////////////////////////////////////////////////
        if (JSON.parse(e.data).action === "getSame") {
            console.log("EnterContentEngine.js");
            getSpecificStoredObject(JSON.parse(e.data).idPageSource, function (data1) {
                data1 = JSON.parse(data1);
                try {
                    var idsource = JSON.parse(e.data).idSource;
                    data1 = data1[idsource];
                } catch (er) {
                    data1 = undefined;
                }

                getSpecificStoredObject(JSON.parse(e.data).idPageTarget, function (data2) {
                    data2 = JSON.parse(data2);
                    try {
                        var idtarget = JSON.parse(e.data).idTarget;
                        data2 = data2[idtarget];
                    } catch (er) {
                        data2 = undefined;
                    }

                    //if (data1 != undefined) {
                    //    for (var i = 0; i < data1.length; i++) {
                    //        console.log("arr1[" + i + "]_" + data1[i]);
                    //    }
                    //} else {
                    //    console.log("arr2[UNDEFINED]");
                    //}
                    //if (data2 != undefined) {
                    //    for (var i = 0; i < data2.length; i++) {
                    //        console.log("arr2[" + i + "]_" + data2[i]);
                    //    }
                    //} else {
                    //    console.log("arr2[UNDEFINED]");
                    //}
                    getFirstRowKeyObject(true, data1, function (arr1) {
                        getFirstRowKeyObject(true, data2, function (arr2) {

                            //console.log("arr1:" + arr1 + "_arr2:" + arr2);
                            SameType(arr1, arr2, function (same) {
                                var pass_data;
                                if (arr1 != undefined && arr2 != undefined) {
                                    pass_data = {
                                        'action': "getSameObjects",
                                        'same': same,
                                        'choise': { "Union": true, "Substitute": true, "Join": true },
                                        "arrSource": arr1,
                                        "arrTarget": arr2
                                    };
                                } else {
                                    pass_data = {
                                        'action': "getSameObjects",
                                        'same': same,
                                        'choise': { "Union": false, "Substitute": true, "Join": false },
                                        "arrSource": arr1,
                                        "arrTarget": arr2
                                    };
                                }

                                //console.log("pass:Action:" + pass_data.action + "_same:" + pass_data.same + "_choise:Union:" + pass_data.choise.Union + "_choise:Substitute:" + pass_data.choise.Substitute + "_choise:Join:" + pass_data.choise.Join);
                                e.source.postMessage(JSON.stringify(pass_data), e.origin);
                            });
                        });
                    });

                });
            });
        }
        //GENERAL////////////////////////////////////////////////////////////
        if (JSON.parse(e.data).idTemp !== undefined) {
            chrome.extension.sendMessage({
                "type": "StoreTemplate",
                "value": JSON.parse(e.data)
            });
        }
        //PAGEIDREQUEST////////////////////////////////////////////////////////////
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
        }
        //GETTEMPLATE////////////////////////////////////////////////////////////
        if (JSON.parse(e.data).action === "getTEMPLATE") {
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
        }
        //GETTEMPLATEEDITOR////////////////////////////////////////////////////////////
        if (JSON.parse(e.data).action === "getTEMPLATEeditor") {
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
function SameType(arrSource, arrTarget, call) {
    //console.log("arrSource:" + arrSource + "_ArrTarget:" + arrTarget);
    if (arrSource !== undefined && arrTarget !== undefined) {
        var count = 0;
        for (var i = 0; i < arrSource.length; i++) {
            for (var j = 0; j < arrTarget.length && find === false; j++) {
                if (arrSource[i] === arrTarget[j]) {
                    find = true;
                }
            }
            if (find) {
                count++;
                find = false;
            }
        }
        if (count === arrSource.length)
            call(true);
        else
            call(false);
    }
    call(false);
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////EXAMPLE SOURCE OBJECT///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//{                                                                                   //<-- Start Object
//  "PRIMO":[                                                                         //<-- Id "DOM" Object
//    {"0":                                                                           //<-- Real Dataitem
//        {
//            "oid":"120",                                                            //\
//            "author":"A. Bouguettaya, Q. Z. Sheng and F. Daniel (Eds.)",            // \
//            "title":"Advanced Web Services",                                        //  \ Data
//            "to_uploadresource":null,                                               //  / Attribute
//            "abstract":"Web services and Service-Oriented Computing (SOC)......",   // /
//            "where":"Springer, 2014. In print. ISBN 978-1-4614-7534-7"}             ///
//         },                                                                         
//    {"1":                                                                           //<-- Dataitem
//        {
//            "oid":"129",                                                            //\
//            "author":"F. Daniel, G. Papadopoulos, P. Thiran (Eds.)",                // \
//            "title":"Mobile Web Information Systems. 10th International........",   //  \ Data
//            "to_uploadresource":null,                                               //  / Attribute
//            "abstract":"This book constitutes the refereed proceedings ........",   // /
//            "where":"Springer, August 2013. ISBN 978-3-642-40275-3"                 ///
//         }         
//     } ....                                                                             
//  ],                                                                                
//  "SECONDO":[                                                                       //<-- Id "DOM" Object
//    {"Publication":                                                                 //<-- Dataitem
//        {
//            "Author":"IAPI SRC PAGE",                                               //\
//            "Title":"The Interactive API (iAPI)",                                   // \
//            "Conference":"Proceedings of ComposableWeb 2013",                       //  > DataAttribute
//            "Href":"HREF",                                                          // / 
//            "Abstract":"ABSTRACT"                                                   ///
//    },                                                
//    {"Publication":                                                                 //<-- Dataitem
//        {
//            "Author":"J. Jara, F. Daniel, F. Casati and M. Marchese",               //\
//            "Title":"From a Simple Flow to Social Applications",                    // \
//            "Conference":"Proceedings of ComposableWeb 2013",                       //  > DataAttribute
//            "Href":"Proceedings of ComposableWeb 2013",                             // / 
//            "Abstract":"Proceedings of ComposableWeb 2013"                          ///
//        }                         
//     }                            
//  ]                                                                                 
//}                                                                                   //<--End Object
//
////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////EXAMPLE TARGET OBJECT//////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//{                                                                                   //<-- Start Object
//  "TERZO":[                                                                         //<-- Id "DOM" Object
//      {"Publication":                                                               //<-- Dataitem
//          {
//              "Author":"IAPI SRC PAGE",                                             //\              
//              "Title":"The Interactive API (iAPI)",                                 // \
//              "Conference":"Proceedings of ComposableWeb 2013",                     //  > DataAttribute
//              "Href":"HREF",                                                        // / 
//              "Abstract":"ABSTRACT"                                                 ///
//          }
//      },                                             
//      {"Publication":                                                               //<-- Dataitem
//          {
//              "Author":"J. Jara, F. Daniel, F. Casati and M. Marchese",             //\              
//              "Title":"From a Simple Flow to Social Applications",                  // \
//              "Conference":"Proceedings of ComposableWeb 2013",                     //  > DataAttribute
//              "Href":"Proceedings of ComposableWeb 2013",                           // / 
//              "Abstract":"Proceedings of ComposableWeb 2013"                        ///
//          }
//      }                      
//  ],                                                                                
//  "Quarto":[                                                                        //<-- Id "DOM" Object
//      {"Publication":                                                               //<-- Dataitem
//          {
//              "Author":"IAPI SRC PAGE",                                             //\              
//              "Title":"The Interactive API (iAPI)",                                 // \
//              "Conference":"Proceedings of ComposableWeb 2013",                     //  > DataAttribute
//              "Href":"HREF","Abstract":"ABSTRACT"                                   // /
//          }                                                                         ///
//      },                                 
//      {"Publication":                                                               //<-- Dataitem
//          {
//              "Author":"J. Jara, F. Daniel, F. Casati and M. Marchese",             //\              
//              "Title":"From a Simple Flow to Social Applications",                  // \
//              "Conference":"Proceedings of ComposableWeb 2013",                     //  > DataAttribute
//              "Href":"Proceedings of ComposableWeb 2013",                           // / 
//              "Abstract":"Proceedings of ComposableWeb 2013"                        ///
//          }                                                                         
//      }                                                                             
//  ]                                                                                 
//}                                                                                   //<--End Object
//

function STEliminateDuplicates(objSource, objTarget, call) {
    if (objSource != undefined && objTarget != undefined) {
        var arr1 = new Array();
        var arr2 = new Array();

        function arrSource(arr1, call) {
            $.each(objSource, function (key, value) {
                $.each(value, function (key, value) {
                    for (var key in value) {
                        arr1.push({ "key": key, "val": value[key] });
                    }
                });
            });
            call(arr1);
        }
        function arrTarget(arr2, call) {
            $.each(objTarget, function (key, value) {
                $.each(value, function (key, value) {
                    for (var key in value) {
                        arr2.push({ "key": key, "val": value[key] });
                    }
                });
            });
            call(arr2);
        }
        arrSource(arr1, function () {
            arrTarget(arr2, function () {
                for (var i = 0; i < arr1.length; i++) {
                    console.log("arr1:" + arr1[i].key + "_" + arr1[i].val);
                }
                for (var i = 0; i < arr2.length; i++) {
                    console.log("arr2:" + arr2[i].key + "_" + arr2[i].val);
                }
                //console.log("READARRAY");

                for (var i = 0; i < arr1.length; i++) {
                    for (var j = 0; j < arr2.length; j++) {
                        if (arr1[i].key === arr2[j].key) {
                            if (arr1[i].val !== arr2[j].val) {
                            }
                        }
                    }
                }

                call(objTarget);
            });
        });

    }
    else
        call(undefined);
}

function STUnionExtended(objSource, objTarget, call) {
    //TODO
    //Union extended
    call();
}

function STUnionRestricted(objSource, objTarget, call) {
    //TODO
    //Union Restricted
    call();
}

function doFilter(localObjectID, filters, call) {
    if (localObjectID != undefined) {
        //for (var i = 0; i < filters.length; i++) {
        //    console.log("Filter[" + i + "]:column:" + filters[i].column + "_" + filters[i].operator + "_" + filters[i].value);
        //}
        //TODO
        if (localObjectID != undefined) {
            var arr = new Array();
            $.each(localObjectID, function (key, value) {
                $.each(value, function (key, value) {
                    for (var key in value) {
                        for (var i = 0; i < filters.length; i++) {
                            
                            if (key === filters[i].column) {
                                console.log("key:" + key);
                                console.log("filters[i].column:" + filters[i].column);

                                if (filters[i].operator === "<") {
                                    if (value[key].localeCompare(filters[i].value) === -1) {
                                        console.log("value[key]:" + value[key]);
                                        console.log("filters[i].value:" + filters[i].value);

                                        console.log("MINORE");
                                    }
                                } else if (filters[i].operator === ">") {
                                    if (value[key].localeCompare(filters[i].value) === 1) {
                                        console.log("value[key]:" + value[key]);
                                        console.log("filters[i].value:" + filters[i].value);

                                        console.log("MAGGIORE");
                                    }
                                } else if (filters[i].operator === "=") {
                                    if (value[key].localeCompare(filters[i].value) === 0) {
                                        console.log("value[key]:" + value[key]);
                                        console.log("filters[i].value:" + filters[i].value);

                                        console.log("UGUALE");
                                    }
                                } else if (filters[i].operator === "<=") {
                                    if (value[key].localeCompare(filters[i].value) === 0 || value[key].localeCompare(filters[i].value) === -1) {
                                        console.log("value[key]:" + value[key]);
                                        console.log("filters[i].value:" + filters[i].value);

                                        console.log("UGUALE MINORE");
                                    }
                                } else if (filters[i].operator === ">=") {
                                    if (value[key].localeCompare(filters[i].value) === 0 || value[key].localeCompare(filters[i].value) === 1) {
                                        console.log("value[key]:" + value[key]);
                                        console.log("filters[i].value:" + filters[i].value);

                                        console.log("UGUALE MAGGIORE");
                                    }
                                } else if (filters[i].operator === "contains") {
                                    if (value[key].indexOf(filters[i].value)!=-1) {
                                        console.log("value[key]:" + value[key]);
                                        console.log("filters[i].value:" + filters[i].value);

                                        console.log("Contains");
                                    }
                                }

                            }
                        }
                    }
                });
            });
        }
        else
            call(undefined);

        //Filters
        call(localObjectID);
    }
    else
        call(undefined);
}

function STJoinComparison(objSource, objTarget, call) {
    //TODO
    //Join Comparison
    call();
}

function STJoinAttributes(objSource, objTarget, columnSource, ColumnTarget, operator, call) {
    //TODO
    //Join Comparison
    call();
}

function STJoinOperator(objSource, objTarget, call) {
    //TODO
    //Join Comparison
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

//Get the titles of columns
function getFirstRowKeyObject(dataitem, tmp, call) {
    if (tmp != undefined) {
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
    else
        call(undefined);

}
