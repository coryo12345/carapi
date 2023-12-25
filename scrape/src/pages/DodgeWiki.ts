import { Locator, Page } from "playwright";
import { Vehicle } from "../models/vehicle";
import { logger } from "../utils/logger";
import { WikiPage } from "./WikiPage";
import { VehicleTableColumns, getVehiclesFromTable } from "./helpers";

const URL = "https://en.wikipedia.org/wiki/List_of_Dodge_vehicles";

const MAKE = "Dodge";

export class DodgeWikiPage implements WikiPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async scrape(): Promise<Vehicle[]> {
    logger.info(`Scraping wiki site for ${MAKE}`);

    await this.page.goto(URL);
    const content = this.page.locator("#mw-content-text");
    const tables = await content.locator("table.wikitable").all();

    const vehicles: Vehicle[] = [];

    for (let i = 0; i < tables.length; i++) {
      const table = tables.at(i) as Locator;
      if (i === 0) {
        vehicles.push(...(await this.getCurrentModels(table)));
      } else if (i <= 6) {
        vehicles.push(...(await this.getPastModels(table)));
      } else if (i <= 10) {
        vehicles.push(...(await this.getGlobalModels(table)));
      }
    }

    logger.info(
      `Finished scraping site for ${MAKE} - found ${vehicles.length} total vehicles`,
    );

    return vehicles;
  }

  private async getCurrentModels(table: Locator): Promise<Vehicle[]> {
    const columns: VehicleTableColumns = {
      bodyStyle: undefined,
      image: { cell: "td", order: 1 },
      model: { cell: "th", order: 0 },
      yearStart: { cell: "td", order: 2 },
      description: { cell: "td", order: 5 },
    };
    return getVehiclesFromTable(MAKE, table, columns);
  }

  private async getPastModels(table: Locator): Promise<Vehicle[]> {
    const columns: VehicleTableColumns = {
      bodyStyle: undefined,
      model: { cell: "td", order: 0 },
      yearStart: { cell: "td", order: 1 },
      yearEnd: { cell: "td", order: 2 },
      image: { cell: "td", order: 3 },
    };
    return getVehiclesFromTable(MAKE, table, columns);
  }

  private async getGlobalModels(table: Locator): Promise<Vehicle[]> {
    const columns: VehicleTableColumns = {
      bodyStyle: undefined,
      model: { cell: "td", order: 0 },
      region: { cell: "td", order: 1 },
      yearStart: { cell: "td", order: 2 },
      yearEnd: { cell: "td", order: 3 },
      image: { cell: "td", order: 4 },
    };
    return getVehiclesFromTable(MAKE, table, columns);
  }
}
