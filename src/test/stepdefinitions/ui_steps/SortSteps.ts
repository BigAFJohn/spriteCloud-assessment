import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '@support/CustomWorld';

When('the user selects sorting option {string}', async function (this: CustomWorld, option: string) {
  if (option === 'Name (Z to A)') {
    await this.productListPage.sortProductsByNameDescending();
  } else {
    throw new Error(`Sorting option "${option}" not implemented`);
  }
});

Then('the products should be sorted in descending alphabetical order', async function (this: CustomWorld) {
  const actualNames = await this.productListPage.getSortedProductNames();
  const expected = [...actualNames].sort((a, b) => b.localeCompare(a));
  expect(actualNames).toEqual(expected);
});
