var flag = true;
//listener for HTML5 messages from the ContentEngine
window.addEventListener('message', function(event) {

	if (JSON.parse(event.data).action == "startIApiLayer" && flag) {
		flag = false;
		iapi_frame = document.getElementById('iapi_frame');
		if (iapi_frame) {
			iapi_frame.parentNode.removeChild(iapi_frame);
		}

		iapi_menu();
	}
}, false);

iapi_menu();
//Inject the Iframe (highlight the iapi's)
function iapi_menu() {
	if (!document.getElementById("iapi_frame")) {

		$(".iapi").attr("ondragleave", "leave(event)");
		iapi_control = "<div id='iapi_frame' style='border: 3px solid black;display: none;'>" + '<div id="iapi_menu" class="iapi_menu" style="background-color:black; padding: 3px; width: 200px;">' + '<div style="font-size: 16px;font-weight: bold; color:white;"></div>' + '<div style="font-size: 16px;font-weight: bold; color:white;">Formatting:<br/>' + '</div>' + '<div style="font-size: 16px;font-weight: bold; color:white;">More data:<br/>' + ' </div>' + '<div class="iapiactions"></div>' + '<a href="#" style="color:white">For each...</a>' + '</div>' + '</div>';

		$('body').append(iapi_control);

		$('#iapi_frame').on('mouseleave', function() {
			$('#iapi_frame').hide();
		});

		$('.iapi').on('mouseenter', function() {
			$('#iapi_frame').show();

			getActions($(this).attr("class"), $(this).attr("id"));

			offset = $(this).offset();
			$('#iapi_frame').offset({
				top : offset.top,
				left : offset.left
			});
			$('#iapi_frame').height($(this).height() - 6);
			$('#iapi_frame').width($(this).width() - 6);
			$('#iapi_menu').offset({
				top : offset.top,
				left : offset.left + $(this).width() - 3
			});

			$('#iapi_menu').children().first().html(messageIapi_menu($(this).attr("id")));

			//if it's Source page hide the Formatting options
			if (isSrcPage($(this)) === true) {
				secondchild = $("#iapi_menu div:nth-child(2)").css("display", "none");
				thirdchild = $("#iapi_menu div:nth-child(3)").css("display", "none");

			} else {

				var id = $(this).attr("id");
				var items = $(this).find("[class*='dataitem:']");
				var elementsItem = $(items).attr("class").split(" ");
				var presenceIdtemplate = false;
				var idTemplate;
				for (var i = 0; i < elementsItem.length && presenceIdtemplate === false; i++) {

					if (elementsItem[i].substr(0, 11) === "idTemplate:") {
						idTemplate = elementsItem[i].substr(11);
						presenceIdtemplate = true;
					}
				}
				if (presenceIdtemplate === false) {
					secondchild = $("#iapi_menu div:nth-child(2)").css("display", "none");
					thirdchild = $("#iapi_menu div:nth-child(3)").css("display", "none");
				} else {
					//SET THE IAPI FORMATTING OPTION
					getTemplateList(function(array) {

						secondchild = $("#iapi_menu div:nth-child(2)");

						if (array.length > 0) {
							secondchild.html('');
							secondchild.html('Formatting:<br/>');
							secondchild.css("display", "block");
						} else {
							secondchild.css("display", "none");
						}
						for (var i = 0; i < array.length; i++) {
							var newchi = '<input type="radio" class="idtemplate:' + array[i].key + '" value="' + array[i].value + '" >' + array[i].value + '<br/>';
							secondchild.append(newchi);
							if (array[i].key === idTemplate)
								secondchild.children("input").last().prop('checked', 'checked');
						}
					});

					var arr = new Array();
					var parentNode = $(this);

					//get the stored object
					getObjectTwo(function() {

						var flag = true;
						window.addEventListener('message', function(event) {

							if (JSON.parse(event.data).action == "getStoredTwo" && flag) {
								flag = false;

								tmp = JSON.parse(event.data).value;

								if (tmp !== undefined) {
									tmp = JSON.parse(tmp);
									if (tmp !== null) {
										tmp = tmp[id];

										if (tmp !== undefined) {
											getFirstRowKeyObject(false, tmp, function(arr) {
												thirdchild = $("#iapi_menu div:nth-child(3)");

												if (arr.length > 0) {
													thirdchild.html('');
													thirdchild.html('More data:<br/>');
													thirdchild.css("display", "block");
												} else {
													thirdchild.css("display", "none");
												}
												for (var j = 0; j < arr.length; j++) {
													var newchi = '<input type="checkbox" name="more_data" value="' + arr[j] + '" >' + arr[j] + '<br/>';
													thirdchild.append(newchi);
													thirdchild.children("input").last().prop('checked', 'checked');
												}

												var arrAttr = parentNode.attr("class").split(" ");
												for (var i = 0; i < arrAttr.length; i++) {

													if (arrAttr[i].substr(0, 5) === "hide:") {
														var attribute = arrAttr[i].split(":");
														for (var j = 1; j < attribute.length; j++) {
															thirdchild.children('[value=' + attribute[j] + ']').prop('checked', false);
														}
													}

												}
											});
										}
									}
								}
							}
						});

					});
				}
			}
		});

		//SET CLICK STATUS FORMATTING
		$("#iapi_menu div:nth-child(2)").change(function(i) {
			var values = $(i.target).attr("class").split(" ");
			var idTemplate;
			for (var i = 0; i < values.length; i++) {
				if (values[i].substr(0, 11) === "idtemplate:") {
					idTemplate = values[i].substr(11);
					break;
				}
			}
			formattingDOM($("#iapi_menu [class='getAll']").attr("id"), idTemplate);
		});

		//SET CLICK STATUS MORE DATA
		$("#iapi_menu div:nth-child(3)").change(function(i) {
			var obj = {
				"type_dataattribute" : $(i.target).attr("value"),
				"value" : $(i.target).is(":checked")
			};
			hideShowDataattributeDOM($("#iapi_menu [class='getAll']").attr("id"), obj);
		});

		getPageId(function() {

			//Listener for the page ID
			var flag = true;
			window.addEventListener('message', function(e) {

				if (JSON.parse(e.data).action === "pageidResponse" && flag) {

					flag = false;
					$(".iapi").attr("ondragover", "allowDrop(event," + JSON.parse(e.data).pageid + ")");
					$(".iapi").attr("ondrop", "drop(event," + JSON.parse(e.data).pageid + ")");
				}
			}, false);
		});

	}
}

