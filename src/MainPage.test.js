const { chromium } = require('playwright');
const { test, expect, beforeAll, beforeEach, afterAll, afterEach } = require('@playwright/test');

let browser;
let page;

beforeAll(async () => {
  browser = await chromium.launch();
});

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

afterAll(async () => {
  await browser.close();
});

test('should have the correct data on the main page', async () => {
  await page.waitForLoadState('domcontentloaded');

  const titleText = await page.textContent('header h2');

  expect(titleText).toBe('Welcome to our page!');

  await page.click('text="See books"');

  expect(page.url()).toBe('http://localhost:3000/all');
});