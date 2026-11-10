# New Books List
This widget displays a searchable list of new books from a Google Sheet. Books are sorted by subject and organized into periodic issues.

A separate widget displays cover images from books marked as featured, with links to catalog records.

This application pulls CSV data from public Google Sheets maintained by the BC Law Library, then parses it using [Papa Parse](https://www.papaparse.com/) into JSON. The data is then displayed using [DataTables](https://datatables.net/) and jQuery.
