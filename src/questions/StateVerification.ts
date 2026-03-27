import { Actor } from '../actors/Actor';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

/**
 * Question: Is element visible?
 */
export const isElementVisible = (selector: string) => ({
  answeredBy: async (actor: Actor): Promise<boolean> => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    try {
      await page.waitForSelector(selector, { timeout: 3000 });
      return await page.isVisible(selector);
    } catch {
      return false;
    }
  },
});

/**
 * Question: Is element enabled?
 */
export const isElementEnabled = (selector: string) => ({
  answeredBy: async (actor: Actor): Promise<boolean> => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    try {
      return await page.isEnabled(selector);
    } catch {
      return false;
    }
  },
});

/**
 * Question: Does element exist?
 */
export const elementExists = (selector: string) => ({
  answeredBy: async (actor: Actor): Promise<boolean> => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    const count = await page.locator(selector).count();
    return count > 0;
  },
});

/**
 * Question: Get element text
 */
export const elementText = (selector: string) => ({
  answeredBy: async (actor: Actor): Promise<string | null> => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    try {
      return await page.textContent(selector);
    } catch {
      return null;
    }
  },
});

/**
 * Question: Get element count
 */
export const elementCount = (selector: string) => ({
  answeredBy: async (actor: Actor): Promise<number> => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    return await page.locator(selector).count();
  },
});

/**
 * Question: Get attribute value
 */
export const attributeValue = (selector: string, attribute: string) => ({
  answeredBy: async (actor: Actor): Promise<string | null> => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    try {
      return await page.getAttribute(selector, attribute);
    } catch {
      return null;
    }
  },
});

/**
 * Question: Get all attribute values for elements matching a selector
 */
export const allAttributeValues = (selector: string, attribute: string) => ({
  answeredBy: async (actor: Actor): Promise<string[]> => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    const locator = page.locator(selector);
    const count = await locator.count();
    const values: string[] = [];

    for (let i = 0; i < count; i++) {
      const value = await locator.nth(i).getAttribute(attribute);
      if (value) {
        values.push(value);
      }
    }

    return values;
  },
});

/**
 * Question: Get current URL
 */
export const currentUrl = () => ({
  answeredBy: async (actor: Actor): Promise<string> => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    return page.url();
  },
});

/**
 * Question: Get page title
 */
export const pageTitle = () => ({
  answeredBy: async (actor: Actor): Promise<string> => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    return await page.title();
  },
});

/**
 * Question: Get all text content from selector
 */
export const allElementsText = (selector: string) => ({
  answeredBy: async (actor: Actor): Promise<string[]> => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    return await page.locator(selector).allTextContents();
  },
});
