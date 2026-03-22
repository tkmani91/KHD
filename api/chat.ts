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
      reply: '🙏 সাময়িক সমস্যা।\n\nযোগাযোগ করুন:\n📞 ০১৭৩৩১১৮৩১৩' 
    });
  }

  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const systemPrompt = `তুমি "কলম হিন্দু ধর্মসভা" এর AI সহায়ক। নাম "ধর্ম সহায়ক"।

ধর্মসভার তথ্য:
- প্রতিষ্ঠা: ২০১৭ সাল
- ঠিকানা: কলম, সিংড়া, নাটোর
- যোগাযোগ: ০১৭৩৩১১৮৩১৩, ০১৬১২১১৮৩১৩
- ইমেইল: durgapuja12@gmail.com

পূজাসমূহ: দূর্গাপূজা, শ্যামাপূজা, সরস্বতী পূজা, রথযাত্রা

তুমি বাংলায় উত্তর দাও। হিন্দু ধর্ম, মন্ত্র, পূজা, দেব-দেবী সব জানো।`;

    const contents: any[] = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'প্রস্তুত। 🙏' }] }
    ];

    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }

    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error('No response');
    }

    return res.status(200).json({ reply: aiResponse });

  } catch (error: any) {
    return res.status(200).json({ 
      reply: `🙏 দুঃখিত, সাময়িক সমস্যা।\n\nযোগাযোগ করুন:\n📞 ০১৭৩৩১১৮৩১৩\n📞 ০১৬১২১১৮৩১৩`
    });
  }
}
