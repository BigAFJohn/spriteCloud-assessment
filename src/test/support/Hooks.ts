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
// import Log from '../utils/Logger'; // You can comment this out or keep it, but we won't use it for these specific debug lines
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
  // If you want to keep the custom logger for other info, you can do: Log.testBegin(scenarioName);
  // Otherwise, just remove it or comment it out for now.

  // --- DEBUG LOGS (CHANGED TO console.log) ---
  console.log(`DEBUG_HOOKS: Before hook started for scenario: "${scenarioName}"`);
  console.log(`DEBUG_HOOKS: process.env.API_BASE_URL = '${process.env.API_BASE_URL}'`);
  console.log(`DEBUG_HOOKS: process.env.API_KEY = '${process.env.API_KEY}'`);
  console.log(`DEBUG_HOOKS: process.env.BASE_URL = '${process.env.BASE_URL}'`);
  console.log(`DEBUG_HOOKS: process.env.CI = '${process.env.CI}'`);
  // --- END DEBUG LOGS ---

  const apiBaseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  // --- TEMPORARILY COMMENT THIS BLOCK OUT (from previous step) ---
  // if (!apiBaseUrl) {
  //   throw new Error('Environment variable API_BASE_URL is not set. Please ensure your .env file is correctly configured or provide it via command line.');
  // }
  // --- END TEMPORARY COMMENT OUT ---

  const requestOptions: { baseURL: string; extraHTTPHeaders?: { [key: string]: string }; } = {
    baseURL: apiBaseUrl || '', // Provide an empty string fallback
  };

  if (apiKey) {
    requestOptions.extraHTTPHeaders = {
      'x-api-key': apiKey,
    };
  }

  this.apiContext = await request.newContext(requestOptions);
  this.apiBaseUrl = apiBaseUrl;
  // If you want to keep the custom logger for other info, you can do: Log.info(`API Context created with base URL: ${this.apiBaseUrl}`);

  const isUiTest = process.env.TEST_ENV === 'ui' || scenario.pickle.tags.some(t => t.name === '@ui-test');

  if (isUiTest) {
    // If you want to keep the custom logger for other info, you can do: Log.info('Launching a NEW browser instance and context for UI test...');

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

    // If you want to keep the custom logger for other info, you can do: Log.info('Browser context and page created for UI test.');

  } else {
    // If you want to keep the custom logger for other info, you can do: Log.info('Skipping browser context launch for API test.');
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
            // Log.info(`📸 Screenshot saved and attached: ${screenshotPath}`);
        } else {
            // Log.info(`Page already closed, skipping screenshot for "${scenarioName}".`);
        }
      } catch (e) {
        // Log.error(`Failed to take screenshot for scenario "${scenarioName}": ${e}`);
      }
    }

    if (process.env.RECORD_VIDEO === 'true') {
      const video = this.page.video();
      if (video) {
        try {
          fse.ensureDirSync(videoDir);
          const finalVideoPath = path.join(videoDir, `${scenarioName}.webm`);
          await video.saveAs(finalVideoPath);
          // Log.info(`🎥 Video saved: ${finalVideoPath}`);
        } catch (e) {
          // Log.error(`Failed to save video for scenario "${scenarioName}": ${e}`);
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
    // Log.info('API context disposed.');
  }

  // Log.testEnd(scenarioName, status);
});