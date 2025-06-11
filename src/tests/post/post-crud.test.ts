import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { faker } from '@faker-js/faker';

describe('Post CRUD', () => {
    let driver: WebDriver;
    let interval: NodeJS.Timeout;
    let postTitle: string; // Store the generated post title
    const updatedPostTitle = faker.lorem.word();

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    beforeEach(() => {
        interval = setInterval(() => {}, 1000);
    });

    afterEach(() => {
        if (interval) {
            clearInterval(interval);
        }
    });

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
        const heading = await driver.findElement(By.css('div main div h3'));
        const headingText = await heading.getText();
        expect(headingText).toContain('Add Post');
        await driver.sleep(3000);
        postTitle = faker.lorem.word(); // Generate and store the post title
        await driver.findElement(By.css('[name="title"]')).sendKeys(postTitle);
        await driver.sleep(3000);
        const richTextArea = await driver.findElement(By.css('[title="Rich Text Area"]'));
        await richTextArea.click();
        await richTextArea.sendKeys(faker.lorem.paragraph());
        await driver.sleep(3000);
        const submitButtons = await driver.findElements(By.css('[type="submit"]'));
        await submitButtons[submitButtons.length - 1].click();
        await driver.sleep(4000);
    }, 50000); // <-- Set timeout to 30 seconds

    it('should check created post', async () => {
        await driver.get('https://sass-starter-kit.wordpress-studio.io/dashboard/post-management/list');
        await driver.sleep(3000);
        // Assertion for created post from the post list
        await driver.wait(
            until.elementLocated(By.css(`[title="${postTitle}"]`)),
            10000
        );
        const createdPost = await driver.findElement(By.css(`[title="${postTitle}"]`));
        expect(await createdPost.isDisplayed()).toBe(true);
    }, 50000);

    it('Search and edit the created post', async () => {
        const searchInput = await driver.findElement(By.css('[data-testid="search-role"]'));
        await searchInput.clear();
        await searchInput.sendKeys(postTitle);
        await driver.sleep(2000);
        const expandButtons = await driver.findElements(By.css('[aria-expanded="false"]'));
        const lastButton = expandButtons[expandButtons.length - 1];
        await driver.wait(until.elementIsVisible(lastButton), 5000);
        await lastButton.click();
        await driver.findElement(By.css('button:nth-child(3) div div')).click();
        await driver.sleep(3000);
        await driver.findElement(By.css('[name="title"]')).clear();
        // const updatedPostTitle = faker.lorem.word();
        await driver.findElement(By.css('[name="title"]')).sendKeys(updatedPostTitle);
        await driver.sleep(3000);
        const submitButtons = await driver.findElements(By.css('[type="submit"]'));
        await submitButtons[submitButtons.length - 1].click();
        await driver.sleep(5000);
        // await searchInput.clear();
        //page reload
        await driver.navigate().refresh();
        await driver.sleep(3000);
    }, 50000);

    it('should delete the last edited post', async () => {
        const searchInput = await driver.findElement(By.css('[data-testid="search-role"]'));
        await searchInput.clear();
        await searchInput.sendKeys(updatedPostTitle);
        await driver.sleep(4000);
        const expandButtons = await driver.findElements(By.css('[aria-expanded="false"]'));
        const lastButton = expandButtons[expandButtons.length - 1];
        await driver.wait(until.elementIsVisible(lastButton), 5000);
        await lastButton.click();
        await driver.findElement(By.css('button:nth-child(4) div div')).click();
        await driver.sleep(3000);
    }, 50000);

});

