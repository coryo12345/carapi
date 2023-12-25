import { Locator, Page } from "playwright";
import { Vehicle, YearRange } from "../models/vehicle";
import { logger } from "../utils/logger";
import { WikiPage } from "./WikiPage";
import { VehicleTableColumns, getVehiclesFromTable } from "./helpers";

const URL = "https://en.wikipedia.org/wiki/List_of_Chevrolet_vehicles";

const MAKE = "Chevrolet";

export class ChevroletWikiPage implements WikiPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async scrape(): Promise<Vehicle[]> {
    logger.info(`Scraping wiki site for ${MAKE}`);

    await this.page.goto(URL);
    const content = this.page.locator("#mw-content-text");
    const tables = await content.locator("table").all();

    const currentModels = await this.getCurrentModels(tables[0]);
    const pastModels = await this.getPastModels(tables[1]);
    const globalModels = await this.getGlobalModels(tables[2]);

    // data further down the page is less descriptive,
    // so in case of conflicts we want the more detailed objects to come later
    // so DB updates use the more detailed rows
    const vehicles: Vehicle[] = [
      ...globalModels,
      ...pastModels,
      ...currentModels,
    ];

    logger.info(
      `Finished scraping site for ${MAKE} - found ${vehicles.length} total vehicles`,
    );

    return vehicles;
  }

  private async getCurrentModels(table: Locator): Promise<Vehicle[]> {
    const columns: VehicleTableColumns = {
      bodyStyle: { cell: "th", order: 0 },
      image: { cell: "td", order: 1 },
      model: { cell: "th", order: 1 },
      yearStart: { cell: "td", order: 2 },
      region: { cell: "td", order: 5 },
      description: { cell: "td", order: 6 },
    };
    return getVehiclesFromTable(MAKE, table, columns);
  }

  private async getPastModels(table: Locator): Promise<Vehicle[]> {
    const columns: VehicleTableColumns = {
      image: { cell: "td", order: 0 },
      model: { cell: "td", order: 1 },
      yearStart: { cell: "td", order: 2 },
      yearEnd: { cell: "td", order: 3 },
      description: { cell: "td", order: 6 },
    };
    return getVehiclesFromTable(MAKE, table, columns);
  }

  // need to do a custom description & custom year parsing so not using the common function
  private async getGlobalModels(table: Locator): Promise<Vehicle[]> {
    const vehicles: Vehicle[] = [];

    const rows = await table.locator("tbody").locator("tr").all();
    for (const row of rows) {
      const cells = await row.locator("td").all();
      if (cells.length <= 2) continue;

      const modelRaw = (await cells.at(0)?.textContent()) ?? "";
      const junk = /\[.*\]$/.exec(modelRaw);
      const model = modelRaw.substring(0, junk?.index);
      if (model === "") continue;

      const region =
        (
          await cells.at(1)?.locator("a").first().getAttribute("title")
        )?.trim() ?? "";

      const yearList = ((await cells.at(2)?.textContent()) ?? "").split("–");
      const years: YearRange = { start: yearList[0], end: yearList[1] };

      const originalModel = await cells.at(3)?.textContent();
      const description =
        originalModel && !originalModel.includes("–")
          ? "Original Model: " + originalModel
          : "";

      const imageSrc = await cells.at(4)?.locator("img").getAttribute("src");

      const image = imageSrc ? "https:" + imageSrc : null;

      vehicles.push({
        make: MAKE,
        model,
        years: [years],
        bodyStyle: "",
        region,
        description,
        image,
      });
    }

    return vehicles;
  }
}
