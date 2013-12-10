var idtarget="";
var code = "";

  function allowDrop(ev)
{
ev.preventDefault();
idtarget=ev.target.id;
//ev.dataTransfer.setData("id",idtarget);
console.log(idtarget);
}
//Funzione per definire cosa fare in caso di drag(non funziona)
  function drag(ev,source)
  {
      getAttributeTags(ev.target.id, function (ret) {

          stampMyObj(ret);

          ev.dataTransfer.setData("source", source);
          ev.dataTransfer.setData("id", ev.target.id);
          var j = JSON.stringify(ret);//pass my object in JSON format because dataTransfer support only string
          ev.dataTransfer.setData("foo", j);
          
      });
  }

//Funzione per definire cosa fare in caso di drop(non funziona)
  function drop(ev)
  {

      if (ev.dataTransfer) {
          ev.preventDefault();
          
          var id = ev.dataTransfer.getData("id");
          var ret = JSON.parse(ev.dataTransfer.getData("foo"));
          var source = ev.dataTransfer.getData("source");

          stampMyObj(ret);
          if (ret.type === "iapi") {
              console.log("generate iapi");
          } else if (ret.type === "json") {
              console.log("generate json");
          } else if (ret.type === "rss") {
              console.log("generate rss");
          }
      }
      else {
          alert("Your browser does not support the dataTransfer object.");
      }
}

function generate(urlsource,iapiid,feedtag,itemtag,attributetag,tagsource){


	$.get(urlsource, function(data){
      //  console.log(data);
        if (data=="[object Document]"){

generateRSS(urlsource,feedtag,itemtag,attributetag,tagsource);
}
else{
     		var YourFindElement = $("<div>" + data + "</div>").find('.iapi,#'+iapiid+' [class^=data]');
            //console.log(YourFindElement);

		$.each(YourFindElement , function (i, rowValue) {
			var classarg=$(this).attr("class").split(" ");
            console.log(classarg);
			for(i=0;i<classarg.length;i++){
			if (classarg[i].slice(0,9)==("datafeed:") && $(this).hasClass("iapi")){
				code=code.concat("<"+feedtag+" class=\"iapi "+classarg[i]+"\" id=\""+iapiid+"\">");
			}
			else if (classarg[i].slice(0,9)==("dataitem:")){
    	   			code=code.concat("</"+itemtag+"><"+itemtag+" class=\""+classarg[i]+"\"> \n");
          		}
			else if(classarg[i].slice(0,14)==("dataattribute:")){
				code=code.concat("<"+attributetag+" class=\""+classarg[i]+"\">"+$(this).html()+"</"+attributetag+"> \n");
			}
          		else{

            			//code for not data
          		}}

       		});
			code=code.concat("</"+feedtag+">");

	$(tagsource+"[class~='iapi'][id="+idtarget+"]").html(code);
		}
	});
}

function generate(urlsource,iapiid,feedtag,itemtag,attributetag,tagsource){


	$.get(urlsource, function(data){
      //  console.log(data);
        if (data=="[object Document]"){

generateRSS(urlsource,feedtag,itemtag,attributetag,tagsource);
}
else{
     		var YourFindElement = $("<div>" + data + "</div>").find('.iapi,#'+iapiid+' [class^=data]');
            //console.log(YourFindElement);

		$.each(YourFindElement , function (i, rowValue) {
			var classarg=$(this).attr("class").split(" ");
            console.log(classarg);
			for(i=0;i<classarg.length;i++){
			if (classarg[i].slice(0,9)==("datafeed:") && $(this).hasClass("iapi")){
				code=code.concat("<"+feedtag+" class=\"iapi "+classarg[i]+"\" id=\""+iapiid+"\">");
			}
			else if (classarg[i].slice(0,9)==("dataitem:")){
    	   			code=code.concat("</"+itemtag+"><"+itemtag+" class=\""+classarg[i]+"\"> \n");
          		}
			else if(classarg[i].slice(0,14)==("dataattribute:")){
				code=code.concat("<"+attributetag+" class=\""+classarg[i]+"\">"+$(this).html()+"</"+attributetag+"> \n");
			}
          		else{

            			//code for not data
          		}}

       		});
			code=code.concat("</"+feedtag+">");

	$(tagsource+"[class~='iapi'][id="+idtarget+"]").html(code);
		}
	});
}

