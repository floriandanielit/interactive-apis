
//Questa funzione serve a generare dinamicamente il codice del menu che compare al passaggio del mouse sopra una iApi
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
