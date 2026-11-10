async function fetchCSVData(url) {
  /* Takes Google Sheets URL and returns an object.
     Object.data is an array of objects, 
     in which each object is a line on the spreadsheet. */
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch CSV");
    return Papa.parse(await response.text(), { header: true });
  } catch (error) {
    console.error(error);
	console.log("Error fetching CSV data. Please check the URL or your internet connection.");
    return { data: [] }; // Return empty object in case of error
  }
}

//function to write new book covers and links to the page. Runs after the data is loaded from a Google Sheet via the Google Sheets API v4
function writeCovers(dataSource) {
	$.each(dataSource, function(i,val){
		var title = val.title
		var coverLink = "https://bclib.bc.edu/libsearch/bc/id/"+val.almaid
		
    // var image = "https://lib.syndetics.com/index.aspx?isbn="+val.isbn+"&upc=null/SC.JPG&client=bostonh";
		var image = val.image;
    var link =$('<a>')
			.attr('href',coverLink)
			.addClass('new-book-cover hover-drop-shadow');

		var cover = $('<img>')
			.attr('src',image)
			.attr('alt',title)
			.appendTo(link);

		$(link).appendTo('#new-books');
	});
}

const acqURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRwQMJVT6cctJMbqY2OF4c4dRH2AFnCNJ-mTL1h3zjeJj7D3rw2Te1qvTgyNH0fAe_RYZhkL3j7oMuA/pub?gid=0&single=true&output=csv';

// begin main function
$(document).ready(function(){

  async function main(acqURL) {
    //load the data from the Google Sheet
    const acqData = await fetchCSVData(acqURL);
    var myData = acqData.data; //spreadsheet data lives in an array with the name values
        //rewrite data to an object with key-value pairs. This is also a chance to rename or ignore columns.
        //only a few columns are used for this application - different columns are used in the full new books list
    
    // console.log(myData);
    myData= myData.map(function( n, i ) {
      var myObject = {
        title:n.Title,
        featured:n.Featured,
        almaid:n['Alma ID'],
        isbn:n.ISBN,
        link:n.Link,
        image:n.HD_Image
      };
      return myObject;
    });
    // console.log(myData);
    filteredData = myData.filter(val => val.featured == 'yes').slice(0, 6);
    // console.log(filteredData);
    writeCovers(filteredData);
  }
  main(acqURL);
});
