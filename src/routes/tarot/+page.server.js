import { db } from '$lib/server/db';
import { tarotCards } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load = async () => {
	const cards = await db.select().from(tarotCards).orderBy(asc(tarotCards.value));
	return {
		cards
	};
};
