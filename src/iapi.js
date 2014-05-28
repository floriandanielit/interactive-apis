/**
 * @author Anis
 */
( function ($) {

    $.fn.renderData = function (data, idTemplate) {
        var URL = "http://127.0.0.1:8020/Interactive-apis/src/html/templates.html";
        var template;
        var idtarget = this.attr("id");
        var sourceType = "iapi";
        // var data = datas.value;

        if (idTemplate === undefined) {

            generate (idtarget, data, sourceType);
        }
        else {

            jQuery.ajax({
                url: URL,
                success: function (result) {
                    template = $("<div>" + result + "</div>").find('#' + idTemplate);

                    compileAndInjectTemplate(template, idtarget, data, sourceType, function (ret2) {
                        $("#" + idtarget).empty();
                        var replacementTag = ret2.prop("tagName");

                        ////////////////////////////new
                        var $a = $("#" + idtarget);
                        var aid = $a.attr('id');
                        var aclass = $a.attr('class');
                        $a.replaceWith('<' + replacementTag + ' class="' + aclass + '" id="' + aid + '"></' + replacementTag + '>');

                        //////////////////////////////
                        $("#" + idtarget).html(ret2.html());


                        /////////////////////////////////////////////////
                        generate(idtarget, data, sourceType);

                    });
                }
            });
        }
    }


}(jQuery));


var iapi = (function () {


    return {
        fetchData: function (idtarget, source, sourceType, iapiid, call) {


            getPageId(function () {

                //Listener for the page ID
                var flag = true;
                window.addEventListener('message', function (e) {
                    try {
                        if (JSON.parse(e.data).action === "pageidResponse" && flag) {

                            flag = false;
                            pageId = JSON.parse(e.data).pageid;

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
                                            call(data);
                                            // console.log(data);

                                        }
                                    } catch (err) {
                                        alert("Error: couldnt fetch data" + err);
                                    }
                                }, false);
                            });
                        }
                    } catch (err) {
                        alert("Error: couldnt get page Id " + err)
                    }
                }, false);
            });


        },

        increment: function () {
            return ++i;
        }
    };
}());


