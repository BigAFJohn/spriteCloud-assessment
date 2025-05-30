import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '@support/CustomWorld';
import { CHECKOUT_COMPLETE_URL, SUCCESS_HEADER_TEXT } from '@data/TestData';



Then('the purchase was completed with a success message and green check', async function (this: CustomWorld) {
  const currentUrl = this.page.url();
  const successHeader = await this.checkoutCompletePage.getSuccessfulHeader();

  expect(currentUrl).toContain(CHECKOUT_COMPLETE_URL);
  expect(successHeader).toBe(SUCCESS_HEADER_TEXT);
  expect(await this.checkoutCompletePage.isGreenCheckDisplayed()).toBe(true);
});
