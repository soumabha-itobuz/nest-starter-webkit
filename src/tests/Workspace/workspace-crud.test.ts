import { Builder, By, until, WebDriver } from 'selenium-webdriver';

describe('Workspace CRUD', () => {
  let driver: WebDriver;
  let testEmail: string;
  let testPassword: string;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

//   afterAll(async () => {
//     if (driver) {
//       // If browser is stuck on data:, navigate to about:blank before quitting
//       try {
//         const url = await driver.getCurrentUrl();
//         if (url.startsWith('data:')) {
//           await driver.get('about:blank');
//         }
//       } catch (e) {
//         // Ignore errors
//       }
//     //   await driver.quit();
//     }
//   });

  it('should log in and create a workspace', async () => {
    
  await driver.get('https://sass-starter-kit.wordpress-studio.io/login');
  await driver.sleep(3000);
  await driver.findElement(By.name('email')).sendKeys('callie65@itobuz.com');
  await driver.findElement(By.name('password')).sendKeys('Password123!');
  await driver.findElement(By.css('button[type="submit"]')).click();
  await driver.sleep(3000);
   }, 60000);

    it('should create a new workspace', async () => {
        // Wait for the user avatar element to be present and clickable
        await driver.wait(
          until.elementLocated(By.css('[title="User Avatar"]')),
          10000
        );
        await driver.get('https://sass-starter-kit.wordpress-studio.io/dashboard/me');
        await driver.sleep(3000);
        await driver.findElement(By.xpath('//*[@id="root"]/div[2]/div[2]/div/nav/div[1]/div/div/div/div/nav/a[3]')).click();
        await driver.sleep(3000);
        await driver.findElement(By.css("div.flex.items-center.justify-between > button > span > span")).click();
        await driver.findElement(By.css('[data-testid="name"]')).sendKeys('Test');
        const createButton = By.xpath("//span[contains(@class, 'm_811560b9') and contains(@class, 'mantine-Button-label') and text()='Create']");
        await driver.wait(until.elementLocated(createButton), 10000).click();
        await driver.sleep(1000);
        // Assertion for success message
        await driver.wait(until.elementLocated(By.css('[id="Workspace created successfully"]')), 10000);
        const successMsg = await driver.findElement(By.css('[id="Workspace created successfully"]'));
        // Print the text content for debugging
        const msgText = await successMsg.getText();
        console.log('Workspace creation message:', msgText);
        expect(msgText.toLowerCase()).toContain('workspace created');
        
        }, 30000); // <-- Set timeout to 30 seconds
});
