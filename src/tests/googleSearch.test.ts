// src/__tests__/googleSearch.test.ts
import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver';

describe('Google Search (TS + Jest)', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });


  test('should search for Selenium WebDriver', async () => {
    await driver.get('https://www.google.com');

    
  });
});
