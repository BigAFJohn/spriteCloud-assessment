import { Page, BrowserContext, APIRequestContext, APIResponse } from '@playwright/test';
import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import LoginPage from '@pages/LoginPage';
import ProductListPage from '@pages/ProductListPage';
import CheckoutInformationPage from '@pages/CheckoutInformationPage';
import CheckoutConfirmationPage from '@pages/CheckoutConfirmationPage';
import CheckoutCompletePage from '@pages/CheckoutCompletePage';
import CartPage from '@pages/CartPage';

class CustomWorld extends World {
  page!: Page;
  context!: BrowserContext;
  apiContext!: APIRequestContext;
  apiBaseUrl?: string;
  apiResponse!: APIResponse;

  loginPage!: LoginPage;
  productListPage!: ProductListPage;
  checkoutInformationPage!: CheckoutInformationPage;
  checkoutConfirmationPage!: CheckoutConfirmationPage;
  checkoutCompletePage!: CheckoutCompletePage;
  cartPage!: CartPage;

  userInfo?: { firstName: string; lastName: string; postalCode: string };
  selectedProductNames: string[] = [];

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
export { CustomWorld };
