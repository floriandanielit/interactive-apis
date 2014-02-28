var idtarget="";
var code = "";

function allowDrop(ev,pageId)
{
    ev.preventDefault();
    idtarget=ev.target.id;
    ev.target.className = "over";
}


//This function gather and set parameters that must be transfered in the drag operation
function drag(ev,source)
{

    ev.dataTransfer.setData("source", source);
    ev.dataTransfer.setData("tagsource", $("#"+ev.target.id).prop("tagName"))
    ev.dataTransfer.setData("id", ev.target.id);
    hasIdTemplate(ev.target.id,function(msg){
        if(msg !=="NOIDTEMPLATE")
            ev.dataTransfer.setData("idtemplate", msg);
        else
            ev.dataTransfer.setData("idtemplate", msg);
    });
    
}

//Control whether the element has an IdTemplate (means that the template is predifined, so it will load it )
function hasIdTemplate(id, call)
{

    var yourFindElement = $("#"+id);
    var items = $(yourFindElement).find("[class*='dataitem:']")
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
    if (presenceIdtemplate === true) {
        call(idTemplate);
    }
    else
    {
        call("NOIDTEMPLATE");
    }

}

function leave(ev)
{
    ev.target.className = "";
}




//THis function gets all the data that has been sent in the drag process
function drop(ev,pageId)
{

    if (ev.dataTransfer) {
       
        ev.preventDefault();
 		ev.target.className = "";
       
        var idsource = ev.dataTransfer.getData("id");
        var tagsource = ev.dataTransfer.getData("tagsource");
        var source = ev.dataTransfer.getData("source");
        var idTemplate;
        if (ev.dataTransfer.getData("idtemplate") !== "NOIDTEMPLATE")
        {
            idTemplate = ev.dataTransfer.getData("idtemplate");
        }
       
 
        $.getScript("../src/parsers/iAPI.js", function () {
                console.log("Running parsers.js");
                 ///TODO parsers 
                extractIAPI(idsource, source, idtarget, pageId, function () {
                    loadTemplate(idTemplate, ev.target.id, tagsource,pageId, function (ret) {
                        compileTemplate(source, idsource, ret, ev.target.id, pageId, function (ret2) {
                            
                            $("#" + idtarget).empty();
 
                            var replacementTag = ret2.prop("tagName");

                             $("#" + idtarget).each(function () {
                                var outer = this.outerHTML;

                                var regex = new RegExp('<' + this.tagName, 'i');
                                var newTag = outer.replace(regex, '<' + replacementTag);

                                
                                regex = new RegExp('</' + this.tagName + '>', 'i');
                                newTag = newTag.replace(regex, '</' + replacementTag + '>');
                            }); 

                     
                            $("#" + idtarget).html(ret2.children().first());
                            $("#" + idtarget).addClass("iapi");
                            $("#" + idtarget).addClass("datasource:" + source);
                            $("#" + idtarget).addClass("sourcetype:iapi");
                            $("#" + idtarget).addClass("iapiid:" + idsource);

                            ////////////////////////////////////////////////////////////////////////
                            
                           localStorage.setItem(idtarget, $('#' + idtarget)[0].outerHTML);


                            $.getScript("../src/libgen.js", function () {
                               
                                sendMessageMiddleware("finish_inject_template", idtarget,pageId, function (ret) {
                                    console.log("finish_inject_template: " + ret);
                                });
                            });
                        });
                    });       
                });
            });
    

    }
    else {
        alert("Your browser does not support the dataTransfer object.");
    }
}

//Load template 
function loadTemplate(idTemplate, idTarget, tagsource,pageId, callback) {
	
$.ajax({
    url: "http://127.0.0.1:8020/interactive-apis/src/html/templates.html",
    success : function (data) {
      function template(data){
      	if (idTemplate !== undefined){
        	var template = $("<div>" + data + "</div>").find('#'+idTemplate);
        	
        	return template;
       }  
       else{
        var template = $("<div>" + data + "</div>").find(tagsource).first();
        	
        	return template;
       }
     }
      
   callback(template(data));  //load and return the template to process it
   },
    error : function (richiesta,stato,errori) {
        alert("An error has been occured: "+stato);
    }
});

}

//Edit and process the template
function compileTemplate(source, idsource, ret, idtarget,pageId, callback) {

    $.fn.replaceTag = function (newTagObj, keepProps) {
        $this = this;
        var i, len, $result = jQuery([]), $newTagObj = $(newTagObj);
        len = $this.length;
        for (i = 0; i < len; i++) {
            $currentElem = $this.eq(i);
            currentElem = $currentElem[0];
            $newTag = $newTagObj.clone();
            if (keepProps) {//{{{
                newTag = $newTag[0];
                newTag.className = currentElem.className;
                $.extend(newTag.classList, currentElem.classList);
                $.extend(newTag.attributes, currentElem.attributes);

            }//}}}
            $newTag.html(currentElem.innerHTML).replaceAll($currentElem);
            $result.pushStack($newTag);
        }                                                 

        return this;
    }   
    var idTemplate;

   
        var tmp = JSON.parse(localStorage.getItem(pageId));
        tmp = tmp[idtarget];
        getFirstRowKeyObject(tmp, function (arr) {
            
            idTemplate = $(ret).attr("id");
            $(ret).removeAttr('id');
            $(ret).removeAttr("name");


            if ($(ret).prop("tagName").toLowerCase() === "table") {
                ret = $(ret).children();
                var ret2 = $(ret).children().first();
                var titleAttribute = ret2.html();
                ////TODO iterare anche gli attributi titolo colonna

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


function getFirstRowKeyObject(tmp, call) {
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

//send a message to Middleware and wait a response
//TODO
function sendMessageMiddleware(action, id,idPage, call) {
    console.log("call liben.js");
    middlewareAction(action, id,idPage, function (ret) {
            call(ret);
        });
}

