/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const express = require('express');
const multer = require('multer');
const fs = require('fs');

const upload = multer();
const app = express();

let PRODUCTS = {};
let FILTERED_PRODUCTS = {};
let TYPE = 'all';
let PRICE = 'asc';

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  res.append('AMP-Access-Control-Allow-Source-Origin', 'https://seemly-metal.glitch.me');
  res.append('Access-Control-Expose-Headers', ['AMP-Access-Control-Allow-Source-Origin']);
  next();
});

app.use((req, res, next) => {
  if (req.url == '/products' || req.url == '/products.html') {
    console.log('resetting data');
//     let products = fs.readFileSync(__dirname + '/public/json/products.json');
//     FILTERED_PRODUCTS = PRODUCTS = JSON.parse(products);
//     TYPE = 'all';
//     PRICE = 'asc';
  }
  next();
});

// This serves static files from the specified directory
app.use(express.static(__dirname + '/public'));

app.get('/products/filter', (req, res) => {
  const type = req.query.type;
  const price = req.query.price;
  // if (!FILTERED_PRODUCTS.items || !PRODUCTS.items) {
  //   let products = fs.readFileSync(__dirname + '/public/json/products.json');
  //   FILTERED_PRODUCTS = PRODUCTS = JSON.parse(products);
  // }
  if (type) {
    console.log('filtering');
    TYPE = type;
    const products = fs.readFileSync(__dirname + '/public/json/products.json');
    const productsJSON = JSON.parse(products);
    const filteredItems = productsJSON.items.filter(item => type == 'all' ? true : item.type == type);
    const sortedFilteredItems = filteredItems.sort((a, b) => PRICE == 'asc' ? a.price - b.price : b.price - a.price);
    FILTERED_PRODUCTS.items = sortedFilteredItems;
  }
  if (price) {
    console.log('sorting');
    PRICE = price;
    const sortedItems = FILTERED_PRODUCTS.items.sort((a, b) => price == 'asc' ? a.price - b.price : b.price - a.price);
    FILTERED_PRODUCTS.items = sortedItems;
  }
  res.append('Content-Type', 'application/json');
  console.log('sending response');
  res.send(JSON.stringify(FILTERED_PRODUCTS));
});

app.post('/submit-form', upload.array(), (req, res) => {
  res.append('Content-Type', 'application/json');
  res.send(JSON.stringify(req.body));
});

const server = app.listen(8081, '127.0.0.1', () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
