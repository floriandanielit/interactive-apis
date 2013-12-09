/**
 * Created by Benny on 05/12/13.
 */
function extractIAPI(iapiid){
 var data ={
     pubs: []
 };

    var template=$('#'+iapiid);

    $.each(template,function(i,row){


        var tmp=template.children();   // the ul tag

        // var tmp=ts.children('[class*=data]');

        $.each(tmp, function (j, rowValue) {


            tmpChild=tmp.children();   // the li

            $(tmpChild).each(function(i,rowValue){

                data.pubs.push({
                    "Author" :    $(tmpChild).eq(i).html(),
                    "Title"  :  $(tmpChild).eq(i).html(),
                    "where"       :  $(tmpChild).eq(i).html()
                });

            });

        });

    });
  /*
    var employees = {
        accounting: []
    };

    for(var i in someData) {

        var item = someData[i];

        employees.accounting.push({
            "firstName" : item.firstName,
            "lastName"  : item.lastName,
            "age"       : item.age
        });
    }


*/

}