import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

// SCHEMA for drizzle

export const vehicles = sqliteTable(
  "vehicles",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    make: text("make").notNull(),
    model: text("model").notNull(),
    years: text("years", { mode: "json" }).notNull(),
    bodyStyle: text("body_style").notNull(),
    region: text("region").notNull(),
    description: text("description").notNull(),
    image: text("image"),
  },
  (table) => ({
    unq: unique().on(table.make, table.model, table.bodyStyle, table.region),
  }),
);
