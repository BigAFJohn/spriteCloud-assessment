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
import Log from '../utils/Logger';
import dotenv from 'dotenv';

dotenv.config();

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
  Log.testBegin(scenarioName);

  // ----------------------
  // API Context Setup
  // ----------------------
  const apiBaseUrl = process.env.API_BASE_URL || 'https://reqres.in';
  if (!process.env.API_BASE_URL) {
    Log.warn(`Missing API_BASE_URL; falling back to ${apiBaseUrl}`);
  }
  const apiKey = process.env.API_KEY;
  const requestOptions: { baseURL: string; extraHTTPHeaders?: Record<string, string> } = { baseURL: apiBaseUrl };
  if (apiKey) {
    requestOptions.extraHTTPHeaders = { 'x-api-key': apiKey };
  }
  this.apiContext = await request.newContext(requestOptions);
  this.apiBaseUrl = apiBaseUrl;
  Log.info(`API Context created with base URL: ${this.apiBaseUrl}`);

  // ----------------------
  // UI Context Setup
  // ----------------------
  const isUiTest = testType === 'ui' || scenario.pickle.tags.some((t) => t.name === '@ui-test');
  if (isUiTest) {
    Log.info('Launching a NEW browser instance for UI test...');
    const uiBaseUrl = process.env.BASE_URL || 'https://www.saucedemo.com';
    if (!process.env.BASE_URL) {
      Log.warn(`Missing BASE_URL; falling back to ${uiBaseUrl}`);
    }
    const browserInstance: Browser = await chromium.launch();
    this.context = await browserInstance.newContext({
      baseURL: uiBaseUrl,
      recordVideo: process.env.RECORD_VIDEO === 'true' ? { dir: videoDir } : undefined,
    });
    this.page = await this.context.newPage();
    // page-specific helpers
    this.loginPage = new LoginPage(this.page);
    this.productListPage = new ProductListPage(this.page);
    this.checkoutInformationPage = new CheckoutInformationPage(this.page);
    this.checkoutConfirmationPage = new CheckoutConfirmationPage(this.page);
    this.checkoutCompletePage = new CheckoutCompletePage(this.page);
    this.cartPage = new CartPage(this.page);
    Log.info('Browser context and page created for UI test.');
  } else {
    Log.info('Skipping browser context launch for API test.');
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
          Log.info(`Screenshot saved: ${screenshotPath}`);
        }
      } catch (e) {
        Log.error(`Failed to take screenshot for ${scenarioName}: ${e}`);
      }
    }
    if (process.env.RECORD_VIDEO === 'true') {
      const video = this.page.video();
      if (video) {
        try {
          fse.ensureDirSync(videoDir);
          const finalVideoPath = path.join(videoDir, `${scenarioName}.webm`);
          await video.saveAs(finalVideoPath);
          Log.info(`Video saved: ${finalVideoPath}`);
        } catch (e) {
          Log.error(`Failed to save video for ${scenarioName}: ${e}`);
        }
      }
    }
    if (!this.page.isClosed()) await this.page.close();
    if (this.context) await this.context.close();
    await this.context?.browser()?.close();
  }
  if (this.apiContext) {
    await this.apiContext.dispose();
    Log.info('API context disposed.');
  }
  Log.testEnd(scenarioName, status);
});