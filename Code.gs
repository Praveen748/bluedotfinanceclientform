/**
 * Blue Dot Finance Advisory - intake receiver
 * Bound to the Google Sheet that will store responses (Extensions > Apps Script).
 * Deploy as Web App: Execute as "Me", Who has access "Anyone".
 */
const SHARED_TOKEN = "CHANGE_ME";      // must match CONFIG.token in index.html
const SHEET_NAME   = "Responses";
const NOTIFY_EMAIL = "";               // optional: your email for new-lead alerts

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const data = JSON.parse(e.postData.contents);
    if (data.token !== SHARED_TOKEN) return out_({ ok: false, error: "unauthorized" });
    delete data.token;

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // First submission defines the headers. They are never edited afterwards,
    // so the calculation engine can always map columns reliably.
    if (sh.getLastRow() === 0) {
      const headers = ["timestamp_server"].concat(Object.keys(data));
      sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
      sh.setFrozenRows(1);
    }
    const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const row = headers.map(h => h === "timestamp_server" ? new Date() : (data[h] !== undefined ? data[h] : ""));
    sh.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, "New client intake: " + (data.full_name || ""),
        "Service: " + data.service + "\nPhone: " + data.phone + "\nEmail: " + data.email);
    }
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