//send a message to middleware to get the actual page id
function getPageId(call) {

    try {
        var pass_data = {
            'action': "pageidRequest"
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

// rendering
//render the data in the appropriate place
function generate(idtarget,data,sourceType){
    console.log("generate !");
    template = $('#' + idtarget);
    // select the template


    var arr = {};
    console.log(template.attr("class"));
    var arrAttr = template.attr("class").split(" ");
    for (var i = 0; i < arrAttr.length; i++) {
        if (arrAttr[i].substr(0, 5) === "hide:") {
            var attribute = arrAttr[i].split(":");
            for (var j = 1; j < attribute.length; j++) {
                arr[attribute[j]] = attribute[j];
                // console.log(attribute[j]);
            }
        }

    }


    if (sourceType === "iapi") {
        var txt = "";
        $.each(data, function(key, value) {
            var subtemplate = template.find("[class*='dataitem:']");
            //get the dataitem
            // checks whether the template is auto implemented or given by the developer  "Presence of iapitemplate "
            //  console.log(template.html());
            var SplitDataAttribute = subtemplate.attr("class").split(" ");
            var iapiTemplatePresence;
            for ( i = 0; i < SplitDataAttribute.length; i++) {
                if (SplitDataAttribute[i].slice(0, 12) == ("iapitemplate")) {
                    iapiTemplatePresence = SplitDataAttribute[i].substr(0, 12);
                }
            }

            $.each(value, function(key, value) {
                var tmpChild = subtemplate.children();
                for (var j = 0; j < $(tmpChild).length; j++) {
                    $(tmpChild).eq(j).html(function() {
                        for (var key in value) {
                            console.log(arr[key] +" :"+key);
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
        $.each(data, function(key, value) {
            var subtemplate = template.find("[class*='dataitem:']");
            //get the dataitem
            // checks whether the template is auto implemented or given by the developer  "Presence of iapitemplate "
            var SplitDataAttribute = subtemplate.attr("class").split(" ");
            var iapiTemplatePresence;
            for ( i = 0; i < SplitDataAttribute.length; i++) {
                if (SplitDataAttribute[i].slice(0, 12) == ("iapitemplate"))
                    iapiTemplatePresence = SplitDataAttribute[i].substr(0, 12);
            }
            $.each(value, function(key, value) {
                var tmpChild = subtemplate.children();
                for (var j = 0; j < $(tmpChild).length; j++) {
                    var arrAtt = $(tmpChild).eq(j).attr("class").split(" ");
                    var array;
                    for (var i = 0; i < arrAtt.length; i++) {
                        if (arrAtt[i].substr(0, 14) === "dataattribute:") {
                            var attribute = arrAtt[i].split(":");
                            array = attribute[2];
                            $(tmpChild).eq(j).html(function() {
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

    try {
        var pass_data = {
            'idTemp' : idtarget,
            'value' : $('#' + idtarget)[0].outerHTML
        };
        window.postMessage(JSON.stringify(pass_data), window.location.href);
    } catch (e) {
        alert(e);
    }
}

//Fetch stored data
// get the stored object
function getObject(call) {

    try {
        var pass_data = {
            'action' : "getObject"
        };
        window.postMessage(JSON.stringify(pass_data), window.location.href);

    } catch (e) {
        alert(e);
    }
    call();
}


// get all dataattribute from the stored object
function getFirstRowKeyObject(dataitem, tmp, call) {
    var arr = new Array();
    $.each(tmp, function(key, value) {
        $.each(value, function(key, value) {
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
//  scan the Dom object
function scanDOMObject(objectDOM,sourceType, calli) {
    // console.log(sourceType);
    var arrdataAttributeKey = new Array();
    var dataItemLabel;
    var isRefExt = false;
    //  console.log(  $("#"+objectDOM).html());
    if(sourceType ==="json") isRefExt=true;


    if (isRefExt === true) {
        var tmp = false;
        var ItemTag = $("#"+objectDOM).find("[class*='iapitemplate:item']");

        var classdataItem = $(ItemTag).attr("class").split(" ");
        console.log(classdataItem);
        for (var i = 0; i < classdataItem.length; i++) {
            if (classdataItem[i].substr(0, 9).toLowerCase() === "dataitem:") {
                var subArrKeyLabel = classdataItem[i].split(":");

                if (subArrKeyLabel.length === 3) {
                    object = {
                        "key" : subArrKeyLabel[1],
                        "label" : subArrKeyLabel[2]
                    };
                    arrdataAttributeKey.push(object);
                } else if (subArrKeyLabel.length === 2) {
                    object = {
                        "key" : subArrKeyLabel[1]
                    };
                    arrdataAttributeKey.push(object);
                }
            }
        }
        $(ItemTag).first().children("[class*='dataattribute:']").each(function() {

            var classdataAttribute = $(this).attr("class").split(" ");
            for (var i = 0; i < classdataAttribute.length; i++) {
                if (classdataAttribute[i].substr(0, 14) === "dataattribute:") {
                    var subArrKeyLabel = classdataAttribute[i].split(":");
                    if (subArrKeyLabel.length === 3) {
                        object = {
                            "key" : subArrKeyLabel[1],
                            "label" : subArrKeyLabel[2]
                        };
                        arrdataAttributeKey.push(object);
                    }
                }
            }
        });
    }
    console.log(arrdataAttributeKey);
    calli(arrdataAttributeKey);
}
//Edit and process the template
function compileAndInjectTemplate(ret, idtarget,tmp, sourceType, callback) {



    getFirstRowKeyObject(true, tmp, function(arr) {
        idTemplate = $(ret).attr("id");
        $(ret).removeAttr('id');
        $(ret).removeAttr("name");
        if ($(ret).prop("tagName").toLowerCase()=== "table") {
            // if the template is a table I set the name of columns
            ret = $(ret).children();
            var ret2 = $(ret).children().first();
            var titleAttribute = ret2.html();
            for (var k = 2; k < arr.length; k++)
                $(ret2).append(titleAttribute);

            //set the j children with array keys
            $(ret2).children().each(function(i) {
                $(this).empty();
                console.log(arr[i+1]);
                $(this).html("" + arr[i + 1]);
                i++;
            });
        }
        scanDOMObject(idtarget,sourceType, function(arrdataAttributeKey, dataItemLabel) {
            var dataitemIterator = $(ret).find("[class*='iapitemplate:item']");
            $(dataitemIterator).removeClass('dataitem:[label]');
            if (dataItemLabel !== undefined)
                $(dataitemIterator).addClass("dataitem:" + dataItemLabel + ":" + arr[0]);
            else
                $(dataitemIterator).addClass("dataitem:" + arr[0]);
            arr.shift();
            $(dataitemIterator).addClass("idTemplate:" + idTemplate);
            var dataattributeIterator = $(dataitemIterator).children().filter("[class*='iapitemplate:attribute']");
            $(dataattributeIterator).removeClass("iapitemplate:attribute");
            var dataattribute = dataattributeIterator[0].outerHTML;
            //insert j children
            if (arrdataAttributeKey.length !== 0) {
                for (var j = 1; j < arrdataAttributeKey.length; j++){
                    //     console.log("aaa"+ arrdataAttributeKey[j].key +" :"+arrdataAttributeKey[j].label);
                    $(dataitemIterator).append(dataattribute);
                }

            } else {
                for (var j = 1; j < arr.length; j++)
                    $(dataitemIterator).append(dataattribute);
                console.log("bbbb"+dataattribute);
            }
            //set the j children with array keys
            $(dataattributeIterator).parent().children().each(function() {

                $(this).removeClass();
                if (arrdataAttributeKey.length !== 0) {
                    var i;
                    var find = false;
                    for ( i = 0; i < arr.length && find === false; i++) {
                        console.log(arrdataAttributeKey[0].label +"aa:"+arr[i]);
                        //.replace(/(\r\n|\n|\r)/gm, "")
                        if (arrdataAttributeKey[0].label === arr[i]) {
                            find = true;

                            $(this).addClass("dataattribute:" + arrdataAttributeKey[0].key.replace(/(\r\n|\n|\r)/gm, "") + ":" + arr[i]);
                        }
                    }
                    arrdataAttributeKey.shift();
                    if (find === true) {
                        arr.splice(i - 1, 1);
                    }
                } else {
                    $(this).addClass("dataattribute:" + arr[0]);
                    arr.shift();
                }
            });
            if ($(ret).prop("tagName").toLowerCase() === "tbody") {
                callback($(ret).parent());
            } else
                callback(ret);
        });
    });


}
