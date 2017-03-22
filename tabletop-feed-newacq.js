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
        callback: writeTableWith,
        simpleSheet: true,
        debug: true,

    });
}

// create table headers
function createTableColumns(){

    /* swap out the properties of mDataProp & sTitle to reflect
    the names of columns or keys you want to display.
    Remember, tabletop.js strips out spaces from column titles, which
    is what happens with the More Info column header */

    var tableColumns =   [
		{'mDataProp': 'image', 'sTitle': 'Image', 'sClass':'image' },
		{'mDataProp': 'cite', 'sTitle': 'Cite', 'sWidth':'360px', 'sClass':'cite preLoad' },
		{'mDataProp': 'subject', 'sTitle': 'Subject', 'sClass':'Subject', 'bVisible':false },		
		{'mDataProp': 'month', 'sTitle': 'Month', 'bVisible':false },
		{'mDataProp': 'issue', 'sTitle': 'Issue', 'bVisible':false }
		
	];
    return tableColumns;
}

// create the table container and object
function writeTableWith(dataSource){

	

    $('#newacq').html('<table cellpadding="0" cellspacing="0" border="0" class="display table" id="data-table-container" style="width:100%"></table>');

    var oTable = $('#data-table-container').DataTable({
		
		
		'sPaginationType': 'bootstrap',
		'bPaginate': false,
		'bInfo': false,
		'dom' : 'tr',
		'iDisplayLength': 200,
        'aaData': dataSource,
        'aoColumns': createTableColumns(),
        'oLanguage': {
            'sLengthMenu': '_MENU_ records per page'
		
        },
		'order': [[ 2, "asc" ],[ 1, "asc" ] ],
		'drawCallback': function ( settings ) {
           var api = this.api();
           var rows = api.rows( {page:'current'} ).nodes();
           var last=null;
 
            api.column(2, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group"><td colspan="2"><h4>'+group+'</h4></td></tr>'
                    );
 
                    last = group;
                }
            } );
        }
    });
	
	
		
	//Create Issue List	
	var issueList= 
    oTable
        .columns( 3, {order:'index'} )
        .data()
        .eq( 0 )      // Reduce the 2D array into a 1D array of data
		.unique();     // Reduce to unique values
		
	var mList = $('div.monthList')
	$.each(issueList, function(i)
			
		{	
			var span = $('<span/>')
				.addClass('ui-menu-item btn btn-maroon btn-default')
				.attr('role', 'menuitem')
				.appendTo(mList);
			var aaa = $('<a/>')
				.addClass('issueLink')
				.text(issueList[i])
				.attr('href','#')
				.appendTo(span);
		});

	
	

	$(".monthList span a:first, .monthList span:first").addClass("highlight-issue");
	
	//Filter to current issue
	var currentIssue = oTable
		.column(4)
		.data()
		.sort(function(a, b){return a-b})
		.reverse()[0];
	
	oTable
				.columns(4)
				.search(currentIssue)
				.draw();
	
	var subjectList=
    oTable
        .columns( 2, {search:'applied'} )
        .data()
        .eq( 0 )      // Reduce the 2D array into a 1D array of data
        .sort()       // Sort data alphabetically
        .unique();     // Reduce to unique values
		
	var cList = $('ul.mylist')
	$.each(subjectList, function(i)//create subject menu
		{
			var li = $('<li/>')
				.addClass('ui-menu-item')
				.attr('role', 'menuitem')
				.appendTo(cList);
			var aaa = $('<a/>')
				.addClass('subjectLink')
				.text(subjectList[i])
				.attr('href','#')
				.appendTo(li);
		});
	var li = $('<li/>') //add Show All link at end of subject menu
				.addClass('all')
				.attr('role', 'menuitem')
				.appendTo(cList);
	var aaa = $('<a/>')
				.addClass('all')
				.text('Show all items in this issue')
				.attr('href','#')
				.appendTo(li);
	
	
	if (mycategory.length >0) {
	var highlightclass="li#"+mycategory;
	 $ (highlightclass).addClass ("highlight-subject");
	 oTable.fnFilter(mycategory, 2);
	} 
	else {$(".all").addClass ("highlight-subject").parent('li').addClass('highlight-li');}

	if (myaudience.length >0) {
	var highlightclass="li."+myaudience;
	 $ (highlightclass).addClass ("highlight-audience");
	 oTable.fnFilter(myaudience, 3);
	}

	

	
	$("ul.category li.filter")
		.click(function(event){
			event.preventDefault();
			$ (".highlight-category").removeClass ("highlight-category");
			mycategory=$(this).attr("id");
			var highlightclass="li#"+mycategory;
			$ (highlightclass)
				.addClass ("highlight-category");
				
			
			oTable.fnFilter(mycategory, 2);
			
		});
		

		
	
	$("a.issueLink")
		.click(function(event){
			event.preventDefault();
			$(".prev").slideUp();
			myissue=$(this).text();
			$ (".highlight-issue").removeClass ("highlight-issue");
			$ (this)
				.addClass ("highlight-issue")
				.parent()
				.addClass ("highlight-issue");
			
			oTable
				.columns()
				.search("")
				.columns(3)
				.search(myissue)
				.draw();
			var subjectList=
			oTable
				.columns( 2, {search:'applied'} )
				.data()
				.eq( 0 )      // Reduce the 2D array into a 1D array of data
				.sort()       // Sort data alphabetically
				.unique();     // Reduce to unique values
		
			$('ul.mylist').html("");
			var cList = $('ul.mylist')

			$.each(subjectList, function(i)
				{
					var li = $('<li/>')
						.addClass('ui-menu-item')
						.attr('role', 'menuitem')
						.appendTo(cList);
					var aaa = $('<a/>')
						.addClass('subjectLink')
						.text(subjectList[i])
						.attr('href','#')
						.appendTo(li);
				});
			
			var li = $('<li/>') //add Show All link at end of subject menu
				.addClass('all')
				.attr('role', 'menuitem')
				.appendTo(cList);
			var aaa = $('<a/>')
				.addClass('all')
				.text('Show all items in this issue')
				.attr('href','#')
				.appendTo(li);

		$("a.subjectLink")
		.click(function(event){
			event.preventDefault();
			mycategory=$(this).text();
			$ (".highlight-subject").removeClass("highlight-subject");
			$ (".highlight-li").removeClass("highlight-li");
			$ (this)
				.addClass ("highlight-subject")
				.parent('li')
				.addClass('highlight-li');
			
			oTable
				.columns(2)
				.search(mycategory)
				.draw();
		});
		$("li.all")
		.click(function(event){
			event.preventDefault();
			$ (".highlight-subject").removeClass ("highlight-subject");
			$ (".highlight-li").removeClass("highlight-li");
			mycategory=$(this).attr("class");
			var highlightclass="a."+mycategory;
			$ (highlightclass)
				.addClass ("highlight-subject")
				.parent('li')
				.addClass('highlight-li');
				
				
		
			oTable
				.columns(2)
				.search("")
				.draw();
			

		
			
			
		});		
		});
		
		$("a.subjectLink")
		.click(function(event){
			event.preventDefault();
			mycategory=$(this).text();
			$ (".highlight-subject").removeClass("highlight-subject");
			$ (".highlight-li").removeClass("highlight-li");
			$ (this)
				.addClass ("highlight-subject")
				.parent('li')
				.addClass('highlight-li');
			
			oTable
				.columns(2)
				.search(mycategory)
				.draw();
			
			
		});
			
			


		
	$("li.all")
		.click(function(event){
			event.preventDefault();
			$ (".highlight-subject").removeClass ("highlight-subject");
			$ (".highlight-li").removeClass("highlight-li");
			mycategory=$(this).attr("class");
			var highlightclass="a."+mycategory;
			$ (highlightclass)
				.addClass ("highlight-subject")
				.parent('li')
				.addClass('highlight-li');
				
		
			oTable
				.columns(2)
				.search("")
				.draw();
			

		});

	$("a.prevLink")
		.click(function() {
			$(".rss").slideUp();
			$(".prev").slideToggle();
			
		});

		
		
			
		}
		
				
	
	

	
	
	



//define two custom functions (asc and desc) for string sorting
jQuery.fn.dataTableExt.oSort['string-case-asc']  = function(x,y) {
	return ((x < y) ? -1 : ((x > y) ?  0 : 0));
};

jQuery.fn.dataTableExt.oSort['string-case-desc'] = function(x,y) {
	return ((x < y) ?  1 : ((x > y) ? -1 : 0));
};