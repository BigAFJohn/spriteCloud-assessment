import { When } from '@cucumber/cucumber';
import { CustomWorld } from '@support/CustomWorld';

When('the user add first {int} products to cart', async function (this: CustomWorld, count: number) {
  this.selectedProductNames = await this.productListPage.addToCartRandomProducts(count);
});

When('click on the cart icon', async function (this: CustomWorld) {
  await this.productListPage.clickCart();
});
