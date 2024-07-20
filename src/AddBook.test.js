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

test('should add a book into the table', async () => {
  await page.click('text="ADD"');

  expect(page.url()).toBe('http://localhost:3000/add');

  const titleText = await page.textContent('header h2');

  expect(titleText).toBe('Add');

  await page.fill('input[placeholder="add title"]', 'New Book Title');
  await page.fill('input[placeholder="add author"]', 'New Book Author');
  await page.fill('input[placeholder="add genre"]', 'New Book Genre');
  await page.fill('input[placeholder="add number of pages"]', '200');

  await page.click('text="ADD"');

  expect(page.url()).toBe('http://localhost:3000/all');

  await page.click('text="2"');

  const titleNewRowTable = await page.textContent('table tbody tr:last-child td:nth-child(1)');

  expect(titleNewRowTable).toBe("New Book Title");

  const authorNewRowTable = await page.textContent('table tbody tr:last-child td:nth-child(2)');

  expect(authorNewRowTable).toBe("New Book Author");

  const genreNewRowTable = await page.textContent('table tbody tr:last-child td:nth-child(3)');

  expect(genreNewRowTable).toBe("New Book Genre");

  const nrPagesNewRowTable = await page.textContent('table tbody tr:last-child td:nth-child(4)');

  expect(nrPagesNewRowTable).toBe("200");
});