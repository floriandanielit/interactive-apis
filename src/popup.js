var BG = chrome.extension.getBackgroundPage();

// Run our script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
    linksHref();
    linksOption();
    linksNewPage();
    typeInteraction();
    on_off();
});

//validate all <a href=".."> and the BackGroundPage open a new page
function linksHref() {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                BG.openTab(location);
            };
        })();
    }
}
// get the position of option.html page
function linksOption() {
    $("#optionPage").click(function () {
        BG.openTab(chrome.extension.getURL("html/options.html"));
    });
}

// get the position of option.html page
function linksNewPage() {
    $("#newPage").click(function () {
        BG.openTab(chrome.extension.getURL("html/newPage.html"));
    });
}
//set the status of chrome extension 
function on_off() {
    changeColor();
    $("#on_off").click(function () {
        BG.changeExtensionStatus();//in the BackGround set the variable disabilita (true-->false & false-->true)
//        BG.extensionDisabled = !BG.extensionDisabled;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            BG.ScriptJs(tabs[0].id);
            BG.setIcon(tabs[0].id);//set the relative icon of the current tab (red/green) or black if disable

        });
        changeColor();
        window.close();//close the popup.html page
    });
    
}
// set for the id="on_off" the status of the plugin(Disabled/Enabled)
function changeColor() {
    console.log("disabilita: " + BG.extensionDisabled);
    if (BG.extensionDisabled == true) {
        $("#on_off").html("<b>Extension Disabled (Click to Enable)</b>");
        //$("#on_off").css("background-color", "red");
    } else {
        $("#on_off").html("<b>Extension Enabled (Click to Disable)</b>");

        //$("#on_off").css("background-color", "green");
    }
}

//hide or show the type of Interaction (Iapi, hcard, hcalendar etc.)
function typeInteraction() {
    //Current tab (chrome.tabs.getSelected() is deprecated)
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log("tab presence: " + BG.iAPIPresence[tabs[0].id] + " disable: " + BG.extensionDisabled);
        if (BG.iAPIPresence[tabs[0].id] == "yes" && BG.extensionDisabled == false) {
                $("#typeInteraction").html("<b>iAPI Interaction</b>");
                $("#typeInteraction").css("color","green");
                $('#typeInteraction').show();

        } else if (BG.iAPIPresence[tabs[0].id] == "no" && BG.extensionDisabled == false) {
                $("#typeInteraction").html("<b>No Interaction</b>");
                $("#typeInteraction").css("color", "red");
                $('#typeInteraction').show();
            }

    });
}