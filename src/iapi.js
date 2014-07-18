/**
 * @author Anis
 */
( function ($) {

    $.fn.renderData = function (data) {
        console.log("render");

        var idtarget = this.attr("id");

        template = $('#' + idtarget);
        // select the template
        var arr = {};

        var txt = "";
        $.each(data, function (key, value) {

            var subtemplate = template.find("[class*='e-item:']");
            // console.log($(template)[0].outerHTML);
            for (var k = 0; k < value.length; k++) {

                //  $.each(value, function(key, value) {

                var tmpChild = subtemplate;
                $.each(value[k], function (key, value) {
                    var i = 0;
                    for (var key in value) {

                        $(tmpChild).children().eq(i).html(function () {
                            // for (var key in value) {
                            //if ($(tmpChild).children().eq(i).attr("class").substr(7) === key) {
                            //console.log($(tmpChild).children().eq(i).attr("class").substr(7), key);

                            return value[key];
                            //}

                        });

                        i++;
                    }
                });
                txt = txt.concat($(subtemplate)[0].outerHTML);
                //console.log(txt);
            }

        });
        /* $.each(value, function(key, value) {
         console.log(key,value);
         $(tmpChild).eq(j).html(function() {

         for (var key in value) {
         //console.log(key,value);


         if ($(tmpChild).eq(j).attr("class").substr(7) === key) {
         //  console.log(value[key]);

         return value[key];

         }
         }
         // console.log(value[key]);
         // return value[key];
         });
         });



         }*/


        template.find("[class*='e-item:']").remove();
        $(template).append(txt);
    }
}(jQuery));


