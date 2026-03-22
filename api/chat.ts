const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check API key
  if (!GEMINI_API_KEY) {
    console.error('❌ API Key not found');
    return res.status(200).json({ 
      reply: '🙏 সাময়িক সমস্যা।\n\nযোগাযোগ করুন:\n📞 ০১৭৩৩১১৮৩১৩\n📞 ০১৬১২১১৮৩১৩'
    });
  }

  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const systemPrompt = `তুমি "কলম হিন্দু ধর্মসভা" এর AI সহায়ক। নাম "ধর্ম সহায়ক"।

## ধর্মসভার তথ্য:
- প্রতিষ্ঠা: ২০১৭ সাল
- ঠিকানা: কলম, সিংড়া, নাটোর, রাজশাহী, বাংলাদেশ
- যোগাযোগ: ০১৭৩৩১১৮৩১৩, ০১৬১২১১৮৩১৩
- ইমেইল: durgapuja12@gmail.com
- ফেসবুক: facebook.com/KHDS3
- সদস্য: ১০০+ জন

## পূজাসমূহ:
- দূর্গাপূজা (আশ্বিন মাস - সেপ্টেম্বর/অক্টোবর)
- শ্যামাপূজা/কালীপূজা (কার্তিক মাস - দীপাবলি)
- সরস্বতী পূজা (মাঘ মাস - বসন্ত পঞ্চমী)
- রথযাত্রা (আষাঢ় 
