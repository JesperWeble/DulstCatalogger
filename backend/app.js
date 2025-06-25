import * as fetching from './fetching.js';
import * as exporting from './exporting_toExcel.js';

const cardTypesToExtract = ['hero', 'unit', 'event', 'twist', 'dream', 'equip', 'member'];
const propsToExtract = ['title', 'cost', 'atk', 'health', 'effectsDescription', 'expansion', 'reqSource'];

console.time('Total Time Elapsed');
await fetching.fetchAllCards(cardTypesToExtract, propsToExtract);
console.log(`\n`)
console.timeEnd('Total Time Elapsed');