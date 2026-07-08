/**
 * Talon Construction Company — Lead Receiver (Google Apps Script)
 * FREE — no subscriptions. Logs every lead to this Google Sheet and
 * emails a notification.
 *
 * SETUP (5 minutes):
 * 1. Go to sheets.google.com → create a new sheet, name it "Talon Leads".
 * 2. Extensions → Apps Script. Delete the placeholder code, paste this
 *    whole file. Change NOTIFY_EMAIL below to where leads should go.
 * 3. Click Deploy → New deployment → gear icon → Web app.
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Click Deploy, authorize with your Google account, and copy the
 *    Web app URL (ends in /exec).
 * 4. In Cloudflare: Pages project → Settings → Environment variables →
 *    add LEAD_WEBHOOK_URL = that URL (Production). Redeploy the site.
 * 5. Submit a test through the live form — a row appears in the sheet
 *    and the notification email arrives.
 *
 * NOTE: if you later edit this script, you must Deploy → Manage
 * deployments → edit → New version for changes to take effect.
 */

const NOTIFY_EMAIL = "info@talonconstructioncompany.com"; // <-- change if needed

function doPost(e) {
  let lead = {};
  try {
    lead = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: "Invalid JSON" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  // Add a header row the first time
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Received", "Name", "Email", "Phone", "Project", "Message", "Page"]);
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
  }

  sheet.appendRow([
    new Date(),
    lead.name || "",
    lead.email || "",
    lead.phone || "",
    lead.project || "",
    lead.message || "",
    lead.page || "",
  ]);

  // Email notification (MailApp free quota: 100/day personal Gmail — plenty)
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: lead.email || NOTIFY_EMAIL,
      subject: "Website lead: " + (lead.name || "Unknown") + " — " + (lead.project || "General"),
      body:
        "Name: " + (lead.name || "—") + "\n" +
        "Email: " + (lead.email || "—") + "\n" +
        "Phone: " + (lead.phone || "—") + "\n" +
        "Project type: " + (lead.project || "—") + "\n\n" +
        (lead.message || "(no message)") + "\n\n" +
        "Submitted: " + (lead.submitted || "") + "\n" +
        "Page: " + (lead.page || ""),
    });
  } catch (err) {
    // Sheet row is already saved even if email fails
  }

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true })
  ).setMimeType(ContentService.MimeType.JSON);
}
