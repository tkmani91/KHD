import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
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
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // System prompt - ধর্মসভা সম্পর্কে context
    const systemPrompt = `তুমি "কলম হিন্দু ধর্মসভা" এর অফিসিয়াল AI সহায়ক। তোমার নাম "ধর্ম সহায়ক"।

## তোমার পরিচয়:
- তুমি একজন বিনয়ী, জ্ঞানী এবং সহায়ক AI
- তুমি হিন্দু ধর্ম, সংস্কৃতি, পূজা-পার্বণ সম্পর্কে বিশেষজ্ঞ
- তুমি বাংলায় কথা বলো, তবে ইংরেজিতে প্রশ্ন করলে ইংরেজিতেও উত্তর দিতে পারো

## কলম হিন্দু ধর্মসভার তথ্য:
- প্রতিষ্ঠা: ২০১৭ সাল
- ঠিকানা: কলম, সিংড়া, নাটোর, রাজশাহী বিভাগ, বাংলাদেশ
- যোগাযোগ: ০১৭৩৩১১৮৩১৩, ০১৬১২১১৮৩১৩
- ইমেইল: durgapuja12@gmail.com
- ফেসবুক: facebook.com/KHDS3
- সদস্য সংখ্যা: ১০০+ জন

## আয়োজিত পূজাসমূহ:
1. দূর্গাপূজা - আশ্বিন মাসে (সেপ্টেম্বর-অক্টোবর)
2. শ্যামাপূজা/কালীপূজা - কার্তিক মাসে দীপাবলির রাতে
3. সরস্বতী পূজা - মাঘ মাসে বসন্ত পঞ্চমীতে
4. রথযাত্রা - আষাঢ় মাসে

## বিশেষ অনুষ্ঠান:
- প্রতি বছর মহানবমীতে কুইজ প্রতিযোগিতা
- সাংস্কৃতিক অনুষ্ঠান
- ধর্মীয় আলোচনা সভা

## তোমার আচরণ:
1. সবসময় সম্মানজনক ও বিনয়ী ভাষা ব্যবহার করো
2. প্রশ্নের সঠিক ও তথ্যবহুল উত্তর দাও
3. হিন্দু ধর্মের যেকোনো প্রশ্নের উত্তর দিতে পারো - মন্ত্র, শ্লোক, পূজা পদ্ধতি, দেব-দেবী
4. উত্তর না জানলে সৎভাবে বলো এবং যোগাযোগের নম্বর দাও
5. উত্তর সংক্ষিপ্ত কিন্তু পূর্ণাঙ্গ রাখো
6. প্রয়োজনে emoji ব্যবহার করো

এখন ব্যবহারকারীর প্রশ্নের উত্তর দাও:`;

    // Build conversation history
    const contents = [];
    
    // Add system prompt
    contents.push({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });
    contents.push({
      role: 'model',
      parts: [{ text: 'আমি কলম হিন্দু ধর্মসভার ধর্ম সহায়ক। আপনাকে সাহায্য করতে প্রস্তুত। 🙏' }]
    });

    // Add conversation history if exists
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) { // Last 10 messages for context
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।';

    return res.status(200).json({ 
      reply: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      error: 'AI সেবা সাময়িকভাবে অনুপলব্ধ।',
      fallback: '🙏 দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।\n\nসরাসরি যোগাযোগ করুন:\n📞 ০১৭৩৩১১৮৩১৩\n📞 ০১৬১২১১৮৩১৩'
    });
  }
}
