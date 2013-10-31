
$(document).ready(function(){

	iapi_control = "<div id='iapi_frame' style='border: 3px solid black; display: none;'>" +
	               '<div id="iapi_menu" class="iapi_menu" style="background-color:black; padding: 3px; width: 200px;">'+
	               '<div style="font-size: 16px;font-weight: bold; color:white;">Available iAPI actions</div>'+
	               '<div class="iapiactions"></div>'+
	               '<a href="#" style="color:white">For each...</a>'+
	               '</div></div>';
	               
	$('body').append(iapi_control);
	
	$('#iapi_frame').on('mouseleave', function(){ $('#iapi_frame').hide(); });


	$('.iapi').on('mouseenter', function(){
		
		$('#iapi_frame').show();
		
		getActions($(this).attr("class"),$(this).attr("id"));
	
		offset = $(this).offset();
		$('#iapi_frame').offset({top: offset.top, left: offset.left});
		$('#iapi_frame').height($(this).height()-6);
		$('#iapi_frame').width($(this).width()-6);
		$('#iapi_menu').offset({top: offset.top, left: offset.left + $(this).width() -3});
	
	});


//Questa funzione riporta le cose alla normalità quando il mouse lascia la iApi
/*$('.iapi').on('mouseleave', function(){
$("#iapi_control").remove();
});



	/*
	//Questa funzione si occupa di eseguire tutte le operazioni (soprattutto grafiche) per il mouseenter qu una iApi
$('.iapi').on('mouseenter', function(){
menu='<div class="iapimenu" style="background-color:black; display: none; padding: 3px;">'+
'<div style="font-size: 16px;font-weight: bold; color:white;">Available iAPI actions</div>'+
//'<div style="font-weight: bold; color:white;">Actions:</div>'+
'<div class="iapiactions"></div>'+
//'<div style="font-weight: bold; color:white;">Operations:</div>'+
'<a href="#" style="color:white">For each...</a>'+
'</div>';
//$('.iapi').append(menu);
$(this).wrap("<span id='iapi_container' />");
$("#iapi_container").append(menu);
$(this).css({
"border-width" : "2px", 
"border-style" : "solid",
"border-color" : "black"
});
getActions($(this).attr("class"),$(this).attr("id"));
var pos = $(this).position();

    // .outerWidth() takes into account border and padding.
    var width = $(this).outerWidth();
	var height = $(this).outerHeight();
var size = {
  width: window.innerWidth,
  height: window.innerHeight 
}
var menuwidth=$(".iapimenu").outerWidth();
	var menuheight=$(".iapimenu").outerHeight();
    //show the menu directly over the placeholder
	if((pos.left + width + menuwidth)<=size.width){
    $(".iapimenu").css({
        position: "absolute",
        top: pos.top + "px",
        left: (pos.left + width) + "px"
    }).show();
	//alert("destra");
	}
	else if((pos.left + width + menuwidth)>size.width && (pos.top - menuheight)>0){
		$(".iapimenu").css({
        position: "absolute",
        top: (pos.top - menuheight) + "px",
        left: (pos.left + width - menuwidth) + "px"
    }).show();
	//alert("sopra");
	}
	else if((pos.left + width + menuwidth)>size.width && (pos.top - menuheight)<0){
		$(".iapimenu").css({
        position: "absolute",
        top: (pos.top + height) + "px",
        left: (pos.left + width - menuwidth) + "px"
    }).show();
//alert("sotto");
	}
	


});


//Questa funzione riporta le cose alla normalità quando il mouse lascia la iApi
$('.iapi').on('mouseleave', function(){
$(".iapimenu").remove();
$(this).css({
"border-width" : "2px", 
"border-style" : "solid",
"border-color" : "white",
});
});

*/


});


//Qui controllo se ci sono iApi nella pagina e nel caso ci siano lo notifico all'utente
if(document.getElementsByClassName("iapi").length > 0){

var sjq = document.createElement('script');
sjq.src = chrome.extension.getURL("jquery.min.js");
sjq.onload = function() {
    this.parentNode.removeChild(this);
};

(document.head||document.documentElement).appendChild(sjq);
var s = document.createElement('script');
s.src = chrome.extension.getURL("scripttoinject.js");
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);

$(".iapi").attr("ondragover","allowDrop(event)");
$(".iapi").attr("ondrop","drop(event)");


	//alert("Sono state individuate delle iapi nella pagina");
chrome.extension.sendMessage({color:'green'}, function(){});

    
	//chrome.browserAction.setIcon({path:"icogreen.gif"});
/*	for(i=0;i<document.getElementsByClassName("iapi").length;i++){
        	document.getElementsByClassName("iapi")[i].style.borderWidth="2px";
                document.getElementsByClassName("iapi")[i].style.borderStyle="solid";
	}
	*/
}
else {
chrome.extension.sendMessage({color:'red'}, function(){});
}
//Da qui in poi mi occupo di settare le variabili da passare alle funzioni di generazione del codice 
var YourFindElement = $(".iapi");
lib=false
$.each(YourFindElement , function (i, rowValue) {
var tagtarg=$(this).attr("class").split(" ");
for(i=0;i<tagtarg.length;i++){
if (tagtarg[i].slice(0,7)==("source:")){
urlsource=tagtarg[i].substr(7);
for(j=0;j<tagtarg.length;j++){
if(tagtarg[j].slice(0,7)==("iapiid:")){
iapiid=tagtarg[j].substr(7);
}
else if(tagtarg[j].slice(0,8)==("feedtag:")){
feedtag=tagtarg[j].substr(8);
}
else if(tagtarg[j].slice(0,8)==("itemtag:")){
itemtag=tagtarg[j].substr(8);
}
else if(tagtarg[j].slice(0,13)==("attributetag:")){
attributetag=tagtarg[j].substr(13);
}
else if(tagtarg[j].slice(0,8)==("iapilib:")){
iapilib=tagtarg[j].substr(8);
lib=true;
}
else if(tagtarg[j].slice(0,9)==("iapitype:")){
iapitype=tagtarg[j].substr(9);
}
}
if ($(this).is("table")){
feedtag="table";
itemtag="tr";
attributetag="td";
tagsource="table"
if(lib==true){
generateExt(urlsource,iapiid,feedtag,itemtag,attributetag,tagsource,iapilib,iapitype);
}
else{
generate(urlsource,iapiid,feedtag,itemtag,attributetag,tagsource);
}
}
else if($(this).is("ul")){
feedtag="ul";
itemtag="li";
attributetag="span";
tagsource="ul";
if(lib==true){
generateExt(urlsource,iapiid,feedtag,itemtag,attributetag,tagsource,iapilib,iapitype);
}
else{
generate(urlsource,iapiid,feedtag,itemtag,attributetag,tagsource);
}
}
else{

tagsource=$(this).get(0).tagName;
if(lib==true){
generateExt(urlsource,iapiid,feedtag,itemtag,attributetag,tagsource,iapilib,iapitype);
}
else{
generate(urlsource,iapiid,feedtag,itemtag,attributetag,tagsource);
}
}
}}
});







