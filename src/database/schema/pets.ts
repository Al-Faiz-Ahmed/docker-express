import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  petName: varchar("pet_name", { length: 50 }).notNull(),
  breed: varchar("breed", { length: 50 }),
});

export type Pets = typeof pets.$inferSelect;

// omits auto-generated fields like 'id' or 'createdAt'
export type NewPets = typeof pets.$inferInsert;
