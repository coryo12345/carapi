import { PagePool } from "../utils/pagePool";
import { AudiWikiPage } from "./AudiWiki";
import { BmwWikiPage } from "./BmwWiki";
import { ChevroletWikiPage } from "./ChevroletWiki";
import { DodgeWikiPage } from "./DodgeWiki";
import { FordWikiPage } from "./FordWiki";
import { HondaWikiPage } from "./HondaWiki";
import { MercedesBenzWikiPage } from "./MercedesBenzWiki";
import { NissanWikiPage } from "./NissanWiki";
import { ToyotaWikiPage } from "./ToyotaWiki";
import { VolkswagenWikiPage } from "./VolkswagenWiki";
import { WikiPage } from "./WikiPage";

export async function* getNextPage(pool: PagePool): AsyncGenerator<WikiPage> {
  yield new Promise<WikiPage>(async (res, rej) => {
    try {
      const page = await pool.getPage();
      res(new ChevroletWikiPage(page));
    } catch (err) {
      rej(err);
    }
  });

  yield new Promise<WikiPage>(async (res, rej) => {
    try {
      const page = await pool.getPage();
      res(new FordWikiPage(page));
    } catch (err) {
      rej(err);
    }
  });

  yield new Promise<WikiPage>(async (res, rej) => {
    try {
      const page = await pool.getPage();
      res(new VolkswagenWikiPage(page));
    } catch (err) {
      rej(err);
    }
  });

  yield new Promise<WikiPage>(async (res, rej) => {
    try {
      const page = await pool.getPage();
      res(new AudiWikiPage(page));
    } catch (err) {
      rej(err);
    }
  });

  yield new Promise<WikiPage>(async (res, rej) => {
    try {
      const page = await pool.getPage();
      res(new MercedesBenzWikiPage(page));
    } catch (err) {
      rej(err);
    }
  });

  yield new Promise<WikiPage>(async (res, rej) => {
    try {
      const page = await pool.getPage();
      res(new DodgeWikiPage(page));
    } catch (err) {
      rej(err);
    }
  });

  yield new Promise<WikiPage>(async (res, rej) => {
    try {
      const page = await pool.getPage();
      res(new BmwWikiPage(page));
    } catch (err) {
      rej(err);
    }
  });

  yield new Promise<WikiPage>(async (res, rej) => {
    try {
      const page = await pool.getPage();
      res(new HondaWikiPage(page));
    } catch (err) {
      rej(err);
    }
  });

  yield new Promise<WikiPage>(async (res, rej) => {
    try {
      const page = await pool.getPage();
      res(new NissanWikiPage(page));
    } catch (err) {
      rej(err);
    }
  });

  yield new Promise<WikiPage>(async (res, rej) => {
    try {
      const page = await pool.getPage();
      res(new ToyotaWikiPage(page));
    } catch (err) {
      rej(err);
    }
  });
}
