import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '@support/CustomWorld';
import { USERS, MASTER_PASSWORD, ERROR_MESSAGES } from '@data/TestData';

Given('the user access to Sauce Demo', async function (this: CustomWorld) {
 await this.page.goto('/');
});

Given('the user logs in with STANDARD_USER credentials', async function (this: CustomWorld) {
  const username = USERS.STANDARD_USER;
  await this.loginPage.loginUser(username, MASTER_PASSWORD);
});


When('the user logs in with {string} credentials', async function (this: CustomWorld, userType: string) {
  const key = userType.toUpperCase() as keyof typeof USERS;
  const username = USERS[key];
  await this.loginPage.loginUser(username, MASTER_PASSWORD);
});


When('the user attempts to log in with {string} credentials', async function (this: CustomWorld, userType: string) {
  const key = userType.toUpperCase() as keyof typeof USERS;
  const username = USERS[key];
  await this.loginPage.loginUser(username, MASTER_PASSWORD);
});


Then('{int} error icons and the error message for {string} should be displayed', async function (
  this: CustomWorld,
  iconCount: number,
  userType: string
) {
  const key = userType.toUpperCase();
  const expectedMessage = ERROR_MESSAGES[key];
  const errorIconCount = await this.loginPage.getErrorIconsCount();
  const errorMessage = await this.loginPage.getLoginErrorMessage();

  expect(errorIconCount).toBe(iconCount);
  expect(errorMessage).toContain(expectedMessage);
});
