import { Actor } from '../actors/Actor';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

/**
 * Action: Open a page path
 */
export const openPage = (path: string) => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    await page.goto(path, { waitUntil: 'networkidle' });
    return actor;
  },
});

/**
 * Action: Click on an element
 */
export const click = (selector: string) => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    await page.click(selector);
    return actor;
  },
});

/**
 * Action: Fill in a form field
 */
export const fill = (selector: string, value: string) => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    await page.fill(selector, value);
    return actor;
  },
});

/**
 * Action: Type text character by character
 */
export const type = (selector: string, text: string) => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    await page.locator(selector).type(text);
    return actor;
  },
});

/**
 * Action: Press a key
 */
export const press = (selector: string, key: string) => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    await page.locator(selector).press(key);
    return actor;
  },
});

/**
 * Action: Hover over an element
 */
export const hoverOver = (selector: string) => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    await page.hover(selector);
    return actor;
  },
});

/**
 * Action: Wait for element to be visible
 */
export const waitForElement = (selector: string, timeout: number = 5000) => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    await page.waitForSelector(selector, { timeout });
    return actor;
  },
});

/**
 * Action: Scroll to element
 */
export const scrollToElement = (selector: string) => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    const element = await page.$(selector);
    if (element) {
      await element.scrollIntoViewIfNeeded();
    }
    return actor;
  },
});

/**
 * Action: Get text content
 */
export const getText = (selector: string) => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    return await page.textContent(selector);
  },
});

/**
 * Action: Get attribute value
 */
export const getAttribute = (selector: string, attribute: string) => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    return await page.getAttribute(selector, attribute);
  },
});

/**
 * Action: Select option from dropdown
 */
export const selectOption = (selector: string, value: string) => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    await page.selectOption(selector, value);
    return actor;
  },
});

/**
 * Action: Wait until the browser reaches a path
 */
export const waitForUrl = (path: string) => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    await page.waitForURL(`**${path}`);
    return actor;
  },
});
