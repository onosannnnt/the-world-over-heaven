import { pgTable, serial, integer, text, jsonb } from 'drizzle-orm/pg-core';

export const task = pgTable('task', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export const tarotCards = pgTable('tarot_cards', {
	id: text('id').primaryKey(), // e.g., 'major_0', 'cups_1'
	nameTh: text('name_th').notNull(),
	nameEn: text('name_en').notNull(),
	arcana: text('arcana').notNull(), // 'major' or 'minor'
	suit: text('suit'), // 'cups', 'wands', 'swords', 'pentacles', or null
	value: integer('value').notNull(), // for sorting (0-21 Major, 1-14 Minor)
	keywords: jsonb('keywords').notNull(), // array of strings
	imageUrl: text('image_url'),
	meaningGeneral: text('meaning_general'),
	meaningLove: text('meaning_love'),
	meaningCareer: text('meaning_career'),
	meaningFinance: text('meaning_finance'),
	revGeneral: text('rev_general'),
	revLove: text('rev_love'),
	revCareer: text('rev_career'),
	revFinance: text('rev_finance')
});

export const readingHistory = pgTable('reading_history', {
	id: serial('id').primaryKey(),
	timestamp: text('timestamp').notNull(), // ISO string
	cards: jsonb('cards').notNull(), // array of selected card objects
	question: text('question'),
	aiSummary: text('ai_summary'),
	userId: text('user_id') // Optional: if we want to tie it to Better Auth later
});

export * from './auth.schema';
