const puppeteer = require('puppeteer');

const admin = require('firebase-admin');

const serviceAccount = require('./book-store-scrapper-54473-firebase-adminsdk-s3fpo-e73033ea8b.json');

let scrollToBottom = require('scroll-to-bottomjs');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

db.settings({ ignoreUndefinedProperties: true });

const scrapWebsites = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    var i = 0;
    var j = 0;

    const myObjects = [];

    //Fetching data from kitapyurdu, because of our free database limitations we have decided to fetch only 100 pages from there

    for (i = 1; i < 100; i++) {
        await page.goto(
            `https://www.kitapyurdu.com/index.php?route=product/category&filter_category_all=true&path=1&filter_in_stock=1&sort=purchased_365&order=DESC&limit=100&page=${i}`,
            { waitUntil: 'load', timeout: 0 }
        );

        const names = await page.evaluate(() =>
            Array.from(document.querySelectorAll('div.cover> a >img ')).map(
                (photo) => photo.alt
            )
        );

        const prices = await page.evaluate(() =>
            Array.from(
                document.querySelectorAll('div.price-new> span.value ')
            ).map((price) => price.innerText.trim())
        );

        const imgSrc = await page.evaluate(() =>
            Array.from(document.querySelectorAll('div.cover> a >img ')).map(
                (photo) => photo.src
            )
        );

        const myBook = await page.evaluate(() =>
            Array.from(document.querySelectorAll('div.cover> a ')).map(
                (book) => book.href
            )
        );

        const publishers = await page.evaluate(() =>
            Array.from(
                document.querySelectorAll('div.publisher > span > a.alt > span')
            ).map((publisher) => publisher.innerText)
        );

        const authors = await page.evaluate(() =>
            Array.from(
                document.querySelectorAll('div.author > span > a.alt > span')
            ).map((author) => author.innerText)
        );

        const website = 'kitapyurdu';

        //there are 100 books on a page, this is a standard
        for (j = 0; j < 100; j++) {
            const myName = names[j].split('/')[0];
            const myPrice = prices[j];
            const myImg = imgSrc[j];
            const bookPage = myBook[j];
            const bookAuthor = authors[j];
            const bookPublisher = publishers[j];
            const temp_search = myName.replace(/\s/g, '');
            const search = temp_search.toLowerCase();

            const myObj = {
                search_param: search,
                book_name: myName,
                book_price: myPrice,
                book_image: myImg,
                book_page: bookPage,
                book_website: website,
                book_author: bookAuthor,
                book_publisher: bookPublisher,
            };
            if (typeof myName !== 'undefined') {
                try {
                    const res = await db
                        .collection(website)
                        .doc(myName)
                        .set(myObj)
                        .catch((err) => {
                            console.log('error occurred');
                        });
                    myObjects.push(myObj);
                } catch (e) {
                    console.log('Exception occurred');
                }
            }
        }

        console.log('Kitapyurdu Page ' + i + ' completed.');
    }

    //Fetching data from d&r.

    for (i = 1; i < 71; i++) {
        await page.goto(
            `https://www.dr.com.tr/CokSatanlar/Kitap#/page=${i}/sort=groups.group.displayorder,asc/categoryid=0/clog=4020/parentId=0/price=-1,-1`,
            { waitUntil: 'load', timeout: 0 }
        );

        await page.evaluate(scrollToBottom);

        const names = await page.evaluate(() =>
            Array.from(
                document.querySelectorAll('div.content > a.item-name ')
            ).map((name) => name.title)
        );

        const prices = await page.evaluate(() =>
            Array.from(
                document.querySelectorAll('div.content > span.price ')
            ).map((price) => price.innerText.split(' ')[0])
        );

        const imgSrc = await page.evaluate(() =>
            Array.from(document.querySelectorAll('figure > img ')).map(
                (photo) => photo.src
            )
        );

        const myBook = await page.evaluate(() =>
            Array.from(
                document.querySelectorAll('div.content > a.item-name ')
            ).map((book) => book.href)
        );

        const publishers = await page.evaluate(() =>
            Array.from(document.querySelectorAll('a.who.mb10')).map(
                (publisher) => publisher.innerText
            )
        );

        const authors = await page.evaluate(() =>
            Array.from(document.querySelectorAll('a.who')).map(
                (author) => author.innerText
            )
        );

        const website = 'dr';

        //there are 42 books on each page.
        for (j = 0; j < 42; j++) {
            const myName = names[j].split('/')[0];
            const myPrice = prices[j];
            const myImg = imgSrc[j];
            const bookPage = myBook[j];
            const bookAuthor = authors[j];
            const bookPublisher = publishers[j];
            const temp_search = myName.replace(/\s/g, '');
            const search = temp_search.toLowerCase();
            const myObj = {
                search_param: search,
                book_name: myName,
                book_price: myPrice,
                book_image: myImg,
                book_page: bookPage,
                book_website: website,
                book_author: bookAuthor,
                book_publisher: bookPublisher,
            };
            if (typeof myName !== 'undefined') {
                try {
                    const res = await db
                        .collection(website)
                        .doc(myName)
                        .set(myObj)
                        .catch((err) => {
                            console.log('error occurred');
                        });
                    myObjects.push(myObj);
                } catch (e) {
                    console.log('Exception occurred');
                }
            }
        }

        console.log('Dr Page ' + i + ' completed.');
    }

    //Fetching data from idefix
    for (i = 1; i < 83; i++) {
        await page.goto(
            `https://www.idefix.com/CokSatanlar/Kitap#/page=${i}/sort=groups.group.displayorder,asc/categoryid=0/clog=3569/parentId=0/price=-1,-1`,
            { waitUntil: 'load', timeout: 0 }
        );

        await page.evaluate(scrollToBottom);

        const names = await page.evaluate(() =>
            Array.from(document.querySelectorAll('div.image-area > img ')).map(
                (name) => name.alt
            )
        );

        const prices = await page.evaluate(() =>
            Array.from(
                document.querySelectorAll('div.box-line-4 > span.price ')
            ).map((price) => price.innerText.split(' ')[0])
        );

        const imgSrc = await page.evaluate(() =>
            Array.from(document.querySelectorAll('div.image-area > img ')).map(
                (photo) => photo.src
            )
        );

        const myBook = await page.evaluate(() =>
            Array.from(
                document.querySelectorAll('div.cart-product-box-view > a ')
            ).map((book) => book.href)
        );

        const publishers = await page.evaluate(() =>
            Array.from(document.querySelectorAll('a.who2.alternate')).map(
                (publisher) => publisher.innerText
            )
        );

        const authors = await page.evaluate(() =>
            Array.from(document.querySelectorAll('a.who')).map(
                (author) => author.innerText
            )
        );

        const website = 'idefix';
        //there are 36 books on each page
        for (j = 0; j < 36; j++) {
            const myName = names[j].split('/')[0];
            const myPrice = prices[j];
            const myImg = imgSrc[j];
            const bookPage = myBook[j];
            const bookAuthor = authors[j];
            const bookPublisher = publishers[j];
            const temp_search = myName.replace(/\s/g, '');
            const search = temp_search.toLowerCase();
            const myObj = {
                search_param: search,
                book_name: myName,
                book_price: myPrice,
                book_image: myImg,
                book_page: bookPage,
                book_website: website,
                book_author: bookAuthor,
                book_publisher: bookPublisher,
            };

            if (typeof myName !== 'undefined') {
                try {
                    const res = await db
                        .collection(website)
                        .doc(myName)
                        .set(myObj)
                        .catch((err) => {
                            console.log('error occurred');
                        });
                    myObjects.push(myObj);
                } catch (e) {
                    console.log('Exception occurred');
                }
            }
        }

        console.log('Idefix Page ' + i + ' completed.');
    }

    console.log(myObjects);

    console.log(myObjects.length); // adet sayısı kontrolu

    await browser.close();
};

//call this function repeatedly with 24 hours break
setInterval(scrapWebsites, 86400000);

//call this function immediately
scrapWebsites();
