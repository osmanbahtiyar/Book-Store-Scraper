# Book-Store-Scraper

This is a web scraper. Scrapes websites kitapyurdu, idefix, and d&r. Fetches book data from there and inserts it into our firebase database.

## The Requirements

<p>NodeJS has to be installed on your device.</p>

## Installation

Clone this repo into your computer.

```sh
$ git clone https://github.com/osmanbahtiyar/Book-Store-Scraper.git
```

Install dependencies

```sh
$ npm install
```

Run the scrapper

```sh
$ npm run scrap
```

## How To Use

In default, the scraper fetches data and inserts them into our firestore database. If you want to change our database with your database. Get the config.json file from firestore and paste it into the scraper folder. Then change the 'require' part of the code below.
const serviceAccount = require('your json path here')

```sh
const serviceAccount = require('your json path here')
```
