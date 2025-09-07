import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const example = pgTable('example', {
  id: serial('id').primaryKey(),
  label: text('label'),
  createdAt: timestamp('created_at').defaultNow()
});
