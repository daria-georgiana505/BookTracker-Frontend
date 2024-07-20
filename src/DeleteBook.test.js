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

test('should display the correct data in the table after deleting a book', async () => {
  await page.click('text="DELETE"');
  await page.click('text="Yes"');

  const titleRow1Table = await page.textContent('table tbody tr:nth-child(1) td:nth-child(1)');

  expect(titleRow1Table).toBe("Harry Potter and the Philosopher's Stone");

  const titleRow2Table = await page.textContent('table tbody tr:nth-child(2) td:nth-child(1)');

  expect(titleRow2Table).toBe("The Fall Of The Roman Empire");

  const titleRow3Table = await page.textContent('table tbody tr:nth-child(3) td:nth-child(1)');

  expect(titleRow3Table).toBe("Figure Drawing without a Model");

  const titleRow4Table = await page.textContent('table tbody tr:nth-child(4) td:nth-child(1)');

  expect(titleRow4Table).toBe("The Power of Regret");

  const titleRow5Table = await page.textContent('table tbody tr:nth-child(5) td:nth-child(1)');

  expect(titleRow5Table).toBe("Haikyu!! - Volume 1");

  const titleRow6Table = await page.textContent('table tbody tr:nth-child(6) td:nth-child(1)');

  expect(titleRow6Table).toBe("Dune");

  const titleRow7Table = await page.textContent('table tbody tr:nth-child(7) td:nth-child(1)');

  expect(titleRow7Table).toBe("Demon Slayer: Kimetsu no Yaiba - Volume 1");

  const titleRow8Table = await page.textContent('table tbody tr:nth-child(8) td:nth-child(1)');

  expect(titleRow8Table).toBe("Secret Wars");

  const titleRow9Table = await page.textContent('table tbody tr:nth-child(9) td:nth-child(1)');

  expect(titleRow9Table).toBe("Miles Morales: Spider-man");

  const titleRow10Table = await page.textContent('table tbody tr:nth-child(10) td:nth-child(1)');

  expect(titleRow10Table).toBe("The Lost Hero");
});

test('should display the correct data in the table after clicking "no" when you try to delete a book', async () => {
    await page.click('text="DELETE"');
    await page.click('text="No"');
  
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