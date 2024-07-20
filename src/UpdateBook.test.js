const { chromium } = require('playwright');
const { test, expect, beforeAll, beforeEach, afterAll, afterEach, goto, waitForLoadState, textContent, toBe, getByText, toBeInTheDocument} = require('@playwright/test');

let browser;
let page;

beforeAll(async () => {
  browser = await chromium.launch();
});

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto('http://localhost:3000/all');
});

afterEach(async () => {
  await page.close();
});

afterAll(async () => {
  await browser.close();
});

test('should update the first book in the table', async () => {
  await page.click('text="UPDATE"');

  expect(page.url()).toBe('http://localhost:3000/update/Percy%20Jackson%20and%20The%20Lightning%20Thief');

  const titleText = await page.textContent('header h2');

  expect(titleText).toBe('Update');

  await page.fill('input[value="Percy Jackson and The Lightning Thief"]', 'TLT');
  await page.fill('input[value="Rick Riordan"]', 'R. Riordan');
  await page.fill('input[value="384"]', '400');

  await page.click('text="UPDATE"');

  expect(page.url()).toBe('http://localhost:3000/all');

  const titleUpdatedRowTable = await page.textContent('table tbody tr:first-child td:nth-child(1)');

  expect(titleUpdatedRowTable).toBe("TLT");

  const authorUpdatedRowTable = await page.textContent('table tbody tr:first-child td:nth-child(2)');

  expect(authorUpdatedRowTable).toBe("R. Riordan");

  const nrPagesUpdatedRowTable = await page.textContent('table tbody tr:first-child td:nth-child(4)');

  expect(nrPagesUpdatedRowTable).toBe("400");
});