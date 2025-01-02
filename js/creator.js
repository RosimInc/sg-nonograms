import * as nono from './util/nono-utils.js';

const args = process.argv.slice(2);

const numRows = parseInt(args[0], 10);
const numCols = parseInt(args[1], 10);
const msg = args[2];

let id = nono.generateNonogram(numRows, numCols, msg);
console.log(`ID: ${id}`);
console.log(`${nono.PAGE_URL}?id=${id}`);