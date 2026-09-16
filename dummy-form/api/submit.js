const NAME_FIELDS = ['full_name', 'participant_name', 'applicant_name', 'respondent_name', 'guest_name', 'customer_name', 'subscriber_name', 'reporter_name', 'volunteer_name'];
const EMAIL_FIELDS = ['email', 'work_email', 'applicant_email', 'account_email', 'respondent_email', 'guest_email', 'customer_email', 'subscriber_email', 'reporter_email', 'volunteer_email'];

function firstField(fields, names) {
  const value = names.map(name => fields[name]).find(Boolean);
  return Array.isArray(value) ? value.join(', ') : String(value || '');
}

export function buildSheetParams(body) {
  const formType = Number(body.formType);
  const duplicate = Number(body.duplicate);
  const fields = body.fields;

  if (!Number.isInteger(formType) || formType < 1 || formType > 10 ||
      !Number.isInteger(duplicate) || duplicate < 1 || duplicate > 10 ||
      !fields || typeof fields !== 'object' || Array.isArray(fields)) {
    throw new Error('Invalid form metadata or fields.');
  }

  const sourceUrl = String(body.sourceUrl || '');
  const sourcePath = String(body.sourcePath || '');
  const formName = String(body.formName || '');
  const payloadJson = JSON.stringify(fields);
  const expectedPath = `/dummy-form/${formType}/${duplicate}`;

  if (!sourceUrl || sourcePath.replace(/\/$/, '') !== expectedPath || payloadJson.length > 50000) {
    throw new Error('Invalid source URL or payload is too large.');
  }

  const description = [
    `Source URL: ${sourceUrl}`,
    `Form: ${formType}/${duplicate} - ${formName}`,
    payloadJson
  ].join('\n');

  return new URLSearchParams({
    timestamp: String(body.timestamp || new Date().toISOString()),
    name: firstField(fields, NAME_FIELDS),
    email: firstField(fields, EMAIL_FIELDS),
    description,
    source_url: sourceUrl,
    source_path: sourcePath,
    form_type: String(formType),
    duplicate: String(duplicate),
    form_name: formName,
    payload_json: payloadJson
  });
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const targetUrl = process.env.GOOGLE_SHEET_URL;

    if (!targetUrl) {
      return res.status(500).json({ error: 'GOOGLE_SHEET_URL environment variable is not configured.' });
    }

    let params;
    try {
      params = buildSheetParams(req.body || {});
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const textResult = await response.text();

    if (!response.ok) {
      return res.status(502).json({ error: `Spreadsheet endpoint returned HTTP ${response.status}.` });
    }

    let upstreamResult;
    try {
      upstreamResult = JSON.parse(textResult);
    } catch {
      upstreamResult = { result: textResult };
    }

    if (upstreamResult.result === 'error') {
      return res.status(502).json({ error: upstreamResult.message || 'Spreadsheet rejected the submission.' });
    }

    return res.status(200).json({
      success: true,
      sourceUrl: params.get('source_url'),
      result: upstreamResult,
    });
  } catch (error) {
    console.error('API submit error:', error);
    return res.status(500).json({ error: 'Server error while forwarding submission: ' + error.message });
  }
}
