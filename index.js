const { default: puppeteer } = require('puppeteer');
const { writeFile } = require('fs/promises');
const { load } = require('cheerio');

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      height: 1080,
      width: 1920,
    },
  });
  const page = await browser.newPage();
  await page.goto('https://www.amazon.in');
  await page.type('#twotabsearchtextbox', 'cap'); 
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);

  const searchResults = [];
  const $ = load(await page.content());

  $('.s-result-item').each((_, element) => {
    const productCard = $(element);
    const title = productCard.find('.a-text-normal').text().trim();
    const price = productCard.find('.a-price .a-offscreen').text().trim();
    const imageLink = productCard.find('img.s-image').attr('src');

    searchResults.push({
      title,
      price,
      imageLink,
    });
  });

  const jsonData = JSON.stringify(searchResults, null, 2);
  await writeFile('capResults.json', jsonData);
  await browser.close();
};

main();