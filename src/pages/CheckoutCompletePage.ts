import { Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class CheckoutCompletePage extends BasePage {
  private greenCheck: Locator;
  private successfulHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.greenCheck = page.locator('.pony_express');
    this.successfulHeader = page.locator('.complete-header');
  }

  async isGreenCheckDisplayed(): Promise<boolean> {
    return await this.greenCheck.isVisible();
  }

  async getSuccessfulHeader(): Promise<string> {
    return await this.getText(this.successfulHeader);
  }
}
