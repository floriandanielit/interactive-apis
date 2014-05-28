var flag = true;

//listener for HTML5 messages from the ContentEngine
window.addEventListener('message', function (event) {
    try {
        //console.log("editor::::::" + JSON.parse(event.data).action);
        if (JSON.parse(event.data).action == "startIApiLayer" && flag) {
            flag = false;
            iapi_frame = document.getElementById('iapi_frame');
            if (iapi_frame) {
                iapi_frame.parentNode.removeChild(iapi_frame);
            }

            iapi_menu();
        }
    }
    catch (err) { }
}, false);

iapi_menu();

//Inject the Iframe (highlight the iapi's)
function iapi_menu() {
    if (!document.getElementById("iapi_frame")) {


        $(".iapi").attr("ondragleave", "leave(event)");
        iapi_control = "<div id='iapi_frame' style='border: 3px solid black;display: none; '>"
            + '<div id="iapi_menu" class="iapi_menu" style="background-color:black; padding: 3px; width: 200px;">'
            + '<div style="font-size: 16px;font-weight: bold; color:white;"></div>'
            + '<div style="font-size: 16px;font-weight: bold; color:white;">Formatting:<br/></div>'
            + '<div style="font-size: 16px;font-weight: bold; color:white;">More data:<br/></div>'
            + '<div class="iapiactions"></div>'
            + '<div style="color:white;cursor:pointer;text-decoration: underline">Filter</div>'
            + '<a href="#" style="color:white">For each...</a>'
            + '</div>'
            + '</div>';

        $('body').append(iapi_control);

        $('#iapi_frame').on('mouseleave', function () {
            $('#iapi_frame').hide();
        });

        $('.iapi').on('mouseenter', function () {
            $('#iapi_frame').show();

            offset = $(this).offset();
            $('#iapi_frame').offset({
                top: offset.top,
                left: offset.left
            });
            $('#iapi_frame').height($(this).height() - 6);
            $('#iapi_frame').width($(this).width() - 6);
            $('#iapi_menu').offset({
                top: offset.top,
                left: offset.left + $(this).width() - 3
            });


            $('#iapi_menu').children().first().html(messageIapi_menu($(this).attr("id")));

            //if it's Source page hide the Formatting options
            if (isSrcPage($(this)) === true) {
                secondchild = $("#iapi_menu div:nth-child(2)").css("display", "none");
                thirdchild = $("#iapi_menu div:nth-child(3)").css("display", "none");
                $("#iapi_menu div:nth-child(5)").css("display", "none");

            } else {

                var id = $(this).attr("id");
                var items = $(this).find("[class*='dataitem:']");
                var elementsItem = $(items).attr("class").split(" ");
                var presenceIdtemplate = false;
                var idTemplate;
                for (var i = 0; i < elementsItem.length && presenceIdtemplate === false; i++) {

                    if (elementsItem[i].substr(0, 11) === "idTemplate:") {
                        idTemplate = elementsItem[i].substr(11);
                        presenceIdtemplate = true;
                    }
                }
                if (presenceIdtemplate === false) {
                    secondchild = $("#iapi_menu div:nth-child(2)").css("display", "none");
                    thirdchild = $("#iapi_menu div:nth-child(3)").css("display", "none");
                    $("#iapi_menu div:nth-child(5)").css("display", "none");
                } else {

                    //SET THE FILTER TEXT
                    $("#iapi_menu div:nth-child(5)").css("display", "block");

                    //SET THE IAPI FORMATTING OPTION
                    getTemplateList(function (array) {

                        secondchild = $("#iapi_menu div:nth-child(2)");

                        if (array.length > 0) {
                            secondchild.html('');
                            secondchild.html('Formatting:<br/>');
                            secondchild.css("display", "block");
                        } else {
                            secondchild.css("display", "none");
                        }
                        for (var i = 0; i < array.length; i++) {
                            var newchi = '<input type="radio" class="idtemplate:' + array[i].key + '" value="' + array[i].value + '" >' + array[i].value + '<br/>';
                            secondchild.append(newchi);
                            if (array[i].key === idTemplate)
                                secondchild.children("input").last().prop('checked', 'checked');
                        }
                    });

                    var arr = new Array();
                    var parentNode = $(this);

                    //get the stored object
                    getObject(function (tmp) {
                        if (tmp !== undefined) {
                            tmp = JSON.parse(tmp);
                            if (tmp !== null) {
                                tmp = tmp[id];

                                if (tmp !== undefined) {
                                    getFirstRowKeyObject(false, tmp, function (arr) {
                                        thirdchild = $("#iapi_menu div:nth-child(3)");

                                        if (arr.length > 0) {
                                            thirdchild.html('');
                                            thirdchild.html('More data:<br/>');
                                            thirdchild.css("display", "block");
                                        } else {
                                            thirdchild.css("display", "none");
                                        }
                                        for (var j = 0; j < arr.length; j++) {
                                            var newchi = '<input type="checkbox" name="more_data" value="' + arr[j] + '" >' + arr[j] + '<br/>';
                                            thirdchild.append(newchi);
                                            thirdchild.children("input").last().prop('checked', 'checked');
                                        }

                                        var arrAttr = parentNode.attr("class").split(" ");
                                        for (var i = 0; i < arrAttr.length; i++) {

                                            if (arrAttr[i].substr(0, 5) === "hide:") {
                                                var attribute = arrAttr[i].split(":");
                                                for (var j = 1; j < attribute.length; j++) {
                                                    thirdchild.children('[value=' + attribute[j] + ']').prop('checked', false);
                                                }
                                            }

                                        }
                                    });
                                }
                            }
                        }


                    });
                }
            }

            getActions($(this).attr("class"), $(this).attr("id"), function () {

                $(".iapi").attr("ondragover", "allowDrop(event)");
                $(".iapi").attr("ondrop", "drop(event)");
            });

        });

        //SET CLICK STATUS FORMATTING
        $("#iapi_menu div:nth-child(2)").change(function (i) {
            var values = $(i.target).attr("class").split(" ");
            var idTemplate;
            for (var i = 0; i < values.length; i++) {
                if (values[i].substr(0, 11) === "idtemplate:") {
                    idTemplate = values[i].substr(11);
                    break;
                }
            }
            formattingDOM($("#iapi_menu [class='getAll']").attr("id"), idTemplate);
        });

        //SET CLICK STATUS MORE DATA
        $("#iapi_menu div:nth-child(3)").change(function (i) {
            var totalAttr = 0;
            var checkedAttr = 0;
            $("#iapi_menu div:nth-child(3)").children().each(function () {
                if ($(this).prop("tagName").toLowerCase() === "input" && $(this).is(":checked"))
                    checkedAttr++;
            });
            if (checkedAttr === 0) {
                alert("ERROR: You can't hide more Dataattribute");
                $(i.target).prop('checked', 'checked');
            }
            else {
                var obj = {
                    "type_dataattribute": $(i.target).attr("value"),
                    "value": $(i.target).is(":checked"),
                };
                hideShowDataattributeDOM($("#iapi_menu [class='getAll']").attr("id"), obj);
            }
        });

        //SET CLICK FILTER
        $("#iapi_menu div:nth-child(5)").click(function () {
            //alert("aaaaa");
            var id = $("#iapi_menu [class='getAll']").attr("id");
            if ($("#" + id).children(".info").length === 0) {
                doFilters(id);
            } else {
                cancelFilter(id);
            }
        });
    }
}


