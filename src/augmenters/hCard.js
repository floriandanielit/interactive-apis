iapi="hCard";
var hCardItem="hCard";
var hCardAttribute=new Array(new Array(".fn"),new Array(".n",".honorific-prefix","given-name","additional-name","family-name","onorific-suffix"),new Array(".nickname"),new Array(".org"),new Array(".photo"),new Array(".url"),new Array(".email"),new Array(".tel"),new Array(".adr","street-address","locality","region","postal-code","country-name"),new Array(".bday"),new Array(".category"),new Array(".note"));

function gethCardItem(){
    return hCardItem;
}
function gethCardAttribute(){
    return hCardAttribute;
}
