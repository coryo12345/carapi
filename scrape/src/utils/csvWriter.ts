import path from "path";
import fs from "fs/promises";
import fs2 from "fs";
import { Vehicle } from "../models/vehicle";
import { Update } from "../models/update";

export const NEW_VEHICLES_FILENAME = "data/newVehicles.csv";
export const UPDATED_VEHICLES_FILENAME = "data/updatedVehicles.csv";

export async function saveNewVehiclesToCsv(vehicles: Vehicle[]) {
  const columns: { key: string; value: string }[] = [
    { key: "make", value: "Make" },
    { key: "model", value: "Model" },
    { key: "years", value: "Years" },
    { key: "bodyStyle", value: "Body Style" },
    { key: "region", value: "Region" },
    { key: "description", value: "Description" },
    { key: "image", value: "Image URL" },
  ];
  const data: string[] = [columns.map((col) => `"${col.value}"`).join(",")];

  vehicles.forEach((vehicle) => {
    const row: string[] = [];
    Object.keys(vehicle).forEach((key) => {
      const val = vehicle[key as keyof Vehicle];
      if (typeof val === "string") {
        row.push('"' + val + '"');
      } else if (typeof val === "number" || typeof val === "boolean") {
        row.push('"' + (val as number | boolean).toString() + '"');
      } else if (val === undefined || val === null) {
        row.push('""');
      } else {
        row.push('"' + JSON.stringify(val).replaceAll('"', "'") + '"');
      }
    });
    data.push(row.join(","));
  });

  const filename = path.join(__dirname, "..", "..", NEW_VEHICLES_FILENAME);
  createDir();
  await fs.writeFile(filename, data.join("\n"));
}

export async function saveUpdatedVehiclesToCsv(vehicles: Update<Vehicle>[]) {
  const headerColumns: { key: string; value: string }[] = [
    { key: "make", value: "Make" },
    { key: "model", value: "Model" },
    { key: "bodyStyle", value: "Body Style" },
    { key: "region", value: "Region" },
    { key: "", value: "Column Changed" },
    { key: "", value: "Old Value" },
    { key: "", value: "New Value" },
  ];

  const compareColumns: (keyof Vehicle)[] = ["years", "description", "image"];

  const data: string[] = [
    headerColumns.map((col) => `"${col.value}"`).join(","),
  ];

  vehicles.forEach((update) => {
    const row: string[] = [
      `"${update.old.make}"`,
      `"${update.old.model}"`,
      `"${update.old.bodyStyle}"`,
      `"${update.old.region}"`,
    ];
    compareColumns.forEach((value) => {
      if (
        JSON.stringify(update.old[value]) !== JSON.stringify(update.new[value])
      ) {
        row.push(`"${value}"`);
        if (typeof update.old[value] === "string") {
          row.push(`"${update.old[value]}"`);
          row.push(`"${update.new[value]}"`);
        } else if (
          typeof update.old[value] === "boolean" ||
          typeof update.old[value] === "number"
        ) {
          row.push(`"${update.old[value]?.toString()}"`);
          row.push(`"${update.new[value]?.toString()}"`);
        } else {
          row.push(
            `"${JSON.stringify(update.old[value]).replaceAll('"', "'")}"`,
          );
          row.push(
            `"${JSON.stringify(update.new[value]).replaceAll('"', "'")}"`,
          );
        }
      }
    });
    data.push(row.join(","));
  });

  const filename = path.join(__dirname, "..", "..", UPDATED_VEHICLES_FILENAME);
  createDir();
  await fs.writeFile(filename, data.join("\n"));
}

function createDir() {
  // make sure data/ folder exists
  const dir = path.join(__dirname, "../../data");
  if (!fs2.existsSync(dir)) {
    fs2.mkdirSync(dir, { recursive: true });
  }
}
