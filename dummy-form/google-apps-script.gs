const SPREADSHEET_ID = '1ZErDpahDTphX251eHncQvUhsZYyaTfL3qmuZepzOM40';
const HEADERS = [
  'Timestamp', 'Name', 'Email', 'Description', 'Source URL',
  'Source Path', 'Form Type', 'Duplicate', 'Form Name', 'Payload JSON'
];

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
    const currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    const mergedHeaders = HEADERS.map((header, index) => currentHeaders[index] || header);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([mergedHeaders]);

    const data = e.parameter || {};
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.description || '',
      data.source_url || '',
      data.source_path || '',
      data.form_type || '',
      data.duplicate || '',
      data.form_name || '',
      data.payload_json || '{}'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', message: 'Data successfully recorded' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
