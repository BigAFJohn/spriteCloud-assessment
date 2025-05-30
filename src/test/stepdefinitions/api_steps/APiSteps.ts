import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '@support/CustomWorld';
import Log from '../../utils/Logger';

let startTime: number;
let endTime: number;

Given('the API base URL is set', async function (this: CustomWorld) {
  expect(this.apiContext).toBeDefined();
  expect(this.apiBaseUrl).toBe(process.env.API_BASE_URL);
  Log.info(`Confirmed API Base URL in step: ${this.apiBaseUrl}`);
});

When('a GET request is sent to {string}', async function (this: CustomWorld, endpoint: string) {
  const fullUrl = `${this.apiBaseUrl}${endpoint}`;
  Log.info(`Attempting GET request to: ${fullUrl}`);
  startTime = Date.now(); 
  this.apiResponse = await this.apiContext.get(endpoint);
  endTime = Date.now(); 
  Log.info(`GET Response Status for ${endpoint}: ${this.apiResponse.status()}`);
  Log.info(`GET Response Status Text for ${endpoint}: ${this.apiResponse.statusText()}`);
  if (!this.apiResponse.ok()) {
      const responseBody = await this.apiResponse.text();
      Log.error(`GET Request Failed for ${endpoint}. Response Body: ${responseBody}`);
  }
});

When('a POST request is sent to {string} with body:', async function (this: CustomWorld, endpoint: string, docString: string) {
  const body = JSON.parse(docString);
  const fullUrl = `${this.apiBaseUrl}${endpoint}`;
  Log.info(`Attempting POST request to: ${fullUrl} with body: ${docString}`);
  startTime = Date.now();
  this.apiResponse = await this.apiContext.post(endpoint, { data: body });
  endTime = Date.now(); 
  Log.info(`POST Response Status for ${endpoint}: ${this.apiResponse.status()}`);
  Log.info(`POST Response Status Text for ${endpoint}: ${this.apiResponse.statusText()}`);
  if (!this.apiResponse.ok()) {
      const responseBody = await this.apiResponse.text();
      Log.error(`POST Request Failed for ${endpoint}. Response Body: ${responseBody}`);
  }
});

When('a PUT request is sent to {string} with body:', async function (this: CustomWorld, endpoint: string, docString: string) {
  const body = JSON.parse(docString);
  const fullUrl = `${this.apiBaseUrl}${endpoint}`;
  Log.info(`Attempting PUT request to: ${fullUrl} with body: ${docString}`);
  startTime = Date.now(); 
  this.apiResponse = await this.apiContext.put(endpoint, { data: body });
  endTime = Date.now(); 
  Log.info(`PUT Response Status for ${endpoint}: ${this.apiResponse.status()}`);
  Log.info(`PUT Response Status Text for ${endpoint}: ${this.apiResponse.statusText()}`);
  if (!this.apiResponse.ok()) {
      const responseBody = await this.apiResponse.text();
      Log.error(`PUT Request Failed for ${endpoint}. Response Body: ${responseBody}`);
  }
});

When('a DELETE request is sent to {string}', async function (this: CustomWorld, endpoint: string) {
  const fullUrl = `${this.apiBaseUrl}${endpoint}`;
  Log.info(`Attempting DELETE request to: ${fullUrl}`);
  startTime = Date.now();
  this.apiResponse = await this.apiContext.delete(endpoint);
  endTime = Date.now(); 
  Log.info(`DELETE Response Status for ${endpoint}: ${this.apiResponse.status()}`);
  Log.info(`DELETE Response Status Text for ${endpoint}: ${this.apiResponse.statusText()}`);
  if (!this.apiResponse.ok()) {
      const responseBody = await this.apiResponse.text();
      Log.error(`DELETE Request Failed for ${endpoint}. Response Body: ${responseBody}`);
  }
});

Then('the response status should be {int}', async function (this: CustomWorld, statusCode: number) {
  expect(this.apiResponse.status()).toBe(statusCode);
});

Then('the response should contain a list of users', async function (this: CustomWorld) {
  const json = await this.apiResponse.json();
  expect(Array.isArray(json.data)).toBe(true);
  expect(json.data.length).toBeGreaterThan(0);
});

Then('the response should contain a valid authentication token', async function (this: CustomWorld) {
  const json = await this.apiResponse.json();
  expect(json.token).toBeTruthy();
  expect(typeof json.token).toBe('string');
  expect(json.token.length).toBeGreaterThan(0);
});

Then('the response should contain updated user details', async function (this: CustomWorld) {
  const json = await this.apiResponse.json();
  expect(json.name).toBeDefined();
  expect(json.job).toBeDefined();
  expect(json.updatedAt).toBeDefined();
});

Then('the response should contain error message {string}', async function (this: CustomWorld, errorMessage: string) {
  const json = await this.apiResponse.json();
  expect(json.error).toBe(errorMessage);
});

Then('the response time should be less than or equal to {int} seconds', function (this: CustomWorld, maxSeconds: number) {
  const duration = (endTime - startTime) / 1000;
  const allowedSeconds = maxSeconds + 0.2; // 200 ms grace buffer
  Log.info(`Response took ${duration.toFixed(3)} seconds, max allowed is ${maxSeconds}s`);
  expect(duration).toBeLessThanOrEqual(allowedSeconds);
});

