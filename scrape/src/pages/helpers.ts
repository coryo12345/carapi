import { Locator } from "playwright";
import { Vehicle, YearRange } from "../models/vehicle";

// value is column index in table
// positions should assume all cells/headers are present. the func will adjust as necessary
export interface ColumnDef {
  cell: "th" | "td";
  order: number;
}
export interface VehicleTableColumns {
  bodyStyle?: ColumnDef | null;
  image?: ColumnDef;
  model: ColumnDef;
  yearStart?: ColumnDef;
  yearEnd?: ColumnDef;
  region?: ColumnDef;
  description?: ColumnDef;
}

// if columns.bodyStyle is undefined, assume the tables has separate header rows for body style
// otherwise, treat it as a header
export async function getVehiclesFromTable(
  make: string,
  table: Locator,
  columns: VehicleTableColumns,
): Promise<Vehicle[]> {
  const vehicles: Vehicle[] = [];
  let bodyStyle: string = "";
  let bodyStyleRowSpan: number = 0;

  const rows = await table.locator("tbody").locator("tr").all();
  for (const row of rows) {
    const headers = await row.locator("th").all();
    const cells = await row.locator("td").all();

    const locatorIndices: Record<
      Exclude<keyof VehicleTableColumns, "bodyStyle">,
      number | undefined
    > = {
      image: columns.image?.order,
      model: columns.model?.order,
      yearStart: columns.yearStart?.order,
      yearEnd: columns.yearEnd?.order,
      region: columns.region?.order,
      description: columns.description?.order,
    };

    // if bodyStyle is a row
    if (
      columns.bodyStyle === undefined &&
      headers.length <= 1 &&
      cells.length <= 1
    ) {
      if (headers.length > 0) {
        bodyStyle = (await headers.at(0)?.textContent())?.trim() ?? "";
      } else if (cells.length > 0) {
        bodyStyle = (await cells.at(0)?.textContent())?.trim() ?? "";
      } else {
        continue;
      }
    }

    // if bodyStyle is a column
    if (columns.bodyStyle) {
      // we need to look for a new bodyStyle cell
      if (bodyStyleRowSpan <= 0) {
        const bodyStyleLocator =
          columns.bodyStyle.cell === "td"
            ? cells.at(columns.bodyStyle.order)
            : headers.at(columns.bodyStyle.order);

        bodyStyle = (await bodyStyleLocator?.textContent())?.trim() ?? "";
        bodyStyleRowSpan = parseInt(
          (await bodyStyleLocator?.getAttribute("rowspan"))?.trim() ?? "1",
        );
        if (isNaN(bodyStyleRowSpan)) bodyStyleRowSpan = 1;
      } else {
        // there won't be a bodyStyle column in this row, need to adjust every other column with the same type
        for (const _key in columns) {
          const key = _key as keyof typeof columns;
          if (key === "bodyStyle") continue;
          if (
            columns[key]?.cell === columns.bodyStyle.cell &&
            locatorIndices[key] !== undefined
          ) {
            locatorIndices[key] = (locatorIndices[key] as number) - 1;
          }
        }
      }
      bodyStyleRowSpan--;
    }

    // model
    if (locatorIndices.model === undefined) continue;
    let model: string | undefined;
    const modelLocator =
      columns.model.cell === "td"
        ? cells.at(locatorIndices.model)
        : headers.at(locatorIndices.model);
    const linkTags = await modelLocator?.locator("a").all();
    if (linkTags && linkTags.length > 0) {
      model = (await linkTags?.at(0)?.textContent())?.trim() ?? "";
    } else {
      continue;
    }
    if (!model) continue;

    // years
    const yearList: YearRange[] = [];
    let years: YearRange = { start: "", end: "" };
    if (columns.yearStart) {
      const locator =
        columns.yearStart.cell === "td"
          ? cells.at(columns.yearStart.order)
          : headers.at(columns.yearStart.order);
      let startYear = (await locator?.textContent()) ?? "";

      // check if the column contains both start & end
      const ranges = [...startYear.matchAll(/[\d]{4}\–[\d]{4}/g)];
      if (ranges.length) {
        ranges.forEach((range) => {
          const [s, e] = range[0].split("–");
          yearList.push({ start: s, end: e });
        });
      } else {
        startYear = /^\d*/.exec(startYear)![0] ?? "";
        years.start = startYear;
      }
    }
    if (columns.yearEnd) {
      const locator =
        columns.yearEnd.cell === "td"
          ? cells.at(columns.yearEnd.order)
          : headers.at(columns.yearEnd.order);
      let endYear = (await locator?.textContent()) ?? "";
      endYear = /^\d*/.exec(endYear)![0] ?? "";
      years.end = endYear;
    }
    if (years.start.length || years.end.length) {
      years.start = years.start.length ? years.start : "-";
      years.end = years.end.length ? years.end : "Present";
      yearList.push(years);
    }

    // region
    let region = "";
    if (columns.region) {
      const regionLocator =
        columns.region.cell === "td"
          ? cells.at(columns.region.order)
          : headers.at(columns.region.order);
      region = (await regionLocator?.textContent())?.trim() ?? "";
    }

    // description
    let description = "";
    if (columns.description) {
      const descriptionLocator =
        columns.description.cell === "td"
          ? cells.at(columns.description.order)
          : headers.at(columns.description.order);
      description = (await descriptionLocator?.textContent())?.trim() ?? "";
    }

    // image
    let image: string | null = null;
    if (columns.image) {
      const imageLocator =
        columns.image.cell === "td"
          ? await cells.at(columns.image.order)?.locator("img").all()
          : await headers.at(columns.image.order)?.locator("img").all();
      if (imageLocator && imageLocator.length > 0) {
        const imageSrc = (await imageLocator[0].getAttribute("src"))?.trim();
        image = imageSrc ? "https:" + imageSrc : image;
      }
    }

    vehicles.push({
      make,
      model,
      years: yearList,
      bodyStyle,
      region,
      description,
      image,
    });
  }

  return vehicles;
}
