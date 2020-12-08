function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||""
}

mycategory = getURLParameter('category');
myaudience = getURLParameter('audience');

// begin main function
$(document).ready(function(){

// create table headers
function createTableColumns(){

    var tableColumns =   [
		{'data': 'image', 'title': 'Image', 'className':'image' },
		{'data': 'cite', 'title': 'Cite', 'sWidth':'360px', 'className':'cite preLoad' },
		{'data': 'subject', 'title': 'Subject', 'className':'Subject', 'visible':false },
		{'data': 'month', 'title': 'Month', 'visible':false },
		{'data': 'issue', 'title': 'Issue', 'visible':false }

	];
    return tableColumns;
}

//function that runs on init to creat the menu
function createMenu() {
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

// create the table container and object




    $('#newacq').html('<table cellpadding="0" cellspacing="0" border="0" class="display table" id="data-table-container" style="width:100%"></table>');

    var oTable = $('#data-table-container').DataTable({


		'sPaginationType': 'bootstrap',
		'bPaginate': false,
		'bInfo': false,
		'dom' : 'tr',
    'ajax' : {
			url:'https://sheets.googleapis.com/v4/spreadsheets/1Ym_DjK2JNfwv5HeTvF8wVtmOg-TXQZKwzEJg5gJunuA/values/A:M?key=AIzaSyD8Y28YJpVhE4XlVlOoA74Ws47YdPz5nGA',
			cache: true,
      'dataSrc': function(json) {
        var myData = json['values']; //spreadsheet data lives in an array with the name values
        //rewrite data to an object with key-value pairs. This is also a chance to rename or ignore columns
        myData= myData.map(function( n, i ) {
            var myObject = {
              image:n[11],
              cite:n[12],
              subject:n[2],
              month:n[8],
              issue:n[9]
            };
            return myObject;
        });
        myData.splice(0,1); //remove the first row, which contains the orginal column headers
        return myData;
      }
    },
		'iDisplayLength': 200,
    'columns': createTableColumns(),
    'oLanguage': {
            'sLengthMenu': '_MENU_ records per page'

        },

		'order': [[ 2, "asc" ],[ 1, "asc" ] ],
    'initComplete' : function (settings) {
      createMenu();
    },

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





});













//define two custom functions (asc and desc) for string sorting
jQuery.fn.dataTableExt.oSort['string-case-asc']  = function(x,y) {
	return ((x < y) ? -1 : ((x > y) ?  0 : 0));
};

jQuery.fn.dataTableExt.oSort['string-case-desc'] = function(x,y) {
	return ((x < y) ?  1 : ((x > y) ? -1 : 0));
};
