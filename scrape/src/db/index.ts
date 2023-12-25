import { createClient } from "@libsql/client";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/libsql/migrator";
import { LibSQLDatabase, drizzle } from "drizzle-orm/libsql";
import { Vehicle } from "../models/vehicle";
import { logger } from "../utils/logger";
import { vehicles as vehiclesTable } from "./schema";

let database: LibSQLDatabase<Record<string, never>>;

export async function getDb() {
  if (!database) {
    const client = createClient({
      url: process.env["DB_URL"] ?? "",
      authToken: process.env["DB_TOKEN"] ?? "",
    });
    database = drizzle(client);

    await migrate(database, { migrationsFolder: "drizzle" });
  }

  return database;
}

export async function getVehicle(
  db: typeof database,
  make: string,
  model: string,
  bodyStyle: string,
  region: string,
): Promise<Vehicle | null> {
  try {
    const vehicles = (await db
      .select()
      .from(vehiclesTable)
      .where(
        sql`lower(${vehiclesTable.make}) = lower(${make}) and lower(${vehiclesTable.model}) = lower(${model}) and lower(${vehiclesTable.bodyStyle}) = lower(${bodyStyle}) and lower(${vehiclesTable.region}) = lower(${region})`,
      )) as Vehicle[];
    if (vehicles.length > 0) {
      const v = vehicles[0];
      delete (v as any).id;
      return v;
    }
  } catch (err) {
    logger.error("Error selecting row:", err);
  }
  return null;
}

/**
 * @returns number of rows that failed to update (inserted & updated)
 */
export async function upsertVehicles(
  db: typeof database,
  vehicles: Vehicle[],
): Promise<number> {
  let updatedErrorCount = 0;
  for (const vehicle of vehicles) {
    try {
      await db
        .insert(vehiclesTable)
        .values(vehicle)
        .onConflictDoUpdate({
          target: [
            vehiclesTable.make,
            vehiclesTable.model,
            vehiclesTable.bodyStyle,
            vehiclesTable.region,
          ],
          set: vehicle,
        });
    } catch (err) {
      logger.info("Error inserting row: ", vehicle, err);
      updatedErrorCount++;
    }
  }

  return updatedErrorCount;
}
