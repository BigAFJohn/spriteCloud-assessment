import { Page, Locator, expect } from '@playwright/test';
import Log from '../test/utils/Logger'; 

export default class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async click(locator: Locator | string, description = ''): Promise<void> {
    const target = typeof locator === 'string' ? this.page.locator(locator) : locator;
    Log.info(`Clicking on ${description || 'element'}`);
    await target.click(); 
                          
  }

  async type(locator: Locator | string, value: string, description = ''): Promise<void> {
    const target = typeof locator === 'string' ? this.page.locator(locator) : locator;
    Log.info(`Typing "${value}" into ${description || 'input field'}`);
    await target.fill(value); 
  }

  async getText(locator: Locator | string): Promise<string> {
    const target = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await target.innerText();
  }

  async assertElementIsVisible(locator: Locator | string, description = ''): Promise<void> {
    const target = typeof locator === 'string' ? this.page.locator(locator) : locator;
    Log.info(`Asserting visibility of ${description || 'element'}`);
    await expect(target).toBeVisible(); 
  }

  async waitForNavigation(urlContains: string): Promise<void> {
    Log.info(`Waiting for navigation to contain "${urlContains}"`);
    await this.page.waitForURL(`**${urlContains}**`);
  }

  async waitForLocatorState(locator: Locator | string, state: 'attached' | 'detached' | 'visible' | 'hidden', description = ''): Promise<void> {
    const target = typeof locator === 'string' ? this.page.locator(locator) : locator;
    Log.info(`Waiting for ${description || 'element'} to be ${state}`);
    await target.waitFor({ state: state });
  }
}