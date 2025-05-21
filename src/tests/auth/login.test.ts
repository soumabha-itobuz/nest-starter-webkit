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

    // Wait for an element that indicates successful login (update selector as needed)
    const workspaceBtn = await driver.wait(
      until.elementLocated(By.xpath("//*[text()='Create Workspace']")),
      10000
    );
    expect(await workspaceBtn.getText()).toBe('Create Workspace');
  }, 30000);
});