// get the all dataattribute from the stored object
function getFirstRowKeyObject(dataitem, tmp, call) {
	var arr = new Array();
	$.each(tmp, function(key, value) {
		$.each(value, function(key, value) {
			arr.length = 0;
			if (dataitem === true)
				arr.push(key);
			for (var key in value) {
				arr.push(key);
			}
			call(arr);
		});
		return false;
	});
}

//return true if the element is a source
function isSrcPage(YourFindElement) {
	var tagtarg = YourFindElement.attr("class").split(" ");
	var presenceDataSource = false;

	for ( i = 0; i < tagtarg.length; i++) {
		if (tagtarg[i].slice(0, 11) == ("datasource:")) {
			presenceDataSource = true;
		}
	}
	if (presenceDataSource === true) {
		return false;
	} else {
		return true;
	}
}

//return the list of all the templates (id and name)
function getTemplateList(callback) {
	var array = new Array();

	getHTML('http://127.0.0.1:8020/interactive-apis/src/html/templates.html', function() {
		var flag = true;
		window.addEventListener('message', function(event) {
			if (JSON.parse(event.data).action == "Templates" && flag) {
				flag = false;
				data = JSON.parse(event.data).value;
				var template = $("<div>" + data + "</div>").find('#2D');
				var children = template.find("[id^='2D_']");
				$.each(children, function(key, value) {
					array.push({
						"key" : $(this).attr("id"),
						"value" : $(this).attr("name")
					});
				});
				callback(array);
			}
		});
	});
}

//send a message to Middleware to execute the rendering process (generate)
function sendMessageMiddleware(action, id, idPage, call) {
	var pass_data = {
		'action' : "middlewareAction",
		'id' : id,
		'idPage' : idPage
	};
	window.postMessage(JSON.stringify(pass_data), window.location.href);
	var flag = true;
	window.addEventListener('message', function(e) {

		if (JSON.parse(e.data).action === "middlewareResponse" && flag) {
			flag = false;
			call(JSON.parse(e.data).ret);
		}
	}), false;
}

