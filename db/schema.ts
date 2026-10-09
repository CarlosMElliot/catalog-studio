import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const accounts=sqliteTable('accounts',{
 id:text('id').primaryKey(),email:text('email').notNull().unique(),name:text('name').notNull(),userId:text('user_id').unique(),plan:text('plan').notNull(),status:text('status').notNull(),quotaBytes:integer('quota_bytes').notNull(),monthlyPriceCents:integer('monthly_price_cents'),isOwner:integer('is_owner').notNull().default(0),createdAt:text('created_at').notNull()
});
export const media=sqliteTable('media',{
 id:text('id').primaryKey(),accountId:text('account_id').notNull().references(()=>accounts.id),bytes:integer('bytes').notNull(),mime:text('mime').notNull(),name:text('name').notNull(),state:text('state').notNull(),createdAt:text('created_at').notNull()
},t=>[index('media_account_idx').on(t.accountId)]);
