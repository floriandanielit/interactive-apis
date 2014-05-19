﻿

// connection with background page
var BG = chrome.extension.getBackgroundPage();


$(document).ready(function() {

   	$(".switch").each(function(index) {
		  $(this).click(function() {
				toggleSwitch($(this).parent().attr("id"));
			});
		});   
 
		if (BG.extensionDisabled == false)
			$("#engine div").toggle();
		if (BG.iApiLayerDisabled == false)
			$("#editor div").toggle();
		
		//add event handlers that open links in a new tab
		$("a").each(function(index) {
		  $(this).click(function() {
			  BG.openTab($(this).attr("href"));
			});
		});   

    //add event handler to open options page
    $("#optionPage").click(function () {
        BG.openTab(chrome.extension.getURL("html/options.html"));
    });

    //add event handler to open a new page
    $("#newPage").click(function () {
        BG.openTab(chrome.extension.getURL("html/newPage.html"));
    });

});


function toggleSwitch (env) {
		  
		switch(env) {
			
		case "engine":
		
				BG.changeExtensionStatus();//in the BackGround set the variable disabilita (true-->false & false-->true)
	      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		     		if(BG.extensionDisabled) BG.iApiLayerDisabled = true;
		      	BG.ScriptJs(tabs[0].id); 
		     		BG.setIcon(tabs[0].id);//set the relative icon of the current tab (red/green) or black if disable 
	      });
	 		  $("#" + env + " div").toggle();
		    break;
		    
		case "editor":
		
		    if (BG.extensionDisabled === false) {
	 		  		$("#" + env + " div").toggle();
		        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {		
		        		BG.changeIApiLayerStatus(tabs[0].id);
		            //    changeIApiLayerStatusText();
		            BG.ScriptJs(tabs[0].id);
		        });
		    }
		    break;
		    
		case "annotator":
				
				$("#" + env + " div").toggle();
		    break;
		    
		}
		
    window.close();//close the popup.html page
	
}
