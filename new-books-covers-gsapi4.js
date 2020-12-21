//function to write new book covers and links to the page. Runs after the data is loaded from a Google Sheet via the Google Sheets API v4
function writeCovers(dataSource) {
	$.each(dataSource, function(i,val){
		if (val.featured != "") {
		var title = val.title
		var coverLink = "https://bclib.bc.edu/libsearch/bc/id/"+val.almaid
		var image = "https://lib.syndetics.com/index.aspx?isbn="+val.isbn+"&upc=null/SC.JPG&client=bostonh"
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
// begin main function
$(document).ready(function(){
  //load the data from the Google Sheet
  $.ajax({
    url: "https://sheets.googleapis.com/v4/spreadsheets/1Ym_DjK2JNfwv5HeTvF8wVtmOg-TXQZKwzEJg5gJunuA/values/A:M?key=AIzaSyD8Y28YJpVhE4XlVlOoA74Ws47YdPz5nGA"
  })
  .done(function( json ) {
    var myData = json['values']; //spreadsheet data lives in an array with the name values
       //rewrite data to an object with key-value pairs. This is also a chance to rename or ignore columns.
       //only a few columns are used for this application - different columns are used in the full new books list
       myData= myData.map(function( n, i ) {
           var myObject = {
             title:n[0],
             featured:n[1],
             almaid:n[5],
             isbn:n[6]
           };
           return myObject;
       });
       myData.splice(0,1); //remove the first row, which contains the orginal column headers
       writeCovers(myData);
  });
});
