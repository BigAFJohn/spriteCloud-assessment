import { Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class CheckoutInformationPage extends BasePage {
  private firstNameField: Locator;
  private lastNameField: Locator;
  private postalCodeField: Locator;
  private continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameField = page.locator('#first-name');
    this.lastNameField = page.locator('#last-name');
    this.postalCodeField = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
  }

  async fillPersonalInformationForm(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.type(this.firstNameField, firstName, 'First Name');
    await this.type(this.lastNameField, lastName, 'Last Name');
    await this.type(this.postalCodeField, postalCode, 'Postal Code');
    await this.click(this.continueButton, 'Continue button');
  }
}
