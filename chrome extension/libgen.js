//Questa funzione serve a generare il codice nel caso in cui la iApi sia semplice(senza librerie esterne o RSS
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
	$(tagsource+"[class~='iapi'][class~='source:"+urlsource+"'][class~='iapiid:"+iapiid+"']").html(code);
		}
	});
}
//Questa funzione genera il codice nel caso in cui la iApi sia generata da un RSS
function generateRSS(urlsource,feedtag,itemtag,attributetag,tagsource){
 jQuery.getFeed({
 url: urlsource,
   success: function(feed) {

   codefeed="";
	 rssItem=feed.items;
	 
		codefeed=codefeed.concat("<"+feedtag+">");
		for (i=0;i<rssItem.length;i++){
		
			codefeed=codefeed.concat("<"+itemtag+">");
			codefeed=codefeed.concat("<"+attributetag+">"+rssItem[i].title+"</"+attributetag+">");
			codefeed=codefeed.concat("<"+attributetag+">"+rssItem[i].link+"</"+attributetag+">");
			codefeed=codefeed.concat("<"+attributetag+">"+rssItem[i].description+"</"+attributetag+">");
			codefeed=codefeed.concat("<"+attributetag+">"+rssItem[i].updated+"</"+attributetag+">");
			codefeed=codefeed.concat("<"+attributetag+">"+rssItem[i].id+"</"+attributetag+">");
			codefeed=codefeed.concat("</"+itemtag+">");
		}
		codefeed=codefeed.concat("</"+feedtag+">");
		$(tagsource+"[class~='iapi'][class~='source:"+urlsource+"']").html(codefeed);
   }
 });
}
//Questa funzione genera il codice nel caso in cui la iApi sia generata utilizzando una libreria esterna
function generateExt(urlsource,iapiid,feedtag,itemtag,attributetag,tagsource,iapilib,iapitype){

var code="";
$.getJSON(iapilib, function(data) {
$.get(urlsource, function(data2){
var YourFindElement = $("<div>" + data2 + "</div>").find(data.iapifeed +',#'+iapiid+' [class^=data]');
var Items=$(YourFindElement).find(data.iapiitem);
code=code.concat("<"+feedtag+" class=\"iapi\" id=\""+iapiid+"\">");
code=code.concat("<"+itemtag+">");
$.each(data.iapiattribute,function(id,va){
code=code.concat("<"+attributetag+" class=\"\">"+id+"</"+attributetag+"> \n");

});
code=code.concat("</"+itemtag+">");
$.each(Items , function (i, rowValue) {
code=code.concat("</"+itemtag+">\n<"+itemtag+" class=\""+$(rowValue).attr("class")+"\"> ");
$.each(data.iapiattribute, function (i,v){
			
					attribute=$(rowValue).find(v);
					code=code.concat("<"+attributetag+" ");
					
					
					
					$(attribute).each(function() {
   var attArrayvalue = [];
   var attArrayname=[];
   for(var k = 0; k < this.attributes.length; k++) {
       var attr = this.attributes[k];
       
          attArrayvalue.push(attr.value);
		  
		  attArrayname.push(attr.name);
   
    
	 

  }
  for(var j=0;j<attArrayname.length;j++){
  
  code=code.concat(attArrayname[j]+"=\""+attArrayvalue[j]+"\" ");
  }
  
 
});
					
				code=code.concat(">"+$(attribute).html()+"</"+attributetag+"> \n");
				
			
			
});
       		
			code=code.concat("</"+feedtag+">");
			
	$(tagsource+"[class~='iapi'][class~='source:"+urlsource+"'][class~='iapiid:"+iapiid+"']").html(code);
});

});
 });
}

//Questa funzione serve a generare dinamicamente il codice del menu che compare al passaggio del mouse sopra una iApi
function getActions(iapiclass, iapiid){

codeactions="";
codeactions=codeactions.concat('<a class="getAll" id="1" draggable="true" ondragstart="drag(event,document.URL)" href="?iapisource="+window.location.href+"&iapiid="+iapiid+"" style="color:white">Use data</a> <br/>');
var classes=iapiclass.split(" ");
for(i=0;i<classes.length;i++){
if(classes[i].slice(0,4)==("rss:")){
codeactions=codeactions.concat('<a href="#" style="color:white">getRss</a> \n');
}
}
$("div[class~=iapiactions]").html(codeactions);
}

//Funzione per eliminare l'azione di reindirizzamento per il drop (non funziona)
  function allowDrop(ev)
{
ev.preventDefault();
}
//Funzione per definire cosa fare in caso di drag(non funziona)
function drag(ev)
{
    alert("drag");
//ev.dataTransfer.setData("sourceURL",sourceURL);
//ev.dataTransfer.setData("sourceAPI",sourceAPI);
}
//Funzione per definire cosa fare in caso di drop(non funziona)
function drop(ev)
{
ev.preventDefault();
var data=ev.dataTransfer.getData("Text");
ev.target.appendChild(document.getElementById(data));
}
//Funzione che utilizzo per ricavarmi alcuni parametri dagli URL
  function getUrlVars(url) {
                var vars = {};
                var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                    if(vars[key]){
                        if(vars[key] instanceof Array){
                            vars[key].push(value);
                        }else{
                            vars[key] = [vars[key], value];
                        }
                    }else{
                        vars[key] = value;
                    }
                });
                return vars;
            }

