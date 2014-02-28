
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


                    var arr = new Array();
                    var parentNode = $(this);
                    pageIdRequest(function (data) {

                        var tmp = JSON.parse(localStorage.getItem(data));

                        if (tmp !== null) {
                            
                              tmp = tmp[id];
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

	//CHeck whether the page contains iapi;s annotation
    if (document.getElementsByClassName("iapi").length > 0) {

        var sjq = document.createElement('script');
        sjq.src = chrome.extension.getURL("lib/jquery-2.0.3.js");
        sjq.onload = function () {
            this.parentNode.removeChild(this);
        };
        
        (document.head || document.documentElement).appendChild(sjq);


        var s = document.createElement('script');
        s.src = chrome.extension.getURL("scripttoinject.js");
        s.onload = function () {
            this.parentNode.removeChild(this);
        };
        (document.head || document.documentElement).appendChild(s); 
          pageIdRequest(function(pageid){
        $(".iapi").attr("ondragover", "allowDrop(event,"+pageid+")");
          });

        pageIdRequest(function(pageid){
        $(".iapi").attr("ondrop", "drop(event,"+pageid+")");
        });

        $(".iapi").attr("ondragleave", "leave(event)");

		//send a message to the backround to notify the presence of iapi/s 
        chrome.extension.sendMessage({ "type": "iAPI presence", "presence": "yes" }, function () { });
    }
    else {
        chrome.extension.sendMessage({ "type": "iAPI presence", "presence": "no" }, function () { });
    }

    if (document.getElementsByClassName("iapi").length > 0) {

        var YourFindElement = $(".iapi").get();
        var stamp = document.getElementsByClassName("iapi")[0].innerHTML;
        lib = false
      
        $.each(YourFindElement, function (i, rowValue) {
            var tagtarg = $(this).attr("class").split(" ");
            var id = $(this).attr('id');
           
        
             if(localStorage.getItem(id)) {
            
			html = $.parseHTML( localStorage.getItem(id) );
			StoredTemplate=$(html);			
		 	$("#" + id).empty();
		
		         var replacementTag = StoredTemplate.prop("tagName");
                 $("#" + id).each(function () {
                 var outer = this.outerHTML;

                 var regex = new RegExp('<' + this.tagName, 'i');
                 var newTag = outer.replace(regex, '<' + replacementTag);

                
                 regex = new RegExp('</' + this.tagName + '>$', 'i');
                 newTag = newTag.replace(regex, '</' + replacementTag + '>');
               }); 

          $("#" + id).contents().unwrap().wrap('<' + StoredTemplate.prop("tagName") + '/>');                             
          $("#" + id).html(StoredTemplate.children().first());
 	      $("#" + id).addClass("iapi");
                            
            var source;
            var iapiid;
			var _ClassStoredTemplate = StoredTemplate.attr("class").split(" ");           
            
            for (i = 0; i < _ClassStoredTemplate.length; i++) {
                if (_ClassStoredTemplate[i].slice(0, 11) == ("datasource:")) {
                    source = _ClassStoredTemplate[i].substr(11);
                   
                }
                else if (_ClassStoredTemplate[i].slice(0, 7) == ("iapiid:")) {
                    iapiid = _ClassStoredTemplate[i].substr(7);
                   
                }
               

            }

                            $("#" + id).addClass("datasource:" + source);
                            $("#" + id).addClass("sourcetype:iapi");
                            $("#" + id).addClass("iapiid:" + iapiid);
					
					 pageIdRequest(function (pageid) {
                       extractIAPI(iapiid, source,id,pageid ,function () {
                            generate(id,pageid);
                        });
                    });
             }
            
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
                    pageIdRequest(function(pageid){
                        extractJSON(urlsource, id,pageid, function (ret) {
                            generate(id,pageid);
                        });
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
                    pageIdRequest(function (pageid) {
                       extractIAPI(iapiid, urlsource,id,pageid ,function () {
                            generate(id,pageid);
                        });
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
               

                arr.push(key);
            }
            call(arr);
        });
        return false;
    });
}
function getFirstRowKeyObject2(tmp, call) {
    var arr = new Array();
    $.each(tmp, function (key, value) {
        $.each(value, function (key, value) {
            arr.length = 0;
            arr.push(key);
            for (var key in value) {
               arr.push(key);
            }
            call(arr);
        });
        return false;
    });
}


//function:return true if the element is a source
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

//return the list of all the templates (id and name)
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
function sendMessageMiddleware(action,id,idPage,call) {
    middlewareAction(action,id,idPage,function(ret){
            console.log("return from liben.js");
            call(ret);
    });
}

//call sendMessageMiddleware with the current iapiid and the "formatting" tag

function formattingDOM(id, idTemplate) {

    $.get(chrome.extension.getURL('html/templates.html'), function (data) {
        pageIdRequest(function (idPage) {
            var template = $("<div>" + data + "</div>").find('#' + idTemplate);   //source template
            compileAndInjectTemplate(template, id,idPage, function (ret2) {

                $("#" + id).empty();
		        var replacementTag = ret2.prop("tagName");
                $("#" + id).each(function () {
                    var outer = this.outerHTML;
                    var regex = new RegExp('<' + this.tagName, 'i');
                    var newTag = outer.replace(regex, '<' + replacementTag);

                    regex = new RegExp('</' + this.tagName + '>', 'i');
                    newTag = newTag.replace(regex, '</' + replacementTag + '>');
                    
                });
                $("#" + id).contents().unwrap().wrap('<' + ret2.prop("tagName") + '><' + ret2.prop("tagName") + '/>');
                    
                $("#" + id).html(ret2.children().first());
                $("#" + id).addClass("iapi");
                
                ////////////////////////////////////////////////////////////////////////

				localStorage.setItem(id, $('#' + id)[0].outerHTML);

               sendMessageMiddleware("formatting", id, idPage, function (ret) {
                        console.log("formatting: " + ret);
               }); 
            });
        });
    });
   
}

//Edit and process the template
function compileAndInjectTemplate(ret, idtarget,idPage, callback) {

    var idTemplate;
    var tmp = JSON.parse(localStorage.getItem(idPage));
    tmp = tmp[idtarget];
    getFirstRowKeyObject2(tmp, function (arr) {
       
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
                i++
            });
        }

        var dataitemIterator = $(ret).children().filter("[class*='iapitemplate:item']");
        $(dataitemIterator).removeClass('dataitem:[label]');
        $(dataitemIterator).addClass("dataitem:" + arr[0]);
        arr.shift();
        $(dataitemIterator).addClass("idTemplate:" + idTemplate);

        var dataattributeIterator = $(dataitemIterator).children().filter("[class*='iapitemplate:attribute']");
        $(dataattributeIterator).removeClass("iapitemplate:attribute");
        var dataattribute = dataattributeIterator[0].outerHTML;

        //insert j children 
        for (var j = 1; j < arr.length; j++)
            $(dataattributeIterator).parent().append(dataattribute);


        //set the j children with array keys
        $(dataattributeIterator).parent().children().each(function () {
            $(this).removeClass();
            $(this).addClass("dataattribute:" + arr[0]);
            arr.shift();
        });

        //remove iterator dataattribute
        var cnt = $(dataattributeIterator).contents();
        $(dataattributeIterator).replaceWith(cnt);
        if ($(ret).prop("tagName").toLowerCase() === "tbody") {
            callback($(ret).parent());
        }
        else
            callback(ret);
    });
}
//call sendMessageMiddleware with the current iapiid and the tag "more_data"
//format
//<table class="iapi datasource:http://source sourcetype:iapi hide:Author">
function hideShowDataattributeDOM(id, obj) {

    pageIdRequest(function (idPage) {

        if (obj.value) {
            showDataattribute(id, obj.type_dataattribute, function () {
               
                sendMessageMiddleware("more_data", id,idPage, function (ret) {
                    console.log("more_data: " + ret);
                });
            });
        } else {
            hideDataattribute(id, obj.type_dataattribute, function () {
                sendMessageMiddleware("more_data", id,idPage, function (ret) {
                    console.log("more_data: " + ret);
                });
            });
        }
    });

    
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

    sendMessageMiddleware("save", id, function (ret) {
        console.log("save: " + ret);
    });
}


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
    } 

    
}

//send a message to the backround (request for the current page id)
function pageIdRequest(call) {
    chrome.extension.sendMessage({ "type": "requestPageId" }, function (data) {
        call(data);
    });
}