const { Builder, By, Key, until } = require('selenium-webdriver');

describe('Google Search', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });
  

  test('should search for Selenium WebDriver on Google', async () => {
    await driver.get('https://www.google.com');

  });
});
