import { Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class CheckoutConfirmationPage extends BasePage {
  private finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.finishButton = page.locator('#finish');
  }

  async clickFinishButton(): Promise<void> {
    await this.click(this.finishButton, 'Finish button');
  }
}