//call parseSRC or parseTRG
function getAttributeTags(iapiid, call) {
    var YourFindElement = $(".iapi").filter("#" + iapiid).get();
    
    $.each(YourFindElement, function (i, rowValue) {
        var tagtarg = $(this).attr("class").split(" ");

        var presenceDataSource=false;
        var t;
        for (i = 0; i < tagtarg.length; i++) {
            if (tagtarg[i].slice(0, 11) == ("datasource:")) {
                presenceDataSource=true;
            }
        }
        if (presenceDataSource === true) {
            //console.log("\nYES (presence DataSource)\n");
            parseTRG(YourFindElement, iapiid,function (ret) {
                call(ret);
            });
        }
        else {
            //console.log("\nNO(no presence DataSource)\n");
            parseSRC(YourFindElement, iapiid,function (ret) {
                call( ret);
            });
        }
    });
    
}

//get datasource,iapiid,sourcetype
function parseSRC(YourFindElement,id, callback) {
    //console.log("PARSE_SRC");
    $.each(YourFindElement, function (i, rowValue) {
        var tagtarg = $(this).attr("class").split(" ");
        var id = $(this).attr('id');

        var urlsource;
        var iapiid;
        var sourcetype;
        var arrayHideElements = new Array();

        for (i = 0; i < tagtarg.length; i++) {
            if (tagtarg[i].slice(0, 5) == ("json:")) {
                sourcetype = tagtarg[i].substr(0, 4);
                urlsource = tagtarg[i].substr(5);
            }
            else if (tagtarg[i].slice(0, 4) == ("rss:")) {
                sourcetype = tagtarg[i].substr(0, 3);
                urlsource = tagtarg[i].substr(4);
            }
            else if (tagtarg[i].slice(0, 4) == ("xml:")) {
                sourcetype = tagtarg[i].substr(0, 3);
                urlsource = tagtarg[i].substr(4);
            }
            else if (tagtarg[i].slice(0, 5) == ("hide:")) {//hide:Author:Title:Where
                var hideElements = tagtarg[i].substr(5).split(":");//Author Title Where
                for (var j = 0; j < hideElements.length; j++) {
                    arrayHideElements.push(hideElements[j]);
                }
            }
        }
        if (sourcetype === undefined)
            sourcetype = "iapi";

        ///DEBUG
        //if (urlsource != undefined)
        //    console.log("url:" + urlsource);

        var retCommon = parseCommon(id, sourcetype);
        var ret = {"url":urlsource,"type":sourcetype,"iapiid":iapiid,"hide":arrayHideElements,"other":retCommon};

        callback(ret);
    });

}

//get datasource,iapiid,sourcetype
function parseTRG(YourFindElement, id, callback) {
    //console.log("PARSE_TRG");
    
    $.each(YourFindElement, function (i, rowValue) {
        var tagtarg = $(this).attr("class").split(" ");
        var id = $(this).attr('id');

        var urlsource;
        var sourcetype;
        var iapiid;
        var arrayHideElements = new Array();


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
            else if (tagtarg[i].slice(0, 5) == ("hide:")) {//hide:Author:Title:Where
                var hideElements = tagtarg[i].substr(5).split(":");//Author Title Where
                for (var j = 0; j < hideElements.length; j++) {
                    arrayHideElements.push(hideElements[j]);
                }
            }

        }
        if (sourcetype === "iapi" && iapiid === undefined) {
            console.log("ERROR: you must declare iapiid");
            console.log("TODO");
            //TODO
        }
        
        ///DEBUG
        //if (urlsource != undefined)
        //    console.log("url:" + urlsource);
        //if (iapiid != undefined)
        //    console.log("iapiid:" + iapiid);


        var retCommon = parseCommon(id, sourcetype);
        var ret = { "url": urlsource, "type": sourcetype, "iapiid": iapiid, "hide": arrayHideElements, "other": retCommon };

        callback(ret);
    });
        

}

