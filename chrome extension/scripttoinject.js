var idtarget="";
  function allowDrop(ev)
{
ev.preventDefault();
idtarget=ev.target.id;

}
//Funzione per definire cosa fare in caso di drag(non funziona)
function drag(ev,source)
{
    ev.dataTransfer.setData("source",source);
ev.dataTransfer.setData("id",ev.target.id);

}
//Funzione per definire cosa fare in caso di drop(non funziona)
function drop(ev)
{

ev.preventDefault();
var source=ev.dataTransfer.getData("source");
var id=ev.dataTransfer.getData("id");
generate(source,id,"ul","li","span","div");
//ev.preventDefault();
//var data=ev.dataTransfer.getData("Text");
//ev.target.appendChild(document.getElementById(data));
}
function generate(urlsource,iapiid,feedtag,itemtag,attributetag,tagsource){

var code="";
	$.get(urlsource, function(data){
if (data=="[object Document]"){

generateRSS(urlsource,feedtag,itemtag,attributetag,tagsource);
}
else{
     		var YourFindElement = $("<div>" + data + "</div>").find('.iapi,#'+iapiid+' [class^=data]');
			
 
		$.each(YourFindElement , function (i, rowValue) {
			var classarg=$(this).attr("class").split(" ");
			
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
			
	$(tagsource+"[class~='iapi'][id="+iapiid+"]").html(code);
		}
	});
}