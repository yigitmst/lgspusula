import {index,integer,sqliteTable,text} from 'drizzle-orm/sqlite-core';
export const tracker=sqliteTable('tracker',{id:text('id').primaryKey(),ownerId:text('owner_id').notNull(),data:text('data').notNull(),revision:integer('revision').notNull().default(0)});
export const messages=sqliteTable('messages',{id:text('id').primaryKey(),studentId:text('student_id').notNull(),senderRole:text('sender_role').notNull(),body:text('body').notNull(),createdAt:text('created_at').notNull(),readByTeacher:integer('read_by_teacher').notNull().default(0),readByStudent:integer('read_by_student').notNull().default(0)},table=>[index('messages_student_created_idx').on(table.studentId,table.createdAt,table.id)]);

export const demoSessions=sqliteTable('demo_sessions',{tokenHash:text('token_hash').primaryKey(),visitorId:text('visitor_id').notNull(),expiresAt:integer('expires_at').notNull()},table=>[index('demo_sessions_expiry_idx').on(table.expiresAt)]);
