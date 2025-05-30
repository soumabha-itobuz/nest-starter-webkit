import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { faker } from '@faker-js/faker';

describe('Post CRUD', () => {
    let driver: WebDriver;
    let interval: NodeJS.Timeout;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    beforeEach(() => {
        interval = setInterval(() => {}, 1000);
    });

    afterEach(() => {
        clearInterval(interval);
    });

    // afterAll(async () => {
    //     await driver.quit();
    // });

    it('should log in to the application', async () => {

        await driver.get('https://sass-starter-kit.wordpress-studio.io/login');
        await driver.sleep(3000);
        await driver.findElement(By.name('email')).sendKeys('callie65@itobuz.com');
        await driver.findElement(By.name('password')).sendKeys('Password123!');
        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.sleep(3000);
    }, 10000);

    it('should create a new post', async () => {
        await driver.wait(
            until.elementLocated(By.css('[title="User Avatar"]')),
            10000
        );
        await driver.get('https://sass-starter-kit.wordpress-studio.io/dashboard/me');
        await driver.sleep(3000);
        await driver.findElement(By.css('[data-testid="Post"]')).click();
        await driver.sleep(3000);
        await driver.findElement(By.css('[data-testid="Create Post"]')).click();

        // Text assertion for "Create Post" heading
        const heading = await driver.findElement(By.css('#root > div.App > div:nth-child(5) > div > main > div > h3'));
        const headingText = await heading.getText();
        expect(headingText).toContain('Add Post');

        await driver.findElement(By.css('[name="title"]')).click();
        await driver.findElement(By.css('[name="title"]')).sendKeys(faker.lorem.word());
    }, 30000); // <-- Set timeout to 30 seconds

});

