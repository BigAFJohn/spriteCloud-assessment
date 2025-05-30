import { Locator, Page } from '@playwright/test';
import BasePage from './BasePage';
import Log from '../test/utils/Logger'; 

export default class ProductListPage extends BasePage {
  private cartButton: Locator;
  private addToCartButtons: Locator;
  private productNames: Locator;
  private sortDropdown: Locator;
  private itemNames: Locator;

  constructor(page: Page) {
    super(page);
    this.cartButton = page.locator('#shopping_cart_container');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
    this.productNames = page.locator('.inventory_item_name');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.itemNames = page.locator('.inventory_item_name');
  }

  async addToCartRandomProducts(quantity: number): Promise<string[]> {
    await this.addToCartButtons.first().waitFor({ state: 'attached' }); 
    Log.info('Waited for at least one add-to-cart button to be attached.');

    const totalButtons = await this.addToCartButtons.count();
    Log.info(`Total add-to-cart buttons available: ${totalButtons}`);

    if (quantity > totalButtons) {
      throw new Error(`Requested quantity (${quantity}) exceeds available add-to-cart buttons (${totalButtons})`);
    }

    const selectedProductNames: string[] = [];
    const indices = [...Array(totalButtons).keys()]
      .sort(() => 0.5 - Math.random()) 
      .slice(0, quantity); 

    for (const i of indices) {
      const addToCartButton = this.addToCartButtons.nth(i);

      await this.assertElementIsVisible(addToCartButton, `Add to Cart button at index ${i}`);

      const productContainer = addToCartButton.locator('xpath=ancestor::div[contains(@class, "inventory_item")]');
      const name = await productContainer.locator('.inventory_item_name').innerText();

      await this.click(addToCartButton, `Add to Cart for "${name}"`);
      selectedProductNames.push(name);
    }

    Log.info(`Selected products added to cart: ${selectedProductNames.join(', ')}`);
    return selectedProductNames;
  }

  async clickCart(): Promise<void> {
    await this.click(this.cartButton, 'Cart icon');
  }

  async sortProductsByNameDescending() {
    Log.info('Sorting products by Name Z → A');
    await this.sortDropdown.selectOption('za');
  }

  async getSortedProductNames(): Promise<string[]> {
    await this.itemNames.first().waitFor({ state: 'attached' }); 

    const count = await this.itemNames.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push(await this.itemNames.nth(i).innerText());
    }
    return names;
  }
}