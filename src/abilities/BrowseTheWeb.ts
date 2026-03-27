import { Page } from '@playwright/test';

/**
 * BrowseTheWeb Ability
 * Grants an actor the ability to browse the web using Playwright
 */
export class BrowseTheWeb {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Get the current Playwright page instance
   */
  public getPage(): Page {
    return this.page;
  }

  /**
   * Navigate to a URL
   */
  public async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  /**
   * Get current URL
   */
  public getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get page title
   */
  public async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Close the page
   */
  public async close(): Promise<void> {
    await this.page.close();
  }
}