function doFilters(id) {
    offset = $("#" + id).offset();


    //////////////////////////////////
    //////////////TODO////////////////
    //////////////////////////////////
    //Load prev filters if there are//
    ///and display on the overlayer///
    //////////////////////////////////

    $("#iapi_frame").css('pointer-events', 'none');
    filterBox = '<div class="info"></div>';
    $("#" + id).append(filterBox);

    var arr = new Array();

    getObject(function (tmp) {

        if (tmp !== undefined) {
            tmp = JSON.parse(tmp);
            if (tmp !== null) {
                tmp = tmp[id];

                if (tmp !== undefined) {
                    getFirstRowKeyObject(false, tmp, function (arr) {
                        var newchi = "<div>";
                        $("#" + id).children(".info").append(newchi);
                        var table = $("#" + id).children(".info").children("div");

                        newchi = "";
                        newchi = '<select class="iapicolumns">'
                        for (var j = 0; j < arr.length; j++) {
                            newchi += '<option value="' + arr[j] + '" >' + arr[j] + '</option>'
                        }
                        newchi += '</select><select>'
                       + '<option value="=">=</option>'
                       + '<option value=">">></option>'
                       + '<option value="<"><</option>'
                       + '<option value="<="><=</option>'
                       + '<option value=">=">>=</option>'
                       + '<option value="contains">contains</option>'
                       + '</select>'
                       + '<input type="text" name="input_text"></input>'
                       //+ '<input type="checkbox" name="caseSensitive" >Case Sensitive</input>'
                       + '<button type="text" name="addFilter"  onclick="addFilter()">Add</button>';
                        $(table).append(newchi);



                        var arrAttr = $("#" + id).attr("class").split(" ");
                        for (var i = 0; i < arrAttr.length; i++) {

                            if (arrAttr[i].substr(0, 5) === "hide:") {
                                var attribute = arrAttr[i].split(":");

                                for (var j = 1; j < attribute.length; j++) {
                                    console.log($("#" + id).children(".info").children("div").children(".iapicolumns").html());
                                    $("#" + id).children(".info").children("div").children(".iapicolumns").each(function () {
                                        $(this).children('[value=' + attribute[j] + ']').css("background-color", "red");

                                    });
                                }
                            }
                        }
                    });
                }
            }
        }
        filterBox = '<button onclick="apply()">Apply</button>'
            + '<button onclick="cancel()">Cancel</button>';
        $("#" + id).children(".info").append(filterBox);
        var imgWidth = $("#" + id).width();
        var imgHeight = $("#" + id).height();
        var negImgWidth = imgWidth - imgWidth - imgWidth;

        $("#" + id).children(".info").fadeTo(0, 0.8);
        $("#" + id).children(".info").css("width", (imgWidth) + "px");
        $("#" + id).children(".info").css("height", (imgHeight) + "px");
        $("#" + id).children(".info").css("top", offset.top + "px");
        $("#" + id).children(".info").css("left", negImgWidth + "px");
        $("#" + id).children(".info").css("visibility", "visible");

        $("#" + id).children(".info").animate({ "left": offset.left }, 250);
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

//return true if the element is a source
function isSrcPage(YourFindElement) {
    var tagtarg = YourFindElement.attr("class").split(" ");
    var presenceDataSource = false;

    for (i = 0; i < tagtarg.length; i++) {
        if (tagtarg[i].slice(0, 11) == ("datasource:")) {
            presenceDataSource = true;
        }
    }
    if (presenceDataSource === true) {
        return false;
    } else {
        return true;
    }
}

//return the list of all the templates (id and name)
function getTemplateList(callback) {
    var array = new Array();

    getTemplateFile(function (data) {
        var template = $("<div>" + data + "</div>").find('#2D');
        var children = template.find("[id^='2D_']");
        $.each(children, function (key, value) {
            array.push({
                "key": $(this).attr("id"),
                "value": $(this).attr("name")
            });
        });
        callback(array);

    });
}

//send a message to Middleware to execute the rendering process (generate)
function sendMessageMiddleware(action, id, idPage, call) {
    var pass_data = {
        'action': "middlewareAction",
        'id': id,
        'idPage': idPage
    };
    window.postMessage(JSON.stringify(pass_data), window.location.href);
    var flag = true;
    window.addEventListener('message', function (e) {
        try {
            if (JSON.parse(e.data).action === "middlewareResponse" && flag) {
                flag = false;
                call(JSON.parse(e.data).ret);
            }
        }
        catch (err) { }
    }), false;
}

//reformat the actual DOM object with the relative template
function formattingDOM(id, idTemplate) {
    getTemplateFile(function (data) {
        pageIdRequest(function (idPage) {
            var template = $("<div>" + data + "</div>").find('#' + idTemplate);
            compileAndInjectTemplate(template, id, idPage, function (ret2) {
                $("#" + id).empty();
                var replacementTag = ret2.prop("tagName");

                ////////////////////////////new
                var $a = $("#" + id);
                var aid = $a.attr('id');
                var aclass = $a.attr('class');
                $a.replaceWith('<' + replacementTag + ' class="' + aclass + '" id="' + aid + '"></' + replacementTag + '>');

                //////////////////////////////
                $("#" + id).html(ret2.html());

                try {
                    var pass_data = {
                        'idTemp': id,
                        'value': $('#' + id)[0].outerHTML
                    };
                    window.postMessage(JSON.stringify(pass_data), window.location.href);
                } catch (e) {
                    alert(e);
                }

                sendMessageMiddleware("formatting", id, idPage, function (ret) {

                    iapi_frame = document.getElementById('iapi_frame');
                    if (iapi_frame) {
                        iapi_frame.parentNode.removeChild(iapi_frame);
                    }
                    iapi_menu();


                    //var pass_data = {
                    //'action': "startIApiLayer"
                    //};
                    //window.postMessage(JSON.stringify(pass_data), window.location.href);

                });
            });
        });

    });
}

//Edit and process the template
function compileAndInjectTemplate(ret, idtarget, idPage, callback) {
    // get the object from the local storage
    getObject(function (tmp) {

        if (tmp !== undefined) {
            tmp = JSON.parse(tmp);
            var idTemplate;
            tmp = tmp[idtarget];
            getFirstRowKeyObject(true, tmp, function (arr) {
                scanDOMObject(idtarget, function (arrdataAttributeKey, dataItemLabel) {

                    idTemplate = $(ret).attr("id");
                    $(ret).removeAttr('id');
                    $(ret).removeAttr("name");
                    if ($(ret).prop("tagName").toLowerCase() === "table") {
                        // if the template is a table I set the name of columns
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
                        for (var h = 0; h < arrdataAttributeKey.length; h++) {
                            var obj = { "key": arrdataAttributeKey[h].key.replace(/(\r\n|\n|\r)/gm, ""), "label": arrdataAttributeKey[h].label.replace(/(\r\n|\n|\r)/gm, "") };
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
                            i++;
                        });
                    }
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
                        for (var j = 1; j < arrdataAttributeKey.length; j++)
                            $(dataitemIterator).append(dataattribute);

                    } else {
                        for (var j = 1; j < arr.length; j++)
                            $(dataitemIterator).append(dataattribute);
                    }
                    //set the j children with array keys
                    $(dataattributeIterator).parent().children().each(function () {
                        $(this).removeClass();
                        if (arrdataAttributeKey.length !== 0) {
                            var i;
                            var find = false;
                            for (i = 0; i < arr.length && find === false; i++) {
                                if (arrdataAttributeKey[0].label.replace(/(\r\n|\n|\r)/gm, "") === arr[i]) {
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
    });
}

// Extract the dataattribute and the relative labels (ex. dataattribute:conference:where)
function scanDOMObject(idtarget, call) {
    var arrdataAttributeKey = new Array();
    var dataItemLabel;
    var isRefExt = false;
    var arrObjectDOM = $("#" + idtarget).attr("class").split(" ");

    for (var i = 0; i < arrObjectDOM.length && isRefExt === false; i++) {
        if (arrObjectDOM[i].substr(0, 11) === "sourcetype:") {
            if (arrObjectDOM[i].substr(11).toLowerCase() !== "iapi")
                isRefExt = true;
        }
    }
    if (isRefExt === true) {
        var tmp = false;
        var ItemTag = $("#" + idtarget).find("[class*='iapitemplate:item']");
        var classdataItem = $(ItemTag).attr("class").split(" ");
        for (var i = 0; i < classdataItem.length; i++) {
            if (classdataItem[i].substr(0, 9).toLowerCase() === "dataitem:") {
                var subArrKeyLabel = classdataItem[i].split(":");
                dataItemLabel = subArrKeyLabel[1];
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
    call(arrdataAttributeKey, dataItemLabel);
}

// Execute the Hide/Show functionality of the Dataattributes
function hideShowDataattributeDOM(id, obj) {
    pageIdRequest(function (idPage) {
        if (obj.value) {
            showDataattribute(id, obj.type_dataattribute, function () {

                var tmp = $('#' + id).clone();
                $(tmp).find("[class*='iapitemplate:item']").nextAll().remove();
                $(tmp).find("[class*='iapitemplate:item']").children().each(function () {
                    $(this).text("");
                });
                try {
                    var pass_data = {
                        'idTemp': id,
                        'value': $(tmp)[0].outerHTML
                    };
                    window.postMessage(JSON.stringify(pass_data), window.location.href);
                } catch (e) {
                    alert(e);
                }
                sendMessageMiddleware("formatting", id, idPage, function (ret) {
                });
            });
        } else {
            console.log(id + "_" + obj.type_dataattribute);
            hideDataattribute(id, obj.type_dataattribute, function () {
                var tmp = $('#' + id).clone();
                $(tmp).find("[class*='iapitemplate:item']").nextAll().remove();
                $(tmp).find("[class*='iapitemplate:item']").children().each(function () {
                    $(this).text("");
                });
                try {
                    var pass_data = {
                        'idTemp': id,
                        'value': $(tmp)[0].outerHTML
                    };
                    window.postMessage(JSON.stringify(pass_data), window.location.href);
                } catch (e) {
                    alert(e);
                }
                sendMessageMiddleware("formatting", id, idPage, function (ret) {
                });
            });
        }
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

//Return the message of the Iapi (Empty Iapi, Source Iapi...)
function messageIapi_menu(id) {

    var iapiDiv = $("#" + id);
    var presenceDataSourceOrData = false;
    var typeData;
    var elementsClass = iapiDiv.attr("class").split(" ");

    for (i = 0; i < elementsClass.length && presenceDataSourceOrData === false; i++) {
        if (elementsClass[i].substr(0, 11) == ("datasource:")) {
            typeData = 'Page with interactions';
            presenceDataSourceOrData = true;
        } else if (elementsClass[i].substr(0, 5) == ("data:")) {
            typeData = elementsClass[i].substr(5);
            presenceDataSourceOrData = true;
        }
    }
    if (presenceDataSourceOrData === true) {
        return typeData;
    } else {
        return "Empty iApi"
    }

}

function getActions(iapiclass, iapiid, call) {
    codeactions = "";
    codeactions = codeactions.concat('<a class="getAll" id=' + iapiid + ' draggable="true" ondragstart="drag(event,document.URL)" href="?iapisource="+window.location.href+"&iapiid="+iapiid+"" style="color:white">Use data</a> <br/>');
    var classes = iapiclass.split(" ");
    for (i = 0; i < classes.length; i++) {
        if (classes[i].slice(0, 4) == ("rss:")) {
            codeactions = codeactions.concat('<a href="#" style="color:white">getRss</a> \n');
        }
    }
    $("div[class~=iapiactions]").html(codeactions);
    call();
}

//get the External page
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

//send a message to middleware to get the actual page id
function getPageId(call) {

    try {
        var pass_data = {
            'action': "pageidRequest",
        };
        window.postMessage(JSON.stringify(pass_data), window.location.href);

    } catch (e) {
        alert(e);
    }
    call();
}

//send a message to middleware to get the template file
function getTemplateFile(call) {

    try {

        var pass_data = {
            'action': "getTEMPLATEeditor"
        };
        window.postMessage(JSON.stringify(pass_data), window.location.href);
        var flag = true;
        window.addEventListener('message', function (event) {
            if (JSON.parse(event.data).action == "loadTemplateEditor" && flag) {
                flag = false;
                call(JSON.parse(event.data).value);
            }
        });

    } catch (e) {
        alert(e);
    }
}