//get iapitemplate (true/false),dataitems[labe][key] and dataattributes[labe][key]
function parseCommon(id,sourcetype) {

    var YourFindElement2 = $(".iapi").filter("#" + id);

    dataattribute = new Array();
    iapitemplate = false;
    var dataitem;
    var YourFindElement3 = YourFindElement2.find("[class*=dataitem]").attr("class").split(" ");//first().html();
    for (i = 0; i < YourFindElement3.length; i++) {
        if (YourFindElement3[i] === "iapitemplate") {
            iapitemplate = true;
        }
        else if (YourFindElement3[i].slice(0, 9) == "dataitem:") {
            var temp2 = YourFindElement3[i].substr(9);//Publication:pubs or //Publication
            if (sourcetype != "iapi") {
                var n = temp2.indexOf(":");//Publication:pubs
                if (n !== -1) {
                    var a = temp2.substr(0, n);//Publication
                    var b = temp2.substr(n + 1);//pubs

                    if (a === "" || b === "") {
                        console.log("ERROR");
                    }
                    dataitem = ({ "type": YourFindElement3[i].slice(0, 8), "label": a, "key": b });
                } else {//Publication
                    var a = temp2.substr(0);

                    if (a === "" ) {
                        console.log("ERROR");
                    }
                    dataitem = ({ "type": YourFindElement3[i].slice(0, 8), "label": a});
                }

            }
            else {//Publication
                dataitem = ({ "type": YourFindElement3[i].slice(0, 8), "label": temp2 });

            }
        }
    }
    var YourFindElement5 = YourFindElement2.find("[class*=dataitem]");
    var YourFindElement4 = YourFindElement5.first().children("[class*=dataattribute]");
    $.each(YourFindElement4, function (i, rowValue) {
        
       
        if ($(this).attr("class").slice(0, 14) == ("dataattribute:")) {

            var temp = $(this).attr("class").substr(14);//Author:auth or //Author

            if (sourcetype != "iapi") {
                var n = temp.indexOf(":");//Author:auth
                var a = temp.substr(0, n);//Author
                var b = temp.substr(n + 1);//auth


                if (a == "" || b == "") {
                    console.log("ERROR");
                }
                dataattribute.push({ "type": $(this).attr("class").substr(0, 13), "label": a, "key": b });
            }
            else {//Author
                dataattribute.push({ "type": $(this).attr("class").substr(0, 13), "label": temp });
            }
        }
        //console.log("elem ->:" + dataattribute[i].type);


    });
    return {"iapitemplate":iapitemplate,"dataitem":dataitem,"dataattribute":dataattribute};
}

//DEBUG stamp my object
//
//"url",
//"type",
//"iapiid",
//"other":
//       "iapitemplate",
//       "dataitem":"type","label","key"
//       "dataattribute":"type","label","key"
function stampMyObj(ret) {
    console.log("url->" + ret.url);
    console.log("type->" + ret.type);
    console.log("iapiid->" + ret.iapiid);
    if (ret.hide.length !== 0) {
        var txt = "";
        console.log("hide:");
        for (var i = 0; i < ret.hide.length; i++) {
            if (i === 0)
                txt+="\t" + ret.hide[i];
            else
                txt+=" - " + ret.hide[i];
        }
        console.log(txt);
    }
    console.log("other:");
    console.log("\t iapitemplate->" + ret.other.iapitemplate);
    console.log("\t " + ret.other.dataitem.type + " 'label'->" + ret.other.dataitem.label + " 'key'->" + ret.other.dataitem.key);
    for (var i = 0; i < ret.other.dataattribute.length; i++) {
        console.log("\t " + ret.other.dataattribute[i].type + " [" + i + "] 'label'->" + ret.other.dataattribute[i].label + " 'key'->" + ret.other.dataattribute[i].key);
    }
}