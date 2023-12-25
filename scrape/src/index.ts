import playwright from "playwright";
import { getDb, getVehicle, upsertVehicles } from "./db";
import { Vehicle } from "./models/vehicle";
import { getNextPage } from "./pages";
import { logger } from "./utils/logger";
import { createPagePool } from "./utils/pagePool";
import readline from "readline/promises";
import {
  NEW_VEHICLES_FILENAME,
  UPDATED_VEHICLES_FILENAME,
  saveNewVehiclesToCsv,
  saveUpdatedVehiclesToCsv,
} from "./utils/csvWriter";
import { Update } from "./models/update";
import "dotenv/config";

const DEBUG = false;

main();

async function main() {
  const browser = await playwright.chromium.launch({ headless: !DEBUG });
  const context = await browser.newContext();
  const pagePool = await createPagePool(context, 4);
  const db = await getDb();

  const allVehicles: Vehicle[] = [];
  const scrapePromises: Promise<Vehicle[]>[] = [];

  for await (const val of getNextPage(pagePool)) {
    const promise = val.scrape();
    scrapePromises.push(promise);
    promise.then((vehicles) => {
      pagePool.returnPage(val.page);
      allVehicles.push(...vehicles);
    });
  }

  await Promise.all(scrapePromises);

  logger.info("Comparing data with DB");
  // Goals - never delete rows
  // New rows (based on primary key) should just get inserted
  // Rows that match DB that have columns to update should be outputed to CSV
  // old_value, new_value, id, make, model, etc...

  const newVehicles: Vehicle[] = [];
  const updatedVehicles: Update<Vehicle>[] = [];

  for (const vehicle of allVehicles) {
    const dbVehicle = await getVehicle(
      db,
      vehicle.make,
      vehicle.model,
      vehicle.bodyStyle,
      vehicle.region ?? "",
    );

    if (dbVehicle === null) {
      newVehicles.push(vehicle);
      continue;
    }
    delete (dbVehicle as any).id;
    if (JSON.stringify(vehicle) === JSON.stringify(dbVehicle)) {
      continue;
    } else {
      updatedVehicles.push({ new: vehicle, old: dbVehicle });
    }
  }

  await saveNewVehiclesToCsv(newVehicles);
  logger.info(
    `Found ${newVehicles.length} vehicles to add to DB. Vehicles have been written to file: '${NEW_VEHICLES_FILENAME}'`,
  );

  await saveUpdatedVehiclesToCsv(updatedVehicles);
  logger.info(
    `Found ${updatedVehicles.length} vehicles with updates. Updates have been written to compare file: '${UPDATED_VEHICLES_FILENAME}'`,
  );

  logger.info("Awaiting confirmation before updating...");
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await confirmSaveNewVehicles(readlineInterface, newVehicles, db);
  await confirmSaveUpdatedVehicles(readlineInterface, updatedVehicles, db);

  if (!DEBUG) {
    await context.close();
    await browser.close();
  }
}

async function confirmSaveNewVehicles(
  readlineInterface: readline.Interface,
  newVehicles: Vehicle[],
  db: Awaited<ReturnType<typeof getDb>>,
) {
  const insertInput = await readlineInterface.question(
    `Confirm additions of ${newVehicles.length} new vehicles (Y/N)`,
  );

  if (insertInput.trim().toLowerCase() !== "y") {
    return;
  }

  const errCount = await upsertVehicles(db, newVehicles);
  if (errCount > 0) {
    logger.info(
      `Attempting to insert new vehicles - failed to insert ${errCount} rows`,
    );
  }
  logger.info("Completed adding new vehicles to DB");
}

async function confirmSaveUpdatedVehicles(
  readlineInterface: readline.Interface,
  updatedVehicles: Update<Vehicle>[],
  db: Awaited<ReturnType<typeof getDb>>,
) {
  const updateInput = await readlineInterface.question(
    `Confirm updates of ${updatedVehicles.length} vehicles (Y/N)`,
  );

  if (updateInput.trim().toLowerCase() !== "y") {
    return;
  }

  const vehicles = updatedVehicles.map((v) => v.new);

  const errCount = await upsertVehicles(db, vehicles);
  if (errCount > 0) {
    logger.info(
      `Attempting to update vehicles - failed to update ${errCount} rows`,
    );
  }
  logger.info("Completed adding vehicle updates to DB");
}
