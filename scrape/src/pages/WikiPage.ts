import { Page } from "playwright";
import { Vehicle } from "../models/vehicle";

export interface WikiPage {
  page: Page;
  scrape(): Promise<Vehicle[]>;
}
