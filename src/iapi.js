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
        $.each(data, function(key, value) {

            var subtemplate = template.find("[class*='e-item:']");
           // console.log($(template)[0].outerHTML);

            $.each(value, function(key, value) {
                //console.log(key,value);
                var tmpChild = subtemplate.children();
                for (var j = 0; j < $(tmpChild).length; j++) {


                    $(tmpChild).eq(j).html(function() {
                        $.each(value, function(key, value) {
                        for (var key in value) {

                            //console.log($(tmpChild).eq(j).attr("class").substr(7) === key);

                            if ($(tmpChild).eq(j).attr("class").substr(7) === key) {
                                console.log(value[key]);

                                    return "ciao";

                            }
                        }});
                    });
                }

                txt = txt.concat($(subtemplate)[0].outerHTML);
            });
        });

        template.find("[class*='e-item:']").remove();
        $(template).append(txt);
    }
    $.fn.hide = function (attrTohide,sourceType) {
        var idtarget = this.attr("id");

        getPageId(function () {

            var flag1 = true;
            window.addEventListener('message', function (e) {
                try {


                    if (JSON.parse(e.data).action === "pageidResponse" && flag1) {

                        flag1 = false;

                        pageId = JSON.parse(e.data).pageid;

                        hideDataattribute(idtarget, attrTohide, function () {
                            var tmp = $('#' + idtarget).clone();
                            $(tmp).find("[class*='iapitemplate:item']").nextAll().remove();
                            $(tmp).find("[class*='iapitemplate:item']").children().each(function () {
                                $(this).text("");
                            });

                            getObject(function (tmp) {

                                if (tmp !== undefined) {
                                    tmp = JSON.parse(tmp);
                                    tmp = tmp[idtarget];

                                    if(sourceType === undefined) alert("Error: please insert the source type param " );
                                     else generate(idtarget,tmp,sourceType);
                                }});

                        });
                    }
                } catch (err) {
                    alert("Error: couldnt get page Id " + err)
                }
            }, false);
        });
    }
    $.fn.show = function (attrToshow,sourceType){
        var idtarget = this.attr("id");

        getPageId(function () {

            var flag1 = true;
            window.addEventListener('message', function (e) {
                try {


                    if (JSON.parse(e.data).action === "pageidResponse" && flag1) {

                        flag1 = false;

                        pageId = JSON.parse(e.data).pageid;

                        showDataattribute(idtarget, attrToshow, function () {

                            var tmp = $('#' + idtarget).clone();
                            $(tmp).find("[class*='iapitemplate:item']").nextAll().remove();
                            $(tmp).find("[class*='iapitemplate:item']").children().each(function () {
                                $(this).text("");
                            });

                            getObject(function (tmp) {

                                if (tmp !== undefined) {
                                    tmp = JSON.parse(tmp);
                                    tmp = tmp[idtarget];

                                    if(sourceType === undefined) alert("Error: please insert the source type param " );
                                    else generate(idtarget,tmp,sourceType);
                                }});

                        });
                    }
                } catch (err) {
                    alert("Error: couldnt get page Id " + err)
                }
            }, false);
        });
    }
}(jQuery));


