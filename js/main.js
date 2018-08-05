var htmlData;
var escapedHtmlData;
var inputTransition = false;
var selectedTag;
//function is called when analyse button is clicked
var ananlyseHtml = function(){
	var inputUrl = $('#urlId').val();
	var urlValidationRegex = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
	if (!urlValidationRegex.test(inputUrl)) { 
	    window.alert("Enter a valid url");
	    return;
	}
	if(!inputTransition){
		$('.loading-overlay').css('display','block');
		$('.url-input-part').css('margin','50px 0px 0px 0px');
		$('.url-input-part').css('top','0px');
		$('#info-text').css('display','none');
	}

	$.ajax({
		url:'https://cors-anywhere.herokuapp.com/'+inputUrl,
		//url:'https://cors-proxy.htmldriven.com/?url='+inputUrl,
		// url:inputUrl,
		// headers: { 'Access-Control-Allow-Origin': '*' },
		type:'GET',
		accept:'application/json',
		// crossDomain: true,
		success: function(data){
			$('.loading-overlay').css('display','none');
			$('.source-code-display-part').css('visibility','visible');
			$('.source-code-display-part').css('height','450px');
			var outputData = data;
			// gives tag break and removes 
			outputData = outputData.replace(/>/g, ">\n");
			outputData = outputData.replace(/<\//g, "\n</");
			outputData = outputData.replace(/^\s*\n/gm, "");
			htmlData = outputData;
			//relpaces special character to show it as un-compiled html inside pre tag
			outputData = outputData.replace(/</g, "&lt;");
			outputData = outputData.replace(/>/g, "&gt;");
			escapedHtmlData = outputData;
			var element = document.getElementById("xmpTagId");
			element.innerHTML = outputData;
			filterTags(htmlData);
		},
		error: function(){
			$('.loading-overlay').css('display','none');
			window.alert("Some error occurred while loading the url. Try some other url");
		}
	});
};

// used to filter out tags present in html
var filterTags = function(data){
	var outputArray = [];
	var tagFilterRegex = /<([a-z]+)\b/g;
	while ((array=tagFilterRegex.exec(data)) !== null) {
		outputArray.push(array[1]);  
	}
	groupFilteredTags(outputArray);
};

// create tag count
var groupFilteredTags = function(filteredArray){
	var groupedArray = [];
	var countTagObj = {};
	var excludeArray = ['html'];
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
		row.setAttribute("id","row-"+key);
		row.setAttribute('onclick',"selectTag('"+key+"')");
		column1.textContent = key;
		column2.textContent = countTagObj[key].count;
		row.appendChild(column1);
		row.appendChild(column2);
		tableBody.appendChild(row);
	}
	var element = document.getElementById("tag-count-table");
	element.appendChild(tableBody);
};

//function is called when any tag is selected.
var selectTag = function(tag){
	console.log(tag);
	if(selectedTag !== undefined){
		$('#row-'+selectedTag).css('background-color','white');
	}
	selectedTag = tag;
	$('#row-'+tag).css('background-color','#c6e3ff');
	console.log('#row-'+tag);
    var outputData = escapedHtmlData.replace(new RegExp("&lt;"+tag+"&gt;", 'g'), '<mark>$&</mark>');
    var xmp = document.createElement("pre");
    var element = document.getElementById("xmpTagId");
    outputData = outputData.replace(new RegExp("&lt;"+tag+" ", 'g'), '<mark>$&</mark>');
    outputData = outputData.replace(new RegExp("&lt;/"+tag+"&gt;", 'g'), '<mark>$&</mark>');
    xmp.innerHTML = outputData;
    element.innerHTML = outputData;
};