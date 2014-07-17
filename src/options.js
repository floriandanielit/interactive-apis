// connection with background page
var BG = chrome.extension.getBackgroundPage();

// set event handlers for menu entries
$(document).ready(function () {

    //Call the create function 
    tableDOMObject(function () {
        $(".link").each(function (index) {
            var href = $(this).attr("href");
            $(this).click(function () {
                BG.openTab(href);
            });
        });


        //EventHandler button with a specific id
        $("[id^=removeStorage]").click(function () {
            var id = $(this).attr("id");
            id = id.substring(13);
            var url = $(this).parent().parent().children("td:nth-child(1)").children("a").html()
            var idDOM = $(this).parent().parent().children("td:nth-child(2)").html();

            removeTempObject(url, idDOM, function (idTab) {
                deleteRowAndUpdateTable(id, url, idDOM, function () {
                    /*if (idTab != null) {
                        console.log("REFRESH");
                        console.log("url:" + idTab);
                        chrome.tabs.reload(idTab);
                    }*/
                });
            });
        });
        $("[id=iapiRefreshTableLocalStorage]").click(function () {
            window.location.reload()();
        });
    });

});

//Remove the Temporally Object
function removeTempObject(url, id, call) {
    var exit = false;
    var match = false;
    var idTab;
    chrome.windows.getAll({ populate: true }, function (windows) {
        windows.forEach(function (window) {
            window.tabs.forEach(function (tab) {
                if (url === tab.url && exit === false) {
                    idTab = tab.id;
                    exit = true;
                    match = true;
                    BG.deleteLocalStorageObjectWithASpecificDOMId(tab.id, id, function () {
                        call(idTab);
                    });
                }
            });
        });
        if (!match)
            call(null);

    });
}

//Create the table with all template saved in the localStorage
function tableDOMObject(call) {

    var createtable = false;
    var row = 0;

    $("#iapiTemplateLocalStorage").empty();
    BG.getAllLocalStorageTemplate(function (local) {
        if (Object.keys(local).length > 0) {
            $.each(local, function (keys, value) {

                var values = local[keys];
                values = JSON.parse(values);
                if (createtable === false && value != null) {
                    createtable = true;
                    createTable();
                }
                $.each(values, function (key, val) {
                    addRow(keys, key, row);
                    row++;

                });
            });
        }
        else {
            createMessage();
        }
        call();
    });
}

//Add a Row in the Table
function addRow(url, idDom, row) {
    var rowtable = '<tr>'
        + '<td><a class="link" href="' + url + '">' + url + '</a></td>'
        + '<td>' + idDom + '</td>'
        + '<td><button id="removeStorage' + row + '">Delete</button></td>'
        + '</tr>';
    $("#iapiDOMObjects").children('tbody').append(rowtable);
}

//Create the Empty table
function createTable() {
    var content = '<table id="iapiDOMObjects" border="1" cellspacing="0">'
        + '<tbody>'
        + '<tr>'
        + '<th>Page</th>'
        + '<th>DOM Id</th>'
        + '<th>Action</th>'
        + '</tr>'
        + '</tbody>'
        + '</table>';
    $("#iapiTemplateLocalStorage").append(content);
}

//Create the Message Empty localStorage
function createMessage() {
    var content = '<h1>Empty localStorage</h1>';
    $("#iapiTemplateLocalStorage").append(content);
}

//delete the Row at index and refresh other idButton
function deleteRowAndUpdateTable(index, url, id, call) {
    index = parseInt(index);
    index = index + 2;

    console.log(url, id);
    BG.deleteLocalStorageObjectWithASpecificDOMId(url, id, function () {
        var table = $("#iapiDOMObjects").children("tbody");
        var numChildren = $(table).children("tr").length;
        var elementFind = false;
        var pos = index;
        for (var i = index; i <= numChildren; i++) {
            if (!elementFind) {
                elementFind = true;
                $(table).children("tr:nth-child(" + pos + ")").remove();
            }
            else {
                var newid = "removeStorage" + (pos - 2);
                var idButton = $(table).children("tr:nth-child(" + pos + ")").find("button").attr("id", newid);
                pos++;
            }
            //remove all headers of the table
            if (index == numChildren && numChildren == 2) {
                $("#iapiTemplateLocalStorage").empty();
            }

        }
        call();
    });
}