var iapi = (function () {

    return {
        fetchData: function (URL, id, call) {
            var idTarget = id;

            getPage(URL, id, function () {

                var flag = true;
                window.addEventListener('message', function (event) {

                    try {
                        if (JSON.parse(event.data).action == "getPage" && JSON.parse(event.data).idtarget === idTarget && flag) {

                            flag = false;
                            data = JSON.parse(event.data).value;
                            var template = $("<div>" + data + "</div>").find('#' + idTarget);

                            var sourceType = "iapi";
                            var url = URL;
                            var classAttr = $(template).attr("class").split(" ");
                            for (var i = 0; i < classAttr.length; i++) {
                                if (classAttr[i].slice(0, 7) === ("u-json:")) {

                                    var sourceType = "json";
                                    var url = classAttr[i].substr(7);
                                }
                            }

                            var arr = new Array();
                            var arr2 = new Array();
                            var obj = {};

                            if (sourceType === "json") {
                                var classAttr = template.attr("class").split(" ");
                                for (var i = 0; i < classAttr.length; i++) {
                                    if (classAttr[i].substr(0, 7) === "p-attr:") {
                                        var pattr = classAttr[i].substr(7);//  arr.push(classAttr[i].substr(7));

                                        arr.push(pattr.split(":")[0].replace(/(\r\n|\n|\r)/gm, ""));
                                        arr2.push(pattr.split(":")[1].replace(/(\r\n|\n|\r)/gm, ""));
                                    }
                                    if (classAttr[i].substr(0, 7) === "e-item:") var eitem = classAttr[i].substr(7);
                                }
                                eitem1 = eitem.split(":")[0].replace(/(\r\n|\n|\r)/gm, "");
                                eitem2 = eitem.split(":")[1].replace(/(\r\n|\n|\r)/gm, "");
                                // obj={eitem1:arr,eitem2:arr2};
                                obj[eitem1] = arr;
                                obj[eitem2] = arr2;
                            }
                            if (sourceType === "iapi") {
                                var pattr = template.find("[class*='e-item:']").first().children();
                                $.each(pattr, function (key, value) {
                                    //attr= value.attr("class").split(" ");
                                    classAttr = $(value).attr("class").split(" ");
                                    for (var i = 0; i < classAttr.length; i++) {
                                        if (classAttr[i].substr(0, 7) === "p-attr:")
                                            arr.push(classAttr[i].substr(7).replace(/(\r\n|\n|\r)/gm, ""));
                                    }
                                });
                                var classAttr = template.find("[class*='e-item:']").attr("class").split(" ");
                                for (var i = 0; i < classAttr.length; i++) {

                                    if (classAttr[i].substr(0, 7) === "e-item:") var eitem = classAttr[i].substr(7).replace(/(\r\n|\n|\r)/gm, "");
                                }
                                obj[eitem] = arr;

                            }

                            extractData(idTarget, url, sourceType, obj, function (data) {
                                data = JSON.parse(data);
                                data = data[idTarget];
                                call(data);
                            });

                        }
                    } catch (err) {
                    }

                });

            });

        },
        join: function (first, second, columnA, columnB, operator, call) {
            //Equijoin
            if (operator === null) {
                STJoinAttributes(first, second, columnA, columnB, "=", function (ObjectMerged) {
                    call(ObjectMerged);
                });
            }
            else {
                STJoinAttributes(first, second, columnA, columnB, operator, function (ObjectMerged) {
                    call(ObjectMerged);
                });
            }
        },
        unionAll: function (objSource, objTarget, call) {

            if (objSource != undefined && objTarget != undefined) {

                var lenA = 0;
                var lenB = 0;

                $.each(objSource, function (key1, value1) {
                    for (; lenA < value1.length; lenA++) {
                    }
                });
                $.each(objTarget, function (key1, value1) {
                    for (; lenB < value1.length; lenB++) {
                    }
                });
                var vett = [];
                vett.length = lenA + lenB;
                $.each(objSource, function (key1, value1) {
                    for (var i = 0; i < value1.length; i++) {
                        vett[i] = value1[i];
                    }
                });
                $.each(objTarget, function (key1, value1) {
                    for (var i = 0; i < value1.length; i++) {
                        vett[i + lenA] = value1[i];
                    }
                });
                $.each(objTarget, function (key1, value1) {
                    objTarget[key1] = vett;
                });

                call(objTarget);
            }
            else
                call(undefined);
        },
        unionWithoutDuplicate: function (objSource, objTarget, call) {

            if (objSource != undefined && objTarget != undefined) {
                iapi.unionAll(objSource, objTarget, function (objTarget) {

                    // true if pub are equal
                    var checkDupe = function (pub1, pub2) {
                        for (var key in pub1) {
                            if (JSON.stringify(pub1[key]) !== JSON.stringify(pub2)) {
                                return false;
                            }
                        }
                        return true;
                    };

                    //false if all equal
                    var checkDupes = function (arr, pub2) {
                        $.each(pub2, function (key1, value1) {
                            var isthere = false;

                            $.each(arr, function (arrKey, arrValue) {
                                isthere = isthere || checkDupe(arr[arrKey], pub2[key1]);
                            });
                            if (!isthere) {
                                arr.push(pub2);
                                return true;
                            }
                            else return false;
                        });
                    };

                    var existingPUBs = [];
                    $.each(objTarget, function (pubKey, pubVal) {
                        for (var i = 0; i < pubVal.length; i++) {
                            checkDupes(existingPUBs, pubVal[i]);
                        }
                    });
                    $.each(objTarget, function (key1, value1) {
                        objTarget[key1] = existingPUBs;
                    });
                    call(objTarget);
                });
            }
            else
                call(undefined);
        },
        doFilter: function (localObjectID, filters, call) {
            if (localObjectID !== undefined) {
                //for (var i = 0; i < filters.length; i++) {
                //   console.log("Filter[" + i + "]:column:" + filters[i].column + "_" + filters[i].operator + "_" + filters[i].value);
                //}
                var ar = new Array();
                $.each(localObjectID, function (key1, value1) {
                    for (var j = 0; j < value1.length; j++) {
                        $.each(value1[j], function (key2, value) {
                            ar.push(value1[j]);
                            for (var i = 0; i < filters.length; i++) {
                                var flag = true;

                                if (filters[i].operator === "<=") {
                                    if (value[filters[i].column].localeCompare(filters[i].value) === 0 || value[filters[i].column].localeCompare(filters[i].value) === -1) {
                                        //console.log("_____<=_____");
                                        flag = false;
                                    }
                                } else if (filters[i].operator === ">=") {
                                    if (value[filters[i].column].localeCompare(filters[i].value) === 0 || value[filters[i].column].localeCompare(filters[i].value) === 1) {
                                        //console.log("_____>=_____");
                                        flag = false;
                                    }
                                } else if (filters[i].operator === "<") {
                                    if (value[filters[i].column].localeCompare(filters[i].value) === -1) {
                                        //console.log("_____<_____");
                                        flag = false;
                                    }
                                } else if (filters[i].operator === ">") {
                                    if (value[filters[i].column].localeCompare(filters[i].value) === 1) {
                                        //console.log("_____>_____");
                                        flag = false;
                                    }
                                } else if (filters[i].operator === "=") {
                                    if (value[filters[i].column].localeCompare(filters[i].value) === 0) {
                                        //console.log("_____=_____");
                                        flag = false;

                                    }
                                } else if (filters[i].operator === "contains") {
                                    if (value[filters[i].column].indexOf(filters[i].value) != -1) {
                                        //console.log("_____contains_____");
                                        flag = false;
                                    }
                                }


                                if (flag) {
                                    ar.pop();
                                    $.each(localObjectID, function (key, value) {
                                        delete localObjectID[key];
                                        localObjectID[key] = ar;
                                    });
                                    break;
                                }
                            }
                        });
                    }
                });

                $.each(localObjectID, function (key1, value1) {
                    if (value1.length != 0)
                        call(localObjectID);  //Return the object
                    else
                        call(undefined);      //Return "undefined" if the object is empty
                });
            }
            else
                call(undefined);

        },
        hide: function (objTarget, options, call) {
            if (objTarget !== undefined) {
                $.each(objTarget, function (key1, value1) {
                    for (var j = 0; j < value1.length; j++) {
                        $.each(value1[j], function (key2, value2) {
                            for (var i = 0; i < options.length; i++) {
                                var count = 0;

                                for (var key in value2)
                                    count++;
                                if (count === 1 && value2[options[i]] !== undefined)
                                    delete value1[j];
                                else
                                    delete value2[options[i]];

                                /*  for (var key in value2) {
                                 if(key === options[i]){
                                 delete value2[options[i]];
                                 }
                                 /* count++;
                                 if (count === 1 && value2[options[i]] !== undefined)
                                 delete value1[j];
                                 else
                                 delete value2[options[i]];*/

                            }
                        });
                    }
                });
                call(objTarget);
            }
        },
        fillForm: function (idtarget, program, json, call) {
            jsonstr = [
                {"attribute": "Citazioni", "value": "1"},
                {"attribute": "Citazioni", "value": "2"},
                {"attribute": "Citazioni", "value": "3"},
                {"attribute": "Citazioni", "value": "4"}
            ];
            var activity = jsonstr;


            getPageId(function () {

                var flag1 = true;
                window.addEventListener('message', function (e) {
                    try {

                        if (JSON.parse(e.data).action === "pageidResponse" && flag1) {

                            flag1 = false;

                            pageId = JSON.parse(e.data).pageid;

                            getObject(function (tmp) {

                                if (tmp !== undefined) {
                                    tmp = JSON.parse(tmp);
                                    tmp = tmp[idtarget];
                                    // console.log($("#"+idtarget).find("[class*='iapitemplate:item']")[0].outerHTML);
                                    $("#" + idtarget).find("[class*='iapitemplate:item']").each(function (index) {
                                        tmp[index].Publication[activity[index].attribute] = activity[index].value;

                                    });
                                    updateData(idtarget, pageId, tmp, function () {
                                        getObject(function (tmp) {

                                            if (tmp !== undefined) {
                                                tmp = JSON.parse(tmp);
                                                tmp = tmp[idtarget];
                                                call(tmp);
                                            }
                                        });
                                    });

                                }
                            });

                        }
                    } catch (err) {
                        alert("Error: couldnt get page Id " + err)
                    }
                }, false);
            });

        }

    };
}());


function extractData(idTarget, url, sourceType, obj, call) {


    try {
        var pass_data = {
            'action': "extractData",
            'idTarget': idTarget,
            'url': url,
            'sourceType': sourceType,
            'obj': obj
        };

        window.postMessage(JSON.stringify(pass_data), window.location.href);

        var flag = true;
        window.addEventListener('message', function (event) {
            if (JSON.parse(event.data).action == "getData" && flag) {
                flag = false;
                call(JSON.parse(event.data).value);
            }
        });

    } catch (e) {

        alert(e);
    }
}


//update data
function updateData(idtarget, pageId, data, call) {
    console.log("send to the content engine");
    try {
        var pass_data = {
            'action': "updateData",
            'idTarget': idtarget,
            'pageId': pageId,
            'data': data

        };

        window.postMessage(JSON.stringify(pass_data), window.location.href);
    } catch (e) {

        alert(e);
    }

    call();
}


//Join two same type object (Attributes)
function STJoinAttributes(objSource, objTarget, columnSource, columnTarget, operator, call) {

    var mergeDupe = function (pub1, pub2) {
        var o = $.extend(true, {}, pub1, pub2);
        return o;
    };

    // true if pub are "operator" (equal,greatest,lower)
    var checkDupe = function (pub1, pub2) {
        if (operator === ">=") {
            if (pub1.localeCompare(pub2) === 1 || pub1.localeCompare(pub2) === 0)
                return true;
        } else if (operator === "<=") {
            if (pub1.localeCompare(pub2) === -1 || pub1.localeCompare(pub2) === 0)
                return true;
        }
        else if (operator === "=") {
            if (pub1.localeCompare(pub2) === 0)
                return true;
        }
        else if (operator === "<") {
            if (pub1.localeCompare(pub2) === -1)
                return true;
        }
        else if (operator === ">") {
            if (pub1.localeCompare(pub2) === 1)
                return true;
        }
        else
            return false;
    };

    //false if all equal
    var checkDupes = function (arr, value1) {
        $.each(objTarget, function (pubKey, pubVal) {
            for (var i = 0; i < pubVal.length; i++) {
                $.each(value1, function (keyA, valueA) {
                    $.each(pubVal[i], function (keyB, valueB) {
                        if (checkDupe(valueA[columnSource], valueB[columnTarget]))
                            arr.push(mergeDupe(value1, pubVal[i]));
                    });
                });
            }
        });

    };

    var existingPUBs = [];
    $.each(objSource, function (pubKey, pubVal) {
        for (var i = 0; i < pubVal.length; i++) {
            checkDupes(existingPUBs, pubVal[i]);
        }
    });

    $.each(objTarget, function (key1, value1) {
        objTarget[key1] = existingPUBs;
    });
    call(objTarget);
}


// rendering
//render the data in the appropriate place
function generate(idtarget, data, sourceType) {
    template = $('#' + idtarget);
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
    }

    if (sourceType === "iapi") {
        var txt = "";
        $.each(data, function (key, value) {
            var subtemplate = template.find("[class*='dataitem:']");
            //get the dataitem
            // checks whether the template is auto implemented or given by the developer  "Presence of iapitemplate "
            //  console.log(template.html());
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
    }
    else if (sourceType === "json") {
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

    ///////////////////////////////////////////////////

}

//Fetch stored data
// get the stored object
// get the stored object
function getObject(call) {

    try {
        var pass_data = {
            'action': "getObject"
        };
        window.postMessage(JSON.stringify(pass_data), window.location.href);

        var flag = true;
        window.addEventListener('message', function (event) {
            if (JSON.parse(event.data).action == "getStored" && flag) {
                flag = false;
                call(JSON.parse(event.data).value);
            }
        });
    } catch (e) {
        alert(e);
    }

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



