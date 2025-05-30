import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, request } from '@playwright/test';
import { CustomWorld } from '@support/CustomWorld';
import LoginPage from '@pages/LoginPage';
import ProductListPage from '@pages/ProductListPage';
import CheckoutInformationPage from '@pages/CheckoutInformationPage';
import CheckoutConfirmationPage from '@pages/CheckoutConfirmationPage';
import CheckoutCompletePage from '@pages/CheckoutCompletePage';
import CartPage from '@pages/CartPage';
import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
// import Log from '../utils/Logger'; // Keep this commented if not explicitly used for console output
import dotenv from 'dotenv';

dotenv.config({
  path: process.env.CI ? './.env.ci' : (process.env.TEST_ENV ? `.env.${process.env.TEST_ENV}` : '.env'),
  override: !!process.env.TEST_ENV,
});

// ====================================================================
// GLOBAL CONFIGURATION
// ====================================================================

setDefaultTimeout(30 * 1000);

const testType = process.env.TEST_ENV || 'ui';
const screenshotDir = `test-results/${testType}/screenshots`;
const videoDir = `test-results/${testType}/videos`;

// ====================================================================
// BEFORE EACH SCENARIO HOOK
// ====================================================================

Before(async function (this: CustomWorld, scenario) {
  const scenarioName = scenario.pickle.name;
  console.log(`DEBUG_HOOKS: Before hook started for scenario: "${scenarioName}"`);
  console.log(`DEBUG_HOOKS: process.env.API_BASE_URL = '${process.env.API_BASE_URL}'`);
  console.log(`DEBUG_HOOKS: process.env.API_KEY = '${process.env.API_KEY}'`);
  console.log(`DEBUG_HOOKS: process.env.BASE_URL = '${process.env.BASE_URL}'`);
  console.log(`DEBUG_HOOKS: process.env.CI = '${process.env.CI}'`);

  const apiBaseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  console.log(`DEBUG_HOOKS: apiBaseUrl variable (from process.env): '${apiBaseUrl}' (Type: ${typeof apiBaseUrl})`); // Check value immediately after assignment
  console.log(`DEBUG_HOOKS: apiKey variable (from process.env): '${apiKey}' (Type: ${typeof apiKey})`);

  // Re-enable the strict check, as it should now pass with the .env.ci file
  if (!apiBaseUrl) {
    console.error(`DEBUG_HOOKS: CRITICAL ERROR: apiBaseUrl is still not set or is empty ('${apiBaseUrl}'). This should not happen after .env.ci.`);
    throw new Error(`Environment variable API_BASE_URL is not set or is empty.`);
  }

  const requestOptions: { baseURL: string; extraHTTPHeaders?: { [key: string]: string }; } = {
    baseURL: apiBaseUrl, // Now this should be a string, as the check above ensures it's not undefined/empty
  };

  if (apiKey) {
    requestOptions.extraHTTPHeaders = {
      'x-api-key': apiKey,
    };
  }

  console.log(`DEBUG_HOOKS: Attempting to create API context with requestOptions.baseURL: '${requestOptions.baseURL}'`);
  try {
    this.apiContext = await request.newContext(requestOptions);
    this.apiBaseUrl = apiBaseUrl;
    console.log(`DEBUG_HOOKS: API Context created successfully with base URL: ${this.apiBaseUrl}`);
   console.log(`DEBUG_HOOKS: this.apiBaseUrl (CustomWorld property) after API Context creation: ${this.apiBaseUrl}`);// Check what Playwright set
  } catch (e: any) { // Use 'any' for the catch type for broader error handling
    console.error(`DEBUG_HOOKS: ERROR creating API context: ${e.message || e}`);
    throw e; // Re-throw to fail the step with the specific error from Playwright
  }

  const isUiTest = process.env.TEST_ENV === 'ui' || scenario.pickle.tags.some(t => t.name === '@ui-test');

  if (isUiTest) {
    console.log('DEBUG_HOOKS: Launching a NEW browser instance and context for UI test...');

    const uiBaseUrl = process.env.BASE_URL;
    if (!uiBaseUrl) {
      throw new Error('Environment variable BASE_URL is not set for UI tests. Please ensure your .env file is correctly configured or provide it via command line.');
    }

    const browserInstance: Browser = await chromium.launch();

    this.context = await browserInstance.newContext({
      baseURL: uiBaseUrl,
      recordVideo: process.env.RECORD_VIDEO === 'true' ? { dir: videoDir } : undefined,

    });

    this.page = await this.context.newPage();

    this.loginPage = new LoginPage(this.page);
    this.productListPage = new ProductListPage(this.page);
    this.checkoutInformationPage = new CheckoutInformationPage(this.page);
    this.checkoutConfirmationPage = new CheckoutConfirmationPage(this.page);
    this.checkoutCompletePage = new CheckoutCompletePage(this.page);
    this.cartPage = new CartPage(this.page);

    console.log('DEBUG_HOOKS: Browser context and page created for UI test.');

  } else {
    console.log('DEBUG_HOOKS: Skipping browser context launch for API test.');
  }
});

// ====================================================================
// AFTER EACH SCENARIO HOOK
// ====================================================================

After(async function (this: CustomWorld, scenario) {
  const scenarioName = scenario.pickle.name.replace(/\s+/g, '_').toLowerCase();
  const status = scenario.result?.status || 'UNKNOWN';
  const isFailed = status !== 'PASSED';

  if (this.page) {
    if (isFailed) {
      fse.ensureDirSync(screenshotDir);
      const screenshotPath = path.join(screenshotDir, `${scenarioName}.png`);
      try {
        if (!this.page.isClosed()) {
            await this.page.screenshot({ path: screenshotPath });
            this.attach(fs.readFileSync(screenshotPath), 'image/png');
            console.log(`DEBUG_HOOKS: 📸 Screenshot saved and attached: ${screenshotPath}`);
        } else {
            console.log(`DEBUG_HOOKS: Page already closed, skipping screenshot for "${scenarioName}".`);
        }
      } catch (e) {
        console.error(`DEBUG_HOOKS: Failed to take screenshot for scenario "${scenarioName}": ${e}`);
      }
    }

    if (process.env.RECORD_VIDEO === 'true') {
      const video = this.page.video();
      if (video) {
        try {
          fse.ensureDirSync(videoDir);
          const finalVideoPath = path.join(videoDir, `${scenarioName}.webm`);
          await video.saveAs(finalVideoPath);
          console.log(`DEBUG_HOOKS: 🎥 Video saved: ${finalVideoPath}`);
        } catch (e) {
          console.error(`DEBUG_HOOKS: Failed to save video for scenario "${scenarioName}": ${e}`);
        }
      }
    }

    if (!this.page.isClosed()) {
      await this.page.close();
    }

    if (this.context) {
      await this.context.close();
    }

    await this.context?.browser()?.close();
  }

  if (this.apiContext) {
    await this.apiContext.dispose();
    console.log('DEBUG_HOOKS: API context disposed.');
  }

  console.log(`DEBUG_HOOKS: Test end for scenario: "${scenarioName}" with status: ${status}`);
});