import { WebDriver, By } from 'selenium-webdriver';

export async function login(driver: WebDriver, email: string, password: string) {
  await driver.get('https://sass-starter-kit.wordpress-studio.io/login');
  await driver.sleep(3000);
  await driver.findElement(By.name('email')).sendKeys(email);
  await driver.findElement(By.name('password')).sendKeys(password);
  await driver.findElement(By.css('button[type="submit"]')).click();
  await driver.sleep(3000);
}
