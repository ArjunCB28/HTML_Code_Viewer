var htmlData;
var escapedHtmlData;
var inputTransition = false;
var ananlyseHtml = function(){
	//tbr
	// $('#urlId').val('https://www.computerhope.com/issues/ch000746.htm');
	var inputUrl = $('#urlId').val();
	$.ajax({
		// url:'https://cors-anywhere.herokuapp.com/'+inputUrl,
		url:'https://cors-proxy.htmldriven.com/?url='+inputUrl,
		// headers: { 'Access-Control-Allow-Origin': 'file://' },
		type:'GET',
		accept:'application/json',
		// crossDomain: true,
		success: function(data){
			var outputData = data.body;
			// gives tag break and removes 
			outputData = outputData.replace(/>/g, ">\n");
			outputData = outputData.replace(/<\//g, "\n</");
			outputData = outputData.replace(/^\s*\n/gm, "");
			htmlData = outputData;
			outputData = outputData.replace(/</g, "&lt;");
			outputData = outputData.replace(/>/g, "&gt;");
			escapedHtmlData = outputData;

			var element = document.getElementById("xmpTagId");
			element.innerHTML = outputData;
			filterTags(htmlData);
		}
	});
	if(!inputTransition){
		$('.url-input-part').css('margin','50px 0px 0px 0px');
		$('.url-input-part').css('top','0px');
		$('#info-text').css('display','none');
		setTimeout(function() {
			$('.source-code-display-part').css('visibility','visible');
			$('.source-code-display-part').css('height','400px');
		}, 500);
	}
};


var filterTags = function(data){
	var outputArray = [];
	var tagFilterRegex = /<([a-z]+)\b/g;
	while ((array=tagFilterRegex.exec(data)) !== null) {
		outputArray.push(array[1]);  
	}
	groupFilteredTags(outputArray);
};

var groupFilteredTags = function(filteredArray){
	var groupedArray = [];
	var countTagObj = {};
	var excludeArray = [];
	// var excludeArray = ['html','title','script','body','link','head','meta'];
	if(filteredArray.length === 0){
		return;
	}
	var counter = 0;
	for(var i=0;i<filteredArray.length; i++){
		if(!excludeArray.includes(filteredArray[i])){
			groupedArray.push(filteredArray[i]);
			if(!countTagObj[filteredArray[i]]){
				countTagObj[filteredArray[i]] = {};
				countTagObj[filteredArray[i]].count = 1;
				countTagObj[filteredArray[i]].tagName = '<'+filteredArray[i]+'/>';
			} else {
				countTagObj[filteredArray[i]].count++;
			}
		}
	}
	createDomElements(countTagObj);
};

var createDomElements = function(countTagObj){
	var tableBody = document.createElement("tbody");
	for (var key in countTagObj){
		var row = document.createElement("tr");
		var column1 = document.createElement("td");
		var column2 = document.createElement("td");
		row.setAttribute('id',key);
		row.setAttribute('onclick',"selectTag('"+key+"')");
		column1.textContent = countTagObj[key].tagName;
		column2.textContent = countTagObj[key].count;
		row.appendChild(column1);
		row.appendChild(column2);
		tableBody.appendChild(row);
	}
	var element = document.getElementById("tag-count-table");
	element.appendChild(tableBody);
};

var selectTag = function(tag){
	console.log(tag);
    var outputData = escapedHtmlData.replace(new RegExp("&lt;"+tag+"&gt;", 'g'), '<mark>$&</mark>');
    var xmp = document.createElement("pre");
    var element = document.getElementById("xmpTagId");
    outputData = outputData.replace(new RegExp("&lt;"+tag+" ", 'g'), '<mark>$&</mark>');
    outputData = outputData.replace(new RegExp("&lt;/"+tag+"&gt;", 'g'), '<mark>$&</mark>');
    xmp.innerHTML = outputData;
    element.innerHTML = outputData;
};

// show loading 