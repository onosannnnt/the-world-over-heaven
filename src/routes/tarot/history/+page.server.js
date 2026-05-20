import { db } from '$lib/server/db';
import { readingHistory } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/login');
	}

	const history = await db
		.select()
		.from(readingHistory)
		.where(eq(readingHistory.userId, locals.user.id))
		.orderBy(desc(readingHistory.timestamp))
		.limit(20);

	return {
		history
	};
};
