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
              for(var k=0;k<value.length;k++){

          //  $.each(value, function(key, value) {

                var tmpChild = subtemplate;
                  $.each(value[k],function(key,value){
                      var i=0;
                      for (var key in value) {
                            console.log($(tmpChild).children().eq(i).attr("class").substr(7), key);
                          $(tmpChild).children().eq(i).html(function() {

                              if ($(tmpChild).children().eq(i).attr("class").substr(7) === key) return value[key];
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
        join: function (first, second, columnA, columnB, operator, call){
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




//Join two same type object (Attributes)
function STJoinAttributes(objSource, objTarget, columnSource, columnTarget, operator, call) {
    //TODO
    //Join Attributes






    var mergeDupe = function (pub1, pub2) {

        var o = $.extend(true, {}, pub2, pub1);


        return o;
    };

    // true if pub are "operator" (equal,greatest,lower)
    var checkDupe = function (pub1, pub2) {
        if (operator === ">=") {
            if (pub1.localeCompare(pub2) === 1 || pub1.localeCompare(pub2) === 0) {
                return true;
            }
        } else if (operator === "<=") {
            if (pub1.localeCompare(pub2) === -1 || pub1.localeCompare(pub2) === 0) {
                return true;
            }
        }
        else if (operator === "=") {
            if (pub1.localeCompare(pub2) === 0) {
                return true;
            }
        }
        else if (operator === "<") {
            if (pub1.localeCompare(pub2) === -1) {
                return true;
            }
        }
        else if (operator === ">") {
            if (pub1.localeCompare(pub2) === 1) {
                return true;
            }
        }
        else
            return false;
    };

    //false if all equal
    var checkDupes = function (arr, value1) {
        $.each(objTarget, function (pubKey, pubVal) {
            for (var i = 0; i < pubVal.length; i++) {
                $.each(pubVal[i], function (key1, value2) {
                    if (checkDupe(value1[columnSource], value2[columnTarget])) {
                        arr.push(mergeDupe(value1, value2));
                    }
                });
            }
        });

    };

    var existingPUBs = [];
    $.each(objSource, function (pubKey, pubVal) {
        for (var i = 0; i < pubVal.length; i++) {
            $.each(pubVal[i], function (key1, value1) {
                checkDupes(existingPUBs, value1);
            });
        }
    });
    $.each(objTarget, function (key1, value1) {
        objTarget[key1] = existingPUBs;
    });







    call(objTarget);
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



