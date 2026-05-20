import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { tarotCards } from '../src/lib/server/db/schema.js';
import fs from 'fs';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set.');

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

async function main() {
	try {
		console.log('Reading tarot data...');
		const data = JSON.parse(fs.readFileSync('./scripts/tarot_data.json', 'utf8'));

		console.log(`Seeding ${data.length} cards...`);

		// Delete existing to avoid conflicts and ensure clean data
		await db.delete(tarotCards);

		// Insert in batches of 10 to be safe
		for (let i = 0; i < data.length; i += 10) {
			const batch = data.slice(i, i + 10);
			await db.insert(tarotCards).values(batch);
			console.log(`Inserted ${i + batch.length}/${data.length}...`);
		}

		console.log('Full Seeding completed successfully!');
	} catch (error) {
		console.error('Error seeding database:', error);
	} finally {
		await client.end();
	}
}

main();
