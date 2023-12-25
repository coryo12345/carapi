import { Locator, Page } from "playwright";
import { Vehicle } from "../models/vehicle";
import { logger } from "../utils/logger";
import { WikiPage } from "./WikiPage";
import { VehicleTableColumns, getVehiclesFromTable } from "./helpers";

const URL = "https://en.wikipedia.org/wiki/List_of_Mercedes-Benz_vehicles";

const MAKE = "Mercedes-Benz";

export class MercedesBenzWikiPage implements WikiPage {
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

    if (tables.at(0)) {
      vehicles.push(
        ...(await this.getPassengerVehicles(tables.at(0) as Locator)),
      );
    }

    if (tables.at(1)) {
      vehicles.push(
        ...(await this.getCommercialVehicles(tables.at(1) as Locator)),
      );
    }

    logger.info(
      `Finished scraping site for ${MAKE} - found ${vehicles.length} total vehicles`,
    );

    return vehicles;
  }

  private async getPassengerVehicles(table: Locator): Promise<Vehicle[]> {
    const columns: VehicleTableColumns = {
      bodyStyle: undefined,
      image: { cell: "td", order: 0 },
      model: { cell: "th", order: 0 },
      yearStart: { cell: "td", order: 1 },
      description: { cell: "td", order: 4 },
    };
    return getVehiclesFromTable(MAKE, table, columns);
  }

  private async getCommercialVehicles(table: Locator): Promise<Vehicle[]> {
    const columns: VehicleTableColumns = {
      bodyStyle: undefined,
      image: { cell: "td", order: 0 },
      model: { cell: "th", order: 0 },
      yearStart: { cell: "td", order: 1 },
      description: { cell: "td", order: 4 },
    };
    return getVehiclesFromTable(MAKE, table, columns);
  }
}
