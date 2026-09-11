/**
 * Vercel Serverless Function: /api/submit
 * Forwards form submissions to Google Apps Script Web App Endpoint set in GOOGLE_SHEET_URL.
 */

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
    const { name, email, description, timestamp } = req.body || {};

    if (!name || !email || !description) {
      return res.status(400).json({ error: 'Missing required fields (name, email, description)' });
    }

    // Google Apps Script Web App URL strictly from environment variable
    const targetUrl = process.env.GOOGLE_SHEET_URL;

    if (!targetUrl) {
      return res.status(500).json({ error: 'GOOGLE_SHEET_URL environment variable is not configured.' });
    }

    // Send payload to Google Apps Script
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('email', email);
    params.append('description', description);
    params.append('timestamp', timestamp || new Date().toISOString());

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const textResult = await response.text();

    return res.status(200).json({
      success: true,
      result: textResult,
    });
  } catch (error) {
    console.error('API submit error:', error);
    return res.status(500).json({ error: 'Server error while forwarding submission: ' + error.message });
  }
}
