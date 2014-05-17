

// connection with background page
var BG = chrome.extension.getBackgroundPage();


// set event handlers for menu entries
$(document).ready(function() {

   	// add toggle handlers to switches
   	$(".switch > div").each(function(index) {
		  $(this).click(function() {
				toggleSwitch($(this).parent().attr("id"));
			});
		});   
 
		// if engine or editor are enabled, toggle to green (default is red)
		if (BG.extensionDisabled == false)
			$("#engine div").toggle();
		if (BG.iApiLayerDisabled == false)
			$("#editor div").toggle();
		
		// turn links into menu entries with external link icon
		$(".link").each(function(index) {
			var href = $(this).find("a").attr("href");
			$(this).html("<img src='../img/external.gif'/> " + $(this).find("a").html());
		  $(this).click(function() {
			  BG.openTab(href);
			});
		});   

    // add event handler to open options page
    $("#optionPage").click(function () {
        BG.openTab(chrome.extension.getURL("html/options.html"));
    });

    // add event handler to open a new page
    $("#newPage").click(function () {
        BG.openTab(chrome.extension.getURL("html/newPage.html"));
    });

});


// internal on/off logic of switches
// switches are identified by their id in the popup.html
function toggleSwitch (env) {
		  
		switch(env) {
		
			
		case "engine":
		
				if (BG.extensionDisabled == false && BG.iApiLayerDisabled == false) toggleSwitch("editor");
				BG.changeExtensionStatus(); // in the BackGround set the variable disabilita (true-->false & false-->true)
	      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		      	BG.ScriptJs(tabs[0].id); 
		     		BG.setIcon(tabs[0].id); // set the relative icon of the current tab (red/green) or black if disable 
	      });
	 		  $("#" + env + " div").toggle();
		    break;
		    
		    
		case "editor":
		
		    if (BG.extensionDisabled === false) {
	 		  		$("#" + env + " div").toggle();
		        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {		
		        		BG.changeIApiLayerStatus(tabs[0].id);
		            BG.ScriptJs(tabs[0].id);
		        });
		    }
		    break;
		    
		    
		case "annotator":
				
				$("#" + env + " div").toggle();
		    break;
		    
		}
		
//    window.close(); // close the popup
	
}
