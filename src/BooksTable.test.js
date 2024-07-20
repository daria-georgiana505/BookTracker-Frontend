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

test('should display the correct title of the page', async () => {
  const titleText = await page.textContent('header h2');

  expect(titleText).toBe('Bookstore');
});

test('should display the correct column names in the table', async () => {
  const titleColumnTable = await page.textContent('table thead tr th');

  expect(titleColumnTable).toBe('Title');

  const authorColumnTable = await page.textContent('table thead tr th:nth-child(2)');

  expect(authorColumnTable).toBe('Author');

  const genreColumnTable = await page.textContent('table thead tr th:nth-child(3)');

  expect(genreColumnTable).toBe('Genre');

  const nrPagesColumnTable = await page.textContent('table thead tr th:nth-child(4)');

  expect(nrPagesColumnTable).toBe('Number of pages');
});

test('should display the correct data in the table', async () => {
  const titleFirstRowTable = await page.textContent('table tbody tr:nth-child(1) td:nth-child(1)');

  expect(titleFirstRowTable).toBe("Percy Jackson and The Lightning Thief");

  const titleSecondRowTable = await page.textContent('table tbody tr:nth-child(2) td:nth-child(1)');

  expect(titleSecondRowTable).toBe("Harry Potter and the Philosopher's Stone");

  const titleRow3Table = await page.textContent('table tbody tr:nth-child(3) td:nth-child(1)');

  expect(titleRow3Table).toBe("The Fall Of The Roman Empire");

  const titleRow4Table = await page.textContent('table tbody tr:nth-child(4) td:nth-child(1)');

  expect(titleRow4Table).toBe("Figure Drawing without a Model");

  const titleRow5Table = await page.textContent('table tbody tr:nth-child(5) td:nth-child(1)');

  expect(titleRow5Table).toBe("The Power of Regret");

  const titleRow6Table = await page.textContent('table tbody tr:nth-child(6) td:nth-child(1)');

  expect(titleRow6Table).toBe("Haikyu!! - Volume 1");

  const titleRow7Table = await page.textContent('table tbody tr:nth-child(7) td:nth-child(1)');

  expect(titleRow7Table).toBe("Dune");

  const titleRow8Table = await page.textContent('table tbody tr:nth-child(8) td:nth-child(1)');

  expect(titleRow8Table).toBe("Demon Slayer: Kimetsu no Yaiba - Volume 1");

  const titleRow9Table = await page.textContent('table tbody tr:nth-child(9) td:nth-child(1)');

  expect(titleRow9Table).toBe("Secret Wars");

  const titleRow10Table = await page.textContent('table tbody tr:nth-child(10) td:nth-child(1)');

  expect(titleRow10Table).toBe("Miles Morales: Spider-man");

  await page.click('text="2"');

  const titleRow11Table = await page.textContent('table tbody tr:nth-child(1) td:nth-child(1)');

  expect(titleRow11Table).toBe("The Lost Hero");
});