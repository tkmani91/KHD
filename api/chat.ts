const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  // Check API Key
  if (!GEMINI_API_KEY) {
    return res.status(200).json({ 
      reply: '🙏 API সমস্যা। Admin এর সাথে যোগাযোগ করুন: ০১৭৩৩১১৮৩১৩' 
    });
  }

  try {
    // Parse request body
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message required',
        reply: 'প্রশ্ন লিখুন' 
      });
    }

    // System prompt
    const systemPrompt = `তুমি "কলম হিন্দু ধর্মসভা" এর AI সহায়ক "ধর্ম সহায়ক"।

সংগঠন তথ্য:
- প্রতিষ্ঠা: ২০১৭ সাল
- ঠিকানা: কলম, সিংড়া, নাটোর, রাজশাহী, বাংলাদেশ
- যোগাযোগ: ০১৭৩৩১১৮৩১৩, ০১৬১২১১৮৩১৩
- পূজা: দূর্গাপূজা, শ্যামাপূজা, সরস্বতী পূজা, রথযাত্রা

তুমি বাংলায় উত্তর দাও। হিন্দু ধর্ম, মন্ত্র, পূজা সব জানো। সংক্ষিপ্ত ও স্পষ্ট উত্তর দাও।`;

    // Build conversation
    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: 'আমি প্রস্তুত। 🙏' }]
      }
    ];

    // Add history if exists
    if (history && Array.isArray(history)) {
      history.slice(-6).forEach((msg: any) => {
        if (msg.role && msg.text) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        }
      });
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      })
    });

    // Parse response
    const data = await response.json();

    // Check for API errors
    if (data.error) {
      console.error('Gemini API Error:', data.error);
      throw new Error(data.error.message || 'Gemini API error');
    }

    // Extract reply
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error('No reply in response:', JSON.stringify(data));
      throw new Error('Empty response from AI');
    }

    // Success
    return res.status(200).json({ reply: reply.trim() });

  } catch (error: any) {
    console.error('Handler Error:', error.message);
    
    return res.status(200).json({ 
      reply: `🙏 দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।

সরাসরি যোগাযোগ করুন:
📞 ০১৭৩৩১১৮৩১৩
📞 ০১৬১২১১৮৩১৩

ত্রুটি: ${error.message}`
    });
  }
}
