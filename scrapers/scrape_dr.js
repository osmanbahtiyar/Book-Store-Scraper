const puppeteer = require('puppeteer'); // import the puppeteer module
let scrollToBottom = require('scroll-to-bottomjs');

const BASE_URL = 'https://www.dr.com.tr/';
const LIST_PAGE_URL =
    'https://www.dr.com.tr/kategori/Kitap/Edebiyat/grupno=00055';

scrapeEpisodeLinks = async () => {
    let browser = await puppeteer.launch({ headless: false }); //launch chromium
    let page = await browser.newPage(); //open new page
    await page.goto(LIST_PAGE_URL, { waitUntil: 'load', timeout: 0 }); //go to URL in this page, wait until load and no timeout

    await page.evaluate(scrollToBottom); //scroll all page bottom because of lazy images

    let data = await page.evaluate(() => {
        let titles = Array.from(
            document.querySelectorAll('h3[class="ellipsis"]')
        ).map((params) => {
            return params.innerText;
        });
        let prices = Array.from(
            document.querySelectorAll('span[class="price"]')
        ).map((params) => {
            return params.innerText;
        });
        let authors = Array.from(
            document.querySelectorAll('a[class="who"]')
        ).map((params) => {
            return params.innerText;
        });
        let publishers = Array.from(
            document.querySelectorAll('a[class="who mb10"]')
        ).map((params) => {
            return params.innerText;
        });
        let urls = Array.from(
            document.querySelectorAll('a[class="item-name"]')
        ).map((params) => {
            return params.getAttribute('href');
        });
        let image_src_s = Array.from(
            document.querySelectorAll('figure > img[class=" lazyloaded"]')
        ).map((params) => {
            return params.getAttribute('src');
        });

        return {
            titles,
            prices,
            authors,
            publishers,
            urls,
            image_src_s,
        };
    });

    console.log(data);

    await browser.close();
};

scrapeEpisodeLinks();
