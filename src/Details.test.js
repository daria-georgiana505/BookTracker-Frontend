const { chromium } = require('playwright');
const { test, expect, beforeAll, beforeEach, afterAll, afterEach } = require('@playwright/test');


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

test('should have the correct data on the details page', async () => {
  await page.click('text="DETAILS"');

  expect(page.url()).toBe('http://localhost:3000/details/Percy%20Jackson%20and%20The%20Lightning%20Thief');

  const titlePage = await page.textContent('header h2');

  expect(titlePage).toBe('Details');

  const titleText = await page.textContent('body p:nth-child(1)');
  const authorText = await page.textContent('body p:nth-child(2)');
  const genreText = await page.textContent('body p:nth-child(3)');
  const pagesText = await page.textContent('body p:nth-child(4)');

  const expectedTitle = 'Title: Percy Jackson and The Lightning Thief';
  const expectedAuthor = 'Author: Rick Riordan';
  const expectedGenre = 'Genre: Fantasy';
  const expectedPages = 'Number of Pages: 384';

  expect(titleText).toBe(expectedTitle);
  expect(authorText).toBe(expectedAuthor);
  expect(genreText).toBe(expectedGenre);
  expect(pagesText).toBe(expectedPages);
});