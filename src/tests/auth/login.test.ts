import { Builder, By, until, WebDriver } from 'selenium-webdriver';

describe('Login Page', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  it('should log in with valid credentials', async () => {
    await driver.get('https://sass-starter-kit.wordpress-studio.io/');
    await driver.findElement(By.className('.m_811560b9.mantine-Button-label')).click();
    // Enter username
    await driver.findElement(By.name('username')).sendKeys('testuser');
    // Enter password
    await driver.findElement(By.name('password')).sendKeys('password123');
    // Submit the form
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Wait for successful login indicator (e.g., dashboard or logout button)
    await driver.wait(until.elementLocated(By.id('dashboard')), 5000);

    const dashboard = await driver.findElement(By.id('dashboard'));
    expect(await dashboard.isDisplayed()).toBe(true);
  });
});
