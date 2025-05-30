import { Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class CartPage extends BasePage {
  private productNames: Locator;
  private checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productNames = page.locator('.inventory_item_name');
    this.checkoutButton = page.locator('#checkout');
  }

  async areSelectedProductsInCart(selectedProductNames: string[]): Promise<boolean> {
    const nameCount = await this.productNames.count();
    if (nameCount !== selectedProductNames.length) return false;

    for (let i = 0; i < nameCount; i++) {
      const name = await this.productNames.nth(i).innerText();
      if (name !== selectedProductNames[i]) return false;
    }

    return true;
  }

  async clickCheckoutButton(): Promise<void> {
    await this.click(this.checkoutButton, 'Checkout Button');
  }
}