var iapi = (function () {


    return {
        fetchData: function (URL, id,call) {
            var idTarget=id;

            getPage(URL, id, function () {

                var flag = true;
                window.addEventListener('message', function (event) {

                    try {
                        if (JSON.parse(event.data).action == "getPage" && JSON.parse(event.data).idtarget === idTarget && flag) {

                            flag = false;
                            data = JSON.parse(event.data).value;
                            var template = $("<div>" + data + "</div>").find('#' + idTarget);

                            var sourceType = "iapi";
                            var url=URL;
                            var classAttr = $(template).attr("class").split(" ");
                            for (var i = 0; i < classAttr.length; i++) {
                                if (classAttr[i].slice(0, 7) === ("u-json:")) {

                                     var sourceType = "json";
                                    var url = classAttr[i].substr(7);
                                }
                            }

                            var arr=new Array();
                            var arr2=new Array();
                            var obj={};

                            if(sourceType === "json"){
                                var classAttr=template.attr("class").split(" ");
                                for (var i = 0; i < classAttr.length; i++) {
                                    if(classAttr[i].substr(0,7)==="p-attr:"){
                                        var pattr=classAttr[i].substr(7);//  arr.push(classAttr[i].substr(7));

                                        arr.push(pattr.split(":")[0].replace(/(\r\n|\n|\r)/gm, ""));
                                        arr2.push(pattr.split(":")[1].replace(/(\r\n|\n|\r)/gm, ""));
                                    }
                                    if(classAttr[i].substr(0,7)==="e-item:") var eitem=classAttr[i].substr(7);
                                }
                                eitem1=eitem.split(":")[0].replace(/(\r\n|\n|\r)/gm, "");
                                eitem2=eitem.split(":")[1].replace(/(\r\n|\n|\r)/gm, "");
                                // obj={eitem1:arr,eitem2:arr2};
                                obj[eitem1]=arr;
                                obj[eitem2]=arr2;
                            }
                            if(sourceType === "iapi"){
                                var pattr=template.find("[class*='e-item:']").first().children();
                                $.each(pattr,function (key,value) {
                                     //attr= value.attr("class").split(" ");
                                   classAttr=$(value).attr("class").split(" ");
                                    for (var i = 0; i < classAttr.length; i++) {
                                        if(classAttr[i].substr(0,7)==="p-attr:")
                                        arr.push(classAttr[i].substr(7).replace(/(\r\n|\n|\r)/gm, ""));
                                    }
                                });
                                var classAttr=template.find("[class*='e-item:']").attr("class").split(" ");
                                for (var i = 0; i < classAttr.length; i++) {

                                    if(classAttr[i].substr(0,7)==="e-item:") var eitem=classAttr[i].substr(7).replace(/(\r\n|\n|\r)/gm, "");
                                }
                                   obj[eitem]=arr;

                            }

                            extractData(idTarget,url,sourceType,obj,function(data){
                                data = JSON.parse(data);
                                data = data[idTarget];
                                call(data);
                            });

                        }
                    } catch (err) { }

                });

            });

        },
        fillForm:  function(idtarget,program,json,call){
            jsonstr = [ {"attribute":"Citazioni", "value":"1"},{"attribute":"Citazioni", "value":"2"},{"attribute":"Citazioni", "value":"3"},{"attribute":"Citazioni", "value":"4"}];
            var activity=jsonstr;


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
                                        $("#"+idtarget).find("[class*='iapitemplate:item']").each(function (index) {
                                            tmp[index].Publication[activity[index].attribute]=activity[index].value;

                                        });
                                        updateData(idtarget,pageId,tmp,function(){
                                            getObject(function (tmp) {

                                                if (tmp !== undefined) {
                                                    tmp = JSON.parse(tmp);
                                                    tmp = tmp[idtarget];
                                                    call(tmp);
                                                }});
                                        });

                                    }});

                        }
                    } catch (err) {
                        alert("Error: couldnt get page Id " + err)
                    }
                }, false);
            });

        }

    };
}());


function extractData(idTarget,url,sourceType,obj,call) {


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
            'data':data

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



// Add hide property to the selected Dataattribute
function hideDataattribute(id, type, call) {
    var YourFindElement = $(".iapi").filter("#" + id);
    var findHide = false;
    var tagtarg = YourFindElement.attr("class").split(" ");
    var tagtarg2;
    var tagClass = "";
    for (i = 0; i < tagtarg.length; i++) {
        if (tagtarg[i].substr(0, 5) === "hide:") {
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
        tagtarg2 += " hide:" + type;
        tagClass = tagtarg2;
    }

    YourFindElement.attr("class", tagClass);
    call("done");
}

// Remove the Hide property from the selected Dataattribute
function showDataattribute(id, type, call) {
    var YourFindElement = $(".iapi").filter("#" + id);
    var findHide = false;
    var tagClass = "";
    var findDataAttribute = false;
    var tagtarg = YourFindElement.attr("class").split(" ");
    for (i = 0; i < tagtarg.length; i++) {
        if (tagtarg[i].substr(0, 5) === "hide:") {
            findHide = true;
            var arrayHideElement = tagtarg[i].substr(5).split(":");
            if (arrayHideElement.length !== 1)
                tagClass += " " + tagtarg[i].substr(0, 4);
            for (var j = 0; j < arrayHideElement.length; j++) {
                if (arrayHideElement[j] === type) {
                    findDataAttribute = true;
                    tagClass.substr(0, tagClass.length - 1);
                } else {
                    tagClass += ":" + arrayHideElement[j];
                }
            }
        } else {
            if (i === 0)
                tagClass += tagtarg[i];
            else
                tagClass += " " + tagtarg[i];
        }
    }
    YourFindElement.attr("class", tagClass);
    call("done");
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



