import * as fetching from './fetching.js';


const cardTypesToExtract = ['member', 'equip', 'dream', 'twist', 'event', 'unit'];
const propsToExtract = ['title', 'type', 'cost', 'atk', 'health', 'effectsDescription', 'expansion', 'reqSource'];

console.time('Total Time Elapsed');
await fetching.fetchAllCards(cardTypesToExtract, propsToExtract);
console.log(`\n`)
console.timeEnd('Total Time Elapsed');