//reformat the actual DOM object with the relative template
function formattingDOM(id, idTemplate) {

	getHTMLTWO('http://127.0.0.1:8020/interactive-apis/src/html/templates.html', function() {
		//Listener to get pageHTML
		var flag = true;
		window.addEventListener('message', function(event) {

			if (JSON.parse(event.data).action == "TemplatesTwo" && flag) {
				flag = false;
				data = JSON.parse(event.data).value;
				pageIdRequest(function(idPage) {
					var template = $("<div>" + data + "</div>").find('#' + idTemplate);

					compileAndInjectTemplate(template, id, idPage, function(ret2) {
						$("#" + id).empty();
						var replacementTag = ret2.prop("tagName");

						////////////////////////////new
						var $a = $("#" + id);
						var aid = $a.attr('id');
						var aclass = $a.attr('class');
						$a.replaceWith('<' + replacementTag + ' class="' + aclass + '" id="' + aid + '"></' + replacementTag + '>');

						//////////////////////////////
						$("#" + id).html(ret2.html());

						try {
							var pass_data = {
								'idTemp' : id,
								'value' : $('#' + id)[0].outerHTML
							};
							window.postMessage(JSON.stringify(pass_data), window.location.href);
						} catch (e) {
							alert(e);
						}

						sendMessageMiddleware("formatting", id, idPage, function(ret) {

							iapi_frame = document.getElementById('iapi_frame');
							if (iapi_frame) {
								iapi_frame.parentNode.removeChild(iapi_frame);
							}
							iapi_menu();

							/*
							 var pass_data = {
							 'action': "startIApiLayer"
							 };
							 window.postMessage(JSON.stringify(pass_data), window.location.href);*/

						});
					});
				});
			}
		});
	});
}

//Edit and process the template
function compileAndInjectTemplate(ret, idtarget, idPage, callback) {
	// get the object from the local storage
	getObject(function() {
		var flag = true;
		window.addEventListener('message', function(event) {

			if (JSON.parse(event.data).action == "getStored" && flag) {
				flag = false;
				tmp = JSON.parse(event.data).value;
				if (tmp !== undefined) {
					tmp = JSON.parse(tmp);
					var idTemplate;
					tmp = tmp[idtarget];
					getFirstRowKeyObject(true, tmp, function(arr) {
						idTemplate = $(ret).attr("id");
						$(ret).removeAttr('id');
						$(ret).removeAttr("name");
						if ($(ret).prop("tagName").toLowerCase() === "table") {
							// if the template is a table I set the name of columns
							ret = $(ret).children();
							var ret2 = $(ret).children().first();
							var titleAttribute = ret2.html();
							for (var k = 2; k < arr.length; k++)
								$(ret2).append(titleAttribute);

							//set the j children with array keys
							$(ret2).children().each(function(i) {
								$(this).empty();
								$(this).html("" + arr[i + 1]);
								i++;
							});
						}
						scanDOMObject(idtarget, function(arrdataAttributeKey, dataItemLabel) {
							var dataitemIterator = $(ret).find("[class*='iapitemplate:item']");
							$(dataitemIterator).removeClass('dataitem:[label]');
							if (dataItemLabel !== undefined)
								$(dataitemIterator).addClass("dataitem:" + dataItemLabel + ":" + arr[0]);
							else
								$(dataitemIterator).addClass("dataitem:" + arr[0]);
							arr.shift();
							$(dataitemIterator).addClass("idTemplate:" + idTemplate);
							var dataattributeIterator = $(dataitemIterator).children().filter("[class*='iapitemplate:attribute']");
							$(dataattributeIterator).removeClass("iapitemplate:attribute");
							var dataattribute = dataattributeIterator[0].outerHTML;
							//insert j children
							if (arrdataAttributeKey.length !== 0) {
								for (var j = 1; j < arrdataAttributeKey.length; j++)
									$(dataitemIterator).append(dataattribute);

							} else {
								for (var j = 1; j < arr.length; j++)
									$(dataitemIterator).append(dataattribute);
							}
							//set the j children with array keys
							$(dataattributeIterator).parent().children().each(function() {
								$(this).removeClass();
								if (arrdataAttributeKey.length !== 0) {
									var i;
									var find = false;
									for ( i = 0; i < arr.length && find === false; i++) {
										if (arrdataAttributeKey[0].label.replace(/(\r\n|\n|\r)/gm, "") === arr[i]) {
											find = true;

											$(this).addClass("dataattribute:" + arrdataAttributeKey[0].key.replace(/(\r\n|\n|\r)/gm, "") + ":" + arr[i]);
										}
									}
									arrdataAttributeKey.shift();
									if (find === true) {
										arr.splice(i - 1, 1);
									}
								} else {
									$(this).addClass("dataattribute:" + arr[0]);
									arr.shift();
								}
							});
							if ($(ret).prop("tagName").toLowerCase() === "tbody") {
								callback($(ret).parent());
							} else
								callback(ret);
						});
					});
				}
			}
		});
	});
}

// Extract the dataattribute and the relative labels (ex. dataattribute:conference:where)
function scanDOMObject(idtarget, call) {
	var arrdataAttributeKey = new Array();
	var dataItemLabel;
	var isRefExt = false;
	var arrObjectDOM = $("#" + idtarget).attr("class").split(" ");

	for (var i = 0; i < arrObjectDOM.length && isRefExt === false; i++) {
		if (arrObjectDOM[i].substr(0, 11) === "sourcetype:") {
			if (arrObjectDOM[i].substr(11).toLowerCase() !== "iapi")
				isRefExt = true;
		}
	}
	if (isRefExt === true) {
		var tmp = false;
		var ItemTag = $("#" + idtarget).find("[class*='iapitemplate:item']");
		var classdataItem = $(ItemTag).attr("class").split(" ");
		for (var i = 0; i < classdataItem.length; i++) {
			if (classdataItem[i].substr(0, 9).toLowerCase() === "dataitem:") {
				var subArrKeyLabel = classdataItem[i].split(":");
				dataItemLabel = subArrKeyLabel[1];
			}
		}

		$(ItemTag).first().children("[class*='dataattribute:']").each(function() {
			var classdataAttribute = $(this).attr("class").split(" ");
			for (var i = 0; i < classdataAttribute.length; i++) {
				if (classdataAttribute[i].substr(0, 14) === "dataattribute:") {
					var subArrKeyLabel = classdataAttribute[i].split(":");
					if (subArrKeyLabel.length === 3) {
						object = {
							"key" : subArrKeyLabel[1],
							"label" : subArrKeyLabel[2]
						};
						arrdataAttributeKey.push(object);
					}
				}
			}
		});
	}
	call(arrdataAttributeKey, dataItemLabel);
}

// Execute the Hide/Show functionality of the Dataattributes
function hideShowDataattributeDOM(id, obj) {
	pageIdRequest(function(idPage) {
		if (obj.value) {
			showDataattribute(id, obj.type_dataattribute, function() {
				var tmp = $('#' + id).clone();
				$(tmp).find("[class*='iapitemplate:item']").nextAll().remove();
				$(tmp).find("[class*='iapitemplate:item']").children().each(function() {
					$(this).text("");
				});
				try {
					var pass_data = {
						'idTemp' : id,
						'value' : $(tmp)[0].outerHTML
					};
					window.postMessage(JSON.stringify(pass_data), window.location.href);
				} catch (e) {
					alert(e);
				}
				sendMessageMiddleware("formatting", id, idPage, function(ret) {
				});
			});
		} else {
			hideDataattribute(id, obj.type_dataattribute, function() {
				var tmp = $('#' + id).clone();
				$(tmp).find("[class*='iapitemplate:item']").nextAll().remove();
				$(tmp).find("[class*='iapitemplate:item']").children().each(function() {
					$(this).text("");
				});
				try {
					var pass_data = {
						'idTemp' : id,
						'value' : $(tmp)[0].outerHTML
					};
					window.postMessage(JSON.stringify(pass_data), window.location.href);
				} catch (e) {
					alert(e);
				}
				sendMessageMiddleware("formatting", id, idPage, function(ret) {
				});
			});
		}
	});
}

// Add hide property to the selected Dataattribute
function hideDataattribute(id, type, call) {
	var YourFindElement = $(".iapi").filter("#" + id);
	var findHide = false;
	var tagtarg = YourFindElement.attr("class").split(" ");
	var tagtarg2;
	var tagClass = "";
	for ( i = 0; i < tagtarg.length; i++) {
		if (tagtarg[i].substr(0, 5) === "hide:") {
			findHide = true;
			tagtarg[i] += ":" + type;
		}
		if (i === 0)
			tagClass += tagtarg[i];
		else
			tagClass += " " + tagtarg[i];
	}

	if (findHide === false) {
		tagtarg2 = YourFindElement.attr("class");
		tagtarg2 += " hide:" + type;
		tagClass = tagtarg2;
	}

	YourFindElement.attr("class", tagClass);
	call("done");
}

// Remove the Hide property from the selected Dataattribute
function showDataattribute(id, type, call) {
	var YourFindElement = $(".iapi").filter("#" + id);
	var findHide = false;
	var tagClass = "";
	var findDataAttribute = false;
	var tagtarg = YourFindElement.attr("class").split(" ");
	for ( i = 0; i < tagtarg.length; i++) {
		if (tagtarg[i].substr(0, 5) === "hide:") {
			findHide = true;
			var arrayHideElement = tagtarg[i].substr(5).split(":");
			if (arrayHideElement.length !== 1)
				tagClass += " " + tagtarg[i].substr(0, 4);
			for (var j = 0; j < arrayHideElement.length; j++) {
				if (arrayHideElement[j] === type) {
					findDataAttribute = true;
					tagClass.substr(0, tagClass.length - 1);
				} else {
					tagClass += ":" + arrayHideElement[j];
				}
			}
		} else {
			if (i === 0)
				tagClass += tagtarg[i];
			else
				tagClass += " " + tagtarg[i];
		}
	}
	YourFindElement.attr("class", tagClass);
	call("done");
}

function messageIapi_menu(id) {

	var iapiDiv = $("#" + id);
	var presenceDataSourceOrData = false;
	var typeData;
	var elementsClass = iapiDiv.attr("class").split(" ");

	for ( i = 0; i < elementsClass.length && presenceDataSourceOrData === false; i++) {
		if (elementsClass[i].substr(0, 11) == ("datasource:")) {
			typeData = 'Page with interactions';
			presenceDataSourceOrData = true;
		} else if (elementsClass[i].substr(0, 5) == ("data:")) {
			typeData = elementsClass[i].substr(5);
			presenceDataSourceOrData = true;
		}
	}
	if (presenceDataSourceOrData === true) {
		return typeData;
	}

}

function getActions(iapiclass, iapiid) {

	codeactions = "";
	codeactions = codeactions.concat('<a class="getAll" id=' + iapiid + ' draggable="true" ondragstart="drag(event,document.URL)" href="?iapisource="+window.location.href+"&iapiid="+iapiid+"" style="color:white">Use data</a> <br/>');
	var classes = iapiclass.split(" ");
	for ( i = 0; i < classes.length; i++) {
		if (classes[i].slice(0, 4) == ("rss:")) {
			codeactions = codeactions.concat('<a href="#" style="color:white">getRss</a> \n');
		}
	}
	$("div[class~=iapiactions]").html(codeactions);
}

//get the External page
function getPage(urlSource, idtarget, call) {

	try {
		var pass_data = {
			'action' : "getExternal",
			'value' : urlSource,
			'idtarget' : idtarget
		};
		window.postMessage(JSON.stringify(pass_data), window.location.href);

	} catch (e) {
		alert(e);
	}
	call();
}

// get the HTML page which contains a list of templates
function getHTML(urlSource, call) {

	try {
		var pass_data = {
			'action' : "getHTML",
			'value' : urlSource,
		};
		window.postMessage(JSON.stringify(pass_data), window.location.href);

	} catch (e) {
		alert(e);
	}
	call();
}

// get the HTML page which contains a list of templates
function getHTMLTWO(urlSource, call) {

	try {

		var pass_data = {
			'action' : "getHTMLTwo",
			'value' : urlSource,

		};
		window.postMessage(JSON.stringify(pass_data), window.location.href);

	} catch (e) {
		alert(e);
	}
	call();
}

// get the stored object
function getObject(call) {

	try {
		var pass_data = {
			'action' : "getObject"
		};
		window.postMessage(JSON.stringify(pass_data), window.location.href);

	} catch (e) {
		alert(e);
	}
	call();
}

// get the stored object
function getObjectTwo(call) {

	try {

		var pass_data = {
			'action' : "getObjectTwo"

		};
		window.postMessage(JSON.stringify(pass_data), window.location.href);

	} catch (e) {
		alert(e);
	}
	call();
}

//send a message to middleware to get the actual page id
function getPageId(call) {

	try {
		var pass_data = {
			'action' : "pageidRequest",
		};
		window.postMessage(JSON.stringify(pass_data), window.location.href);

	} catch (e) {
		alert(e);
	}
	call();
}
