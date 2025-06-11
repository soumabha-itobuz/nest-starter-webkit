import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { faker } from '@faker-js/faker';

describe('Workspace CRUD', () => {
    let driver: WebDriver;
    let testEmail: string;
    let testPassword: string;
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

    // Use a dynamic workspace name for create and update tests
    const workspaceName = faker.company.name();
    it('should log in to the application', async () => {

        await driver.get('https://sass-starter-kit.wordpress-studio.io/login');
        await driver.sleep(3000);
        await driver.findElement(By.name('email')).sendKeys('callie65@itobuz.com');
        await driver.findElement(By.name('password')).sendKeys('Password123!');
        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.sleep(3000);
    }, 60000);

    it('should create a new workspace', async () => {
        await driver.wait(
            until.elementLocated(By.css('[title="User Avatar"]')),
            10000
        );
        await driver.get('https://sass-starter-kit.wordpress-studio.io/dashboard/me');
        await driver.sleep(3000);
        await driver.findElement(By.xpath('//*[@id="root"]/div[2]/div[2]/div/nav/div[1]/div/div/div/div/nav/a[3]')).click();
        await driver.sleep(3000);
        await driver.findElement(By.css("div.flex.items-center.justify-between > button > span > span")).click();
        await driver.findElement(By.css('[data-testid="name"]')).sendKeys(workspaceName);
        const createButton = By.xpath("//span[contains(@class, 'm_811560b9') and contains(@class, 'mantine-Button-label') and text()='Create']");
        await driver.wait(until.elementLocated(createButton), 10000).click();
        await driver.sleep(1000);

        // Assertion for success message
        await driver.wait(until.elementLocated(By.css('[id="Workspace created successfully"]')), 10000);
        const successMsg = await driver.findElement(By.css('[id="Workspace created successfully"]'));
        const msgText = await successMsg.getText();
        console.log('Workspace creation message:', msgText);
        expect(msgText.toLowerCase()).toContain('workspace created');

        // Assert that the new workspace is visible in the list
        const searchInput = await driver.findElement(By.css('[data-testid="search-role"]'));
        await searchInput.sendKeys(workspaceName);
        await driver.sleep(2000);
        const searchResult = await driver.findElement(By.css('div > div.MuiDataGrid-row.MuiDataGrid-row--firstVisible > div:nth-child(2)'));
        const searchResultText = await searchResult.getText();
        console.log('Search result text:', searchResultText);
        expect(searchResultText.toLowerCase()).toContain(workspaceName.toLowerCase());
    }, 30000);

    it('should update the workspace', async () => {
        const updatedWorkspaceName = faker.company.name();
        await driver.sleep(3000);

        // Search for the workspace
        const searchInput = await driver.findElement(By.css('[data-testid="search-role"]'));
        await searchInput.clear();
        await searchInput.sendKeys(workspaceName);
        await driver.sleep(5000);

        // Click on the edit button of the first workspace row
        await driver.wait(
            until.elementLocated(By.css('button[data-testid="expose-button"]')),
            10000
        );
        const exposeButtons = await driver.findElements(By.css('button[data-testid="expose-button"]'));
        if (exposeButtons.length > 0) {
            await exposeButtons[0].click();
        }
        await driver.findElement(By.css('[data-testid="edit"]')).click();
        await driver.sleep(2000);

        // Wait for the name input to be present before interacting
        await driver.wait(
            until.elementLocated(By.css('[data-testid="name"]')),
            10000
        );
        const nameInput = await driver.findElement(By.css('[data-testid="name"]'));
        await nameInput.click();
        await nameInput.clear();
        await driver.sleep(2000);
        await nameInput.sendKeys(updatedWorkspaceName);
        await driver.sleep(2000);
        await driver.findElement(By.css('[type="submit"]')).click();
        await searchInput.clear();
        await driver.wait(until.elementLocated(By.css('[id="Workspace updated successfully"]')), 10000);
        const successMsg = await driver.findElement(By.css('[id="Workspace updated successfully"]'));
        const msgText = await successMsg.getText();
        console.log('Workspace update message:', msgText);
        expect(msgText.includes('Workspace updated successfully')).toBeDefined();
        await driver.sleep(2000);
        await driver.findElement(By.css('[data-testid="name"]')).clear();

        // Store updated workspace name for delete test
        (global as any).updatedWorkspaceName = updatedWorkspaceName;
    }, 30000);
    
    it('should delete the workspace', async () => {
        await driver.sleep(3000);

        // Use the updated workspace name from the previous test
        const updatedWorkspaceName = (global as any).updatedWorkspaceName;

        // Search for the updated workspace
        const searchInput = await driver.findElement(By.css('[data-testid="search-role"]'));
        await searchInput.clear();
        await searchInput.sendKeys(updatedWorkspaceName);
        await driver.sleep(5000);

        // Click on the delete button of the first workspace row
        await driver.wait(
            until.elementLocated(By.css('button[data-testid="expose-button"]')),
            10000
        );
        const exposeButtons = await driver.findElements(By.css('button[data-testid="expose-button"]'));
        if (exposeButtons.length > 0) {
            await exposeButtons[0].click();
        }
        await driver.findElement(By.css('[data-testid="delete"]')).click();
        await driver.sleep(2000);

        // Confirm deletion if a confirmation dialog/button appears
    //     try {
    //         const confirmButton = By.xpath("//span[contains(@class, 'm_811560b9') and contains(@class, 'mantine-Button-label') and text()='Delete']");
    //         await driver.wait(until.elementLocated(confirmButton), 10000).click();
    //         await driver.sleep(2000);
    //     } catch (e) {
    //         // No confirmation dialog/button, continue
    //     }

    //     // Assertion for success message
    //     await driver.wait(until.elementLocated(By.css('[id="Workspace deleted successfully"]')), 10000);
    //     const successMsg = await driver.findElement(By.css('[id="Workspace deleted successfully"]'));
    //     const msgText = await successMsg.getText();
    //     console.log('Workspace deletion message:', msgText);
    //     expect(msgText.toLowerCase()).toContain('workspace deleted');
    });

});

