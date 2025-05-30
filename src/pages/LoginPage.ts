import { Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class LoginPage extends BasePage {
  private usernameField: Locator;
  private passwordField: Locator;
  private loginButton: Locator;
  private errorIcons: Locator;
  private loginErrorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = page.locator('#user-name');
    this.passwordField = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorIcons = page.locator('.error_icon');
    this.loginErrorMessage = page.locator('.error-message-container');
  }

  async loginUser(username: string, password: string): Promise<void> {
    await this.type(this.usernameField, username, 'Username field');
    await this.type(this.passwordField, password, 'Password field');
    await this.click(this.loginButton, 'Login button');
  }

  async getErrorIconsCount(): Promise<number> {
    return this.errorIcons.count();
  }

  async getLoginErrorMessage(): Promise<string> {
    return await this.getText(this.loginErrorMessage);
  }
}
