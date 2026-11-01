import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/audio', express.static(path.join(process.cwd(), 'public/audio')));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Route to generate romantic poem / message or Quran reflection
app.post('/api/generate-text', async (req, res) => {
  try {
    const { mode, partnerName, topic, tone } = req.body;
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API is not configured with an API key.' });
    }

    let prompt = '';
    if (mode === 'romantic') {
      prompt = `أنت كاتب وشاعر رومانسي محترف. اكتب كلمات ورسالة حب ورومانسية راقية وعاطفية جداً باللغة العربية.
الاسم الموجه له (إن وجد): ${partnerName || 'الحبيب/الحبيبة'}.
المناسبة أو الطابع: ${topic || 'عشق وشوق واعتراف بالحب'}.
الأسلوب: ${tone || 'شاعري عميق ودافئ'}.
المطلوب:
عبارات رومانسية رقيقة من 2 إلى 4 أسطر تصلح لتظهر كنصوص متحركة في فيديو رومانسي مؤثر.
اكتب بالتشكيل الخفيف وأسلوب نقي بدون أي مقدمات أو شروحات جانبية، وافصل بين الأسطر بنزول سطر.`;
    } else {
      prompt = `اكتب خاطرة إيمانية وتأملاً قرآنياً قصيراً ومؤثراً باللغة العربية الفصحى عن الموضوع التالي: ${topic || 'السكينة والتوكل على الله ورضا النفس'}.
المطلوب: جملتان إلى ثلاث جمل روحانية عذبة ومهدئة للقلب مع التشكيل، مناسبة لتظهر كنص متحرك في مقطع فيديو إسلامي قصير. بدون مقدمات أو فذلكة.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    res.json({ text });
  } catch (error: any) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate text' });
  }
});

// Route to proxy audio streams with CORS headers
app.get('/api/audio-proxy', async (req, res) => {
  try {
    const audioUrl = req.query.url as string;
    if (!audioUrl) {
      return res.status(400).send('Missing audio url');
    }

    const response = await fetch(audioUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch remote audio');
    }

    res.set({
      'Content-Type': response.headers.get('content-type') || 'audio/mpeg',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'public, max-age=86400',
    });

    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err: any) {
    console.error('Audio proxy error:', err);
    res.status(500).send('Proxy error: ' + err.message);
  }
});

// Setup Vite middleware
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  app.use(express.static('dist'));
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
