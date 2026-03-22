const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(200).json({ 
      reply: '🙏 API সমস্যা। যোগাযোগ: ০১৭৩৩১১৮৩১৩' 
    });
  }

  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const systemPrompt = `তুমি "কলম হিন্দু ধর্মসভা" এর AI সহায়ক "ধর্ম সহায়ক"।

ধর্মসভা তথ্য:
- প্রতিষ্ঠা: ২০১৭
- ঠিকানা: কলম, সিংড়া, নাটোর
- যোগাযোগ: ০১৭৩৩১১৮৩১৩
- পূজা: দূর্গা, শ্যামা, সরস্বতী, রথযাত্রা

তুমি বাংলায় উত্তর দাও। হিন্দু ধর্ম বিশেষজ্ঞ।`;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'প্রস্তুত 🙏' }] }
    ];

    if (history?.length) {
      history.slice(-6).forEach((m: any) => {
        contents.push({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        });
      });
    }

    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.9, maxOutputTokens: 2048 }
      })
    });

    if (!response.ok) throw new Error('API error');

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) throw new Error('No response');

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(200).json({ 
