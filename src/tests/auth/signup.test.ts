import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

describe('Signup Page', () => {
  let driver: WebDriver;
  const testEmail = `${faker.internet.username().toLowerCase()}@itobuz.com`;
  const testPassword = 'Password123!';

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('should sign up a new user and confirm via MailHog', async () => {
    await driver.get('https://sass-starter-kit.wordpress-studio.io/login'); // Update URL as needed
    await driver.sleep(5000); 
    const signupBtn = await driver.findElement(By.className('ml-2'));
    await signupBtn.click();
    //pause for 1 second to allow the signup button to be clickable
    await driver.sleep(5000);
    await driver.findElement(By.name('email')).sendKeys(testEmail);
    await driver.findElement(By.name('password')).sendKeys(testPassword);
    const registerBtn = await driver.findElement(By.css('.m_811560b9.mantine-Button-label'));
    await registerBtn.click();
    // await driver.findElement(By.css('m_811560b9 mantine-Button-label')).click();
    await driver.sleep(5000);

    // Open MailHog web UI and fetch confirmation link
    await driver.get('https://mailhog.x-studio.io/#');
    // Wait for the email list to load
    await driver.wait(until.elementLocated(By.css('.msglist-message')), 10000);

    // Ignore Chrome modal/popups if present when opening MailHog inbox
    try {
      // Try to switch to any alert and accept it
      await driver.switchTo().alert().accept();
      await driver.sleep(500);
    } catch (e) {
      // No alert present, continue
    }

    // Find the email sent to testEmail
    const messages = await driver.findElements(By.css('.msglist-message'));
    await driver.sleep(3000);
    for (const message of messages) {
      const subject = await message.getText();
      if (subject.includes(testEmail)) {
        await message.click();
        // Wait for the message content to load
        await driver.sleep(1000);
        // If a modal appears, close it
        try {
          const modalCloseBtn = await driver.findElement(By.css('.modal-close, .close, .modal .close-button'));
          await modalCloseBtn.click();
          await driver.sleep(500);
        } catch (e) {
          // Modal not present, continue
        }
        // Switch to the iframe containing the email body if present
        try {
          const iframe = await driver.findElement(By.css('iframe'));
          await driver.switchTo().frame(iframe);
          // Wait for the confirm button inside the iframe
          const confirmBtn = await driver.wait(
            until.elementLocated(By.id('[class="button"]')),
            5000
          );
          await confirmBtn.click();
          // Switch back to default content
          await driver.switchTo().defaultContent();
        } catch (e) {
          // If no iframe, try to find the button in the main document
          try {
            const confirmBtn = await driver.findElement(By.id('[class="button"]'));
            await confirmBtn.click();
          } catch (e2) {
            // Button not found, continue
          }
        }
        break;
      }
    }
    
    // Save credentials for reuse in login test
    const credPath = path.resolve(__dirname, 'signup-cred.json');
    fs.writeFileSync(credPath, JSON.stringify({ email: testEmail, password: testPassword }, null, 2));
  }, 60000);
});
