import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '@support/CustomWorld';
import { expect } from '@playwright/test';

Then('check the products were added successfully to the cart', async function (this: CustomWorld) {
  const match = await this.cartPage.areSelectedProductsInCart(this.selectedProductNames);
  expect(match).toBeTruthy();
});

Given('the user click on checkout button', async function (this: CustomWorld) {
  await this.cartPage.clickCheckoutButton();
});
