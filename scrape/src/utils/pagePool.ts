import { BrowserContext, Page } from "playwright";

export interface PagePool {
  getPage(): Promise<Page>;
  returnPage(page: Page): void;
}

export async function createPagePool(
  context: BrowserContext,
  size: number,
  options?: { timeout?: number },
): Promise<PagePool> {
  const pages: Page[] = [];

  for (let i = 0; i < size; i++) {
    pages.push(await context.newPage());
  }

  async function getPage(): ReturnType<PagePool["getPage"]> {
    return new Promise((res, rej) => {
      let cancel = false;
      setTimeout(
        () => {
          cancel = true;
          rej(new Error("maximum timeout exceed"));
        },
        options?.timeout ?? 30 * 1000,
      );

      const checkForPage = () => {
        if (pages.length === 0 && !cancel) {
          setTimeout(checkForPage, 50);
          return;
        }
        const page = pages.shift() as Page;
        res(page);
      };

      setTimeout(checkForPage, 0);
    });
  }

  function returnPage(page: Page) {
    pages.push(page);
  }

  return {
    getPage,
    returnPage,
  };
}
