function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||""
}

mycategory = getURLParameter('category');
myaudience = getURLParameter('audience');

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

// begin main function
$(document).ready(function(){

	var collapsedGroups = {};

	function applyGroupToggleState(table) {
		table.find('tr.group').each(function () {
			var groupKey = $(this).data('group');
			var isCollapsed = collapsedGroups[groupKey] === true;
			var toggle = $(this).find('.group-toggle');
			toggle.find('.group-toggle-icon').text(isCollapsed ? '▸' : '▾');
			toggle.attr('aria-expanded', String(!isCollapsed));

			table.find('tr.group-item').filter(function () {
				return $(this).data('group') === groupKey;
			}).toggle(!isCollapsed);
		});

		var groupRows = table.find('tr.group');
		var allCollapsed = groupRows.length > 0 && groupRows.toArray().every(function (groupRow) {
			return collapsedGroups[$(groupRow).data('group')] === true;
		});
		$('#toggle-all-groups')
			.attr('aria-expanded', String(!allCollapsed));
	}

	// create table headers
	function createTableColumns(){

		var allTableColumns = [
			{'title': 'Title', 'visible': false, 'searchable': false},
			{'title': 'Feature', 'visible': false, 'searchable': false},
			{'title': 'Subject', 'className': 'Subject', 'visible': false}, // 2
			{'title': 'Call Number', 'visible': false, 'searchable': false},
			{'title': 'Author', 'visible': false, 'searchable': false},
			{'title': 'Alma ID', 'visible': false, 'searchable': false},
			{'title': 'ISBN', 'visible': false, 'searchable': false},
			{'title': 'EbookURL', 'visible': false, 'searchable': false},
			{'title': 'Month', 'visible': false}, // 8
			{'title': 'Issue', 'visible': false},
			{'title': 'Link', 'visible': false, 'searchable': false},
			{'title': 'Image', 'className': 'image'},
			{'title': 'Cite', 'sWidth': '450px', 'className': 'cite preLoad'}, // 12
			{'HD_Image': 'HD_Image', 'visible': false, 'searchable': false},
			{'title': 'Summary', 'sWidth': '360px', 'className': 'summary'}
		];
		
		return allTableColumns;
	}

	//function that runs on init to creat the menu
	function createMenu(oTable) {
		//Create Issue List
		var monthList = oTable
			.columns( 8, {order:'index'} )
			.data()
			.eq( 0 )      // Reduce the 2D array into a 1D array of data
			.unique();     // Reduce to unique values

		
		var mList = $('div.monthList')

		var showAll = $('<span/>')
			.addClass('ui-menu-item btn btn-maroon btn-default')
			.attr('role', 'menuitem')
			.appendTo(mList);
		
			$('<a/>')
			.addClass('allMonthsLink')
			.text('Show All')
			.attr('href', '#')
			.appendTo(showAll);

		$.each(monthList, function(i){
				var span = $('<span/>')
					.addClass('ui-menu-item btn btn-maroon btn-default')
					.attr('role', 'menuitem')
					.appendTo(mList);
				var aaa = $('<a/>')
					.addClass('monthLink')
					.text(monthList[i])
					.attr('href','#')
					.appendTo(span);
			}
		);

		$('<button/>')
			.attr({
				'id': 'toggle-all-groups',
				'type': 'button',
				'aria-expanded': 'true'
			})
			.addClass('btn btn-default all-groups-toggle')
			.text('Collapse/Expand')
			.insertBefore('#newacq')
			.on('click', function () {
				var groupRows = $('#data-table-container').find('tr.group');
				var allCollapsed = groupRows.length > 0 && groupRows.toArray().every(function (groupRow) {
				return collapsedGroups[$(groupRow).data('group')] === true;
				});

				groupRows.each(function () {
				collapsedGroups[$(this).data('group')] = !allCollapsed;
				});
				applyGroupToggleState($('#data-table-container'));
			});

		function filterByMonth(month) {
			$('.highlight-issue').removeClass('highlight-issue');
			if (month) {
				$('a.monthLink').filter(function () {
					return $(this).text() === month;
				}).addClass('highlight-issue').parent().addClass('highlight-issue');
			} else {
				$('a.allMonthsLink').addClass('highlight-issue').parent().addClass('highlight-issue');
			}

			oTable
				.columns()
				.search('')
				.columns(8)
				.search(month || '')
				.draw();
		}

		$("a.monthLink")
			.click(function (event) {
				event.preventDefault();
				$(".prev").slideUp();
				filterByMonth($(this).text());
			});

		$("a.allMonthsLink")
			.click(function (event) {
				event.preventDefault();
				$(".prev").slideUp();
				filterByMonth('');
			});

		var latestMonth = monthList[0];
		$.each(monthList, function (i, month) {
			var monthDate = Date.parse(month);
			var latestDate = Date.parse(latestMonth);
			if (!isNaN(monthDate) && (isNaN(latestDate) || monthDate > latestDate)) {
				latestMonth = month;
			}
		});
		filterByMonth(latestMonth);

		$("a.prevLink")
		.click(function () {
			$(".rss").slideUp();
			$(".prev").slideToggle();

		});
	}

	// create the table container and object
    $('#newacq').html('<table cellpadding="0" cellspacing="0" border="0" class="display table" id="data-table-container" style="width:100%"></table>');

	const acqURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRwQMJVT6cctJMbqY2OF4c4dRH2AFnCNJ-mTL1h3zjeJj7D3rw2Te1qvTgyNH0fAe_RYZhkL3j7oMuA/pub?gid=0&single=true&output=csv';
	
	async function main(acqURL) {
		const acqData = await fetchCSVData(acqURL);
		
		var data = acqData.data.map(Object.values);

		// console.log("Data fetched and processed:", data);

		const columns = createTableColumns();

		var oTable = $('#data-table-container').DataTable({
			'sPaginationType': 'bootstrap',
			'bPaginate': false,
			'bInfo': false,
			'dom' : 'tr',
			'data': data,
			'iDisplayLength': 200,
			'columns': columns,
			'oLanguage': {
				'sLengthMenu': '_MENU_ records per page'
			},
			'order': [[ 2, "asc" ],[ 12, "asc" ] ],
			'initComplete' : function (settings) {
				var api = this.api();
				createMenu(api);
			},
			'drawCallback': function ( settings ) {
				var api = this.api();
				var rows = api.rows( {page:'current'} ).nodes();
				var last=null;

				api.column(2, {page:'current'} ).data().each( function ( group, i ) {
					var groupKey = $.trim(group || '');
					if ( last !== group ) {
						$(rows).eq( i ).before(
							'<tr class="group" data-group="'+groupKey+'"><td colspan="3"><button type="button" class="group-toggle" data-group="'+groupKey+'" aria-expanded="true"><span class="group-toggle-icon">▾</span> <span class="group-title">'+group+'</span></button></td></tr>'
						);

						last = group;
					}

					$(rows).eq( i ).addClass('group-item').attr('data-group', groupKey);
				} );

				$('#data-table-container').find('.group-toggle').off('click').on('click', function () {
					var groupKey = $(this).data('group');
					collapsedGroups[groupKey] = collapsedGroups[groupKey] !== true;
					applyGroupToggleState($('#data-table-container'));
				});

				applyGroupToggleState($('#data-table-container'));
			}
		});
	}

	main(acqURL);

});

//define two custom functions (asc and desc) for string sorting
jQuery.fn.dataTableExt.oSort['string-case-asc']  = function(x,y) {
	return ((x < y) ? -1 : ((x > y) ?  0 : 0));
};

jQuery.fn.dataTableExt.oSort['string-case-desc'] = function(x,y) {
	return ((x < y) ?  1 : ((x > y) ? -1 : 0));
};
