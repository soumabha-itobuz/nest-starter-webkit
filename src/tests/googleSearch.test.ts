import { config } from 'dotenv';
config();

// src/__tests__/googleSearch.test.ts
import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver';

describe('Google Search (TS + Jest)', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('should search for Selenium WebDriver', async () => {
    const baseUrl = process.env.GOOGLE_URL;
    if (!baseUrl) {
      throw new Error('GOOGLE_URL is not defined in the environment variables.');
    }
    console.log('Base URL:', baseUrl);
    await driver.get(baseUrl);
    
  });
});
