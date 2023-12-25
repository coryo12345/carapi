import { Locator, Page } from "playwright";
import { Vehicle } from "../models/vehicle";
import { logger } from "../utils/logger";
import { WikiPage } from "./WikiPage";
import { VehicleTableColumns, getVehiclesFromTable } from "./helpers";

const URL = "https://en.wikipedia.org/wiki/List_of_Ford_vehicles";

const MAKE = "Ford";

export class FordWikiPage implements WikiPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async scrape(): Promise<Vehicle[]> {
    logger.info(`Scraping wiki site for ${MAKE}`);

    await this.page.goto(URL);
    const content = this.page.locator("#mw-content-text");
    const currentTable = await content.locator("table").first();

    const currentModels = await this.getCurrentModels(currentTable);

    const pastTables = await content.locator("table.wikitable").all();
    const pastModels: Vehicle[] = [];
    for (const table of pastTables) {
      const models = await this.getPastModels(table);
      pastModels.push(...models);
    }

    const vehicles: Vehicle[] = [...pastModels, ...currentModels];

    logger.info(
      `Finished scraping site for ${MAKE} - found ${vehicles.length} total vehicles`,
    );

    return vehicles;
  }

  private async getCurrentModels(table: Locator): Promise<Vehicle[]> {
    const columns: VehicleTableColumns = {
      bodyStyle: { cell: "th", order: 0 },
      image: { cell: "td", order: 0 },
      model: { cell: "th", order: 1 },
      yearStart: { cell: "td", order: 1 },
      region: { cell: "td", order: 4 },
      description: { cell: "td", order: 5 },
    };
    return getVehiclesFromTable(MAKE, table, columns);
  }

  private async getPastModels(table: Locator): Promise<Vehicle[]> {
    const columns: VehicleTableColumns = {
      bodyStyle: undefined,
      model: { cell: "td", order: 0 },
      region: { cell: "td", order: 1 },
      yearStart: { cell: "td", order: 2 },
      image: { cell: "td", order: 3 },
    };
    return getVehiclesFromTable(MAKE, table, columns);
  }
}
