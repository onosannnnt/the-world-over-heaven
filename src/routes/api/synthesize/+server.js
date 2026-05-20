import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { readingHistory } from '$lib/server/db/schema';

export async function POST({ request, locals }) {
	try {
		if (!locals.session) {
			return json({ error: 'Unauthorized. Please log in to use AI Insight.' }, { status: 401 });
		}

		if (!env.GEMINI_API_KEY) {
			return json({ error: 'GEMINI_API_KEY is not set.' }, { status: 500 });
		}

		const { cards, question } = await request.json();

		if (!cards || !Array.isArray(cards) || cards.length === 0) {
			return json({ error: 'No cards provided.' }, { status: 400 });
		}

		const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
		const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

		const promptCards = cards
			.map((c) => `- ${c.nameTh} (${c.nameEn}) [${c.isReversed ? 'กลับหัว' : 'ตั้งตรง'}]`)
			.join('\n');

		const prompt = `
คุณคือ Tarot Reader ที่พูดตรงประเด็น เน้นเนื้อๆ ไม่เอาน้ำ
ไพ่ที่เปิดได้:
${promptCards}
${question ? `คำถาม: "${question}"` : 'วิเคราะห์ภาพรวม'}

กติกาการตอบ:
1. วิเคราะห์ทีละใบ: บอกสั้นๆ ว่าไพ่ใบนี้ตอบคำถาม (หรือส่งผลต่อดวง) อย่างไร (1-2 ประโยคต่อใบ)
2. บทสรุป: สรุปคำตอบสุดท้ายสั้นๆ ชัดเจน

ใช้ภาษาไทยที่เป็นกันเองแต่สุภาพ ไม่ต้องมีคำเกริ่นนำหรือคำส่งท้ายที่เยิ่นเย้อ
`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		// Save to Database
		await db.insert(readingHistory).values({
			timestamp: new Date().toISOString(),
			cards: cards.map((c) => ({
				id: c.id,
				nameTh: c.nameTh,
				isReversed: c.isReversed,
				imageUrl: c.imageUrl
			})),
			question: question || 'ภาพรวม',
			aiSummary: text,
			userId: locals.user.id
		});

		return json({ summary: text });
	} catch (error) {
		console.error('Error:', error);
		return json({ error: 'Failed to generate summary.' }, { status: 500 });
	}
}
