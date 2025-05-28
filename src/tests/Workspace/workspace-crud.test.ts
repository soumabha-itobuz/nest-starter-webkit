import { Builder, By, until, WebDriver } from 'selenium-webdriver';

describe('Workspace CRUD', () => {
    let driver: WebDriver;
    let testEmail: string;
    let testPassword: string;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    //   afterAll(async () => {
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
        await driver.wait(
            until.elementLocated(By.css('[title="User Avatar"]')),
            10000
        );
        await driver.get('https://sass-starter-kit.wordpress-studio.io/dashboard/me');
        await driver.sleep(3000);
        await driver.findElement(By.xpath('//*[@id="root"]/div[2]/div[2]/div/nav/div[1]/div/div/div/div/nav/a[3]')).click();
        await driver.sleep(3000);
        await driver.findElement(By.css("div.flex.items-center.justify-between > button > span > span")).click();
        await driver.findElement(By.css('[data-testid="name"]')).sendKeys('test');
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
        await searchInput.sendKeys('test');
        await driver.sleep(2000);
        const searchResult = await driver.findElement(By.css('div > div.MuiDataGrid-row.MuiDataGrid-row--firstVisible > div:nth-child(2)'));
        const searchResultText = await searchResult.getText();
        console.log('Search result text:', searchResultText);
        expect(searchResultText.toLowerCase()).toContain('test');
    }, 30000);

    it('should update the workspace', async () => {
        const workspaceName = 'test';
        const updatedWorkspaceName = 'updated-test';
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
        await driver.findElement(By.css('[data-testid="name"]')).clear();
        await driver.findElement(By.css('[data-testid="name"]')).sendKeys(updatedWorkspaceName);
        await driver.sleep(2000);
        await driver.findElement(By.css('[type="submit"]')).click();

        await driver.wait(until.elementLocated(By.css('[id="Workspace updated successfully"]')), 10000);
        const successMsg = await driver.findElement(By.css('[id="Workspace updated successfully"]'));
        const msgText = await successMsg.getText();
        expect(msgText.toLowerCase()).toContain('Workspace updated successfully');
        await driver.findElement(By.css('[data-testid="name"]')).clear();
    });
    
    // it('should delete the workspace', async () => {

    // });

});

