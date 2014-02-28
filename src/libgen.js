function getActions(iapiclass, iapiid){

    codeactions="";
    codeactions = codeactions.concat('<a class="getAll" id=' + iapiid + ' draggable="true" ondragstart="drag(event,document.URL)" href="?iapisource="+window.location.href+"&iapiid="+iapiid+"" style="color:white">Use data</a> <br/>');
    var classes=iapiclass.split(" ");
    for(i=0;i<classes.length;i++){
        if(classes[i].slice(0,4)==("rss:")){
            codeactions=codeactions.concat('<a href="#" style="color:white">getRss</a> \n');
        }
    }
    $("div[class~=iapiactions]").html(codeactions);
}

//Bidimensional target (Div,Table .. ) 
function generate( idTemplate,idPage) {
   
    var data = JSON.parse(localStorage.getItem(idPage));
    var data = data[idTemplate];

    
    template = $('#' + idTemplate);  // select the template

    var arr ={};
    var arrAttr = template.attr("class").split(" ");

    for (var i = 0; i < arrAttr.length; i++) {

        if (arrAttr[i].substr(0, 5) === "hide:") {
            var attribute = arrAttr[i].split(":");
            for (var j = 1; j < attribute.length; j++) {

                arr[attribute[j]]=attribute[j];
            }
        }
        if(arrAttr[i].slice(0, 11) === ("sourcetype:")){

           var sourceType=arrAttr[i].substr(11);

        }
    
    }


    if(sourceType === "iapi"){

    var txt = "";
    $.each(data, function (key, value) {

        var subtemplate = template.find("[class*='dataitem:']");  //get the dataitem

        // checks whether the template is auto implemented or given by the developer  "Presence of iapitemplate "
            var SplitDataAttribute = subtemplate.attr("class").split(" ");
            var iapiTemplatePresence;

            for (i = 0; i < SplitDataAttribute.length; i++) {
                if (SplitDataAttribute[i].slice(0, 12) == ("iapitemplate")) {
                    iapiTemplatePresence = SplitDataAttribute[i].substr(0,12);
                }
            }


                $.each(value, function (key, value) {

                var  tmpChild=subtemplate.children();
                for(var j=0 ;j<$(tmpChild).length;j++ ){
       
                   $(tmpChild).eq(j).html(function(){
                
                       for(var key in value){
      					    if($(tmpChild).eq(j).attr("class").substr(14) === key){
                                 if(arr[key] !== key)     
                                        return value[key] ;
                                    else 
                                        return null ;
                                }
                            }
                        });
                    }

                    txt=txt.concat($(subtemplate)[0].outerHTML);
                });
        

        });
    }
        else if(sourceType === "json"){
			var txt = "";
            $.each(data, function (key, value) {

        	    var subtemplate = template.find("[class*='dataitem:']");  //get the dataitem

                // checks whether the template is auto implemented or given by the developer  "Presence of iapitemplate "
                var SplitDataAttribute = subtemplate.attr("class").split(" ");
                var iapiTemplatePresence;

                for (i = 0; i < SplitDataAttribute.length; i++) {
                    if (SplitDataAttribute[i].slice(0, 12) == ("iapitemplate")) 
                        iapiTemplatePresence = SplitDataAttribute[i].substr(0,12);

                }

                $.each(value, function (key, value) {
                    var  tmpChild=subtemplate.children();

                    for(var j=0 ;j<$(tmpChild).length;j++ ){
                        var arrAtt = $(tmpChild).eq(j).attr("class").split(" ");
					    var array;
                        for (var i = 0; i < arrAtt.length; i++) {
                            if (arrAtt[i].substr(0, 14) === "dataattribute:") {
                                var attribute = arrAtt[i].split(":");
                                array = attribute[2];
                               
                                $(tmpChild).eq(j).html(function(){
                                    for(var key in value){
                                        if (array === key) {
                                              if(arr[key] !== key)
                                             	return value[key] ; 
                                              else 
	                                            return null ;       
                                        }
                                    }
                                });
                            }
                        }
                    }
                   txt=txt.concat($(subtemplate)[0].outerHTML);
                });

                });
    }
        template.find('[class*=data]').remove();
        $(template).append(txt);
    
}

function middlewareAction(msg,id,idPage, callback) {
    var messageReturn = "done";
    generate(id,idPage);
    callback(messageReturn);
}

