function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||""
}

mycategory = getURLParameter('category');
myaudience = getURLParameter('audience');

// begin main function
$(document).ready(function(){

    initializeTabletopObject('https://docs.google.com/spreadsheets/d/1Ym_DjK2JNfwv5HeTvF8wVtmOg-TXQZKwzEJg5gJunuA/pubhtml');

});

// pull data from google spreadsheet
function initializeTabletopObject(dataSpreadsheet){
    Tabletop.init({
        key: dataSpreadsheet,
        callback: writeCovers,
        simpleSheet: true,
        debug: true,

    });
}

function writeCovers(dataSource) {
	console.log(dataSource);
	$.each(dataSource, function(i,val){
		if (val.featured != "") {
		var title = val.title
		var coverLink = "http://bclib.bc.edu/libsearch/bc/id/"+val.almaid	
		var image = "http://lib.syndetics.com/index.aspx?isbn="+val.isbn+"&upc=null/SC.JPG&client=bostonh"
		var link =$('<a>')
			.attr('href',coverLink)
			.addClass('new-book-cover');
		
		var cover = $('<img>')
			.attr('src',image)
			.attr('alt',title)
			.appendTo(link);	
		
		$(link).appendTo('#new-books');
		}	
		
	});
	
	
	
}