import { Builder, By, until } from 'selenium-webdriver';

(async () => {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('https://www.google.com');
    const searchBox = await driver.findElement(By.name('q'));
    await searchBox.sendKeys('OpenAI');
    await searchBox.submit();
    await driver.wait(until.titleContains('OpenAI'), 5000);
    console.log('Page title is:', await driver.getTitle());
  } finally {
    await driver.quit();
  }
})();
