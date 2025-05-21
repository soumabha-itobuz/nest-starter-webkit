import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';

describe('Login Page', () => {
  let driver: WebDriver;
  let testEmail: string;
  let testPassword: string;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    // Read credentials from signup-cred.json for login
    const credPath = path.resolve(__dirname, 'signup-cred.json');
    if (!fs.existsSync(credPath)) {
      // Skip all tests if credentials file is missing
      // @ts-ignore
      pending('signup-cred.json not found, skipping login test');
      return;
    }
    const cred = JSON.parse(fs.readFileSync(credPath, 'utf-8'));
    testEmail = cred.email;
    testPassword = cred.password;
  });

  afterAll(async () => {
    await driver.quit();
  });

  it('should log in with last signup credentials', async () => {
    await driver.get('https://sass-starter-kit.wordpress-studio.io/login');
    await driver.sleep(3000);
    await driver.findElement(By.name('email')).sendKeys(testEmail);
    await driver.findElement(By.name('password')).sendKeys(testPassword);
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.sleep(3000);

    // Check for either "Create Workspace" (new user) or dashboard/home (existing user)
    let isNewUser = false;
    try {
      await driver.wait(
        until.elementLocated(By.xpath("//*[text()='Create Workspace']")),
        5000
      );
      isNewUser = true;
    } catch (e) {
      isNewUser = false;
    }

    if (isNewUser) {
      const workspaceBtn = await driver.findElement(By.xpath("//*[text()='Create Workspace']"));
      expect(await workspaceBtn.getText()).toBe('Create Workspace');
    } else {
      // Check for an element that only appears for logged-in users (update selector as needed)
      const dashboard = await driver.wait(
        until.elementLocated(By.css('[class="text-2xl font-bold text-blue-900"]')),
        10000
      );
      expect(await dashboard.isDisplayed()).toBe(true);
    }
  }, 30000);
});
