import * as fetching from './fetching.js';
import * as exporting from './exporting_toExcel.js';


const cardTypesToExtract = ['member', 'equip', 'dream', 'twist', 'event', 'unit'];
const propsToExtract = ['title', 'type', 'class', 'cost', 'atk', 'health', 'dur', 'effectsDescription', 'customCardProperties', 'expansion', 'reqSource'];

process.stdout.write('\x1Bc'); // Fully clear the console log for clarity.
console.time('Total Time Elapsed');


// Extract keywords from the keyword array to use later in exporting_toExcel.js
export const keywords = (await fetching.fetchFile('Rule', ['customCardProperties'], 'Array/Keywords Array 65223923.yml')).customCardProperties.map(prop => prop.keywords);


// Run actual program

await exporting.loadExcelArk('Template', 'Full Library')
await fetching.fetchAllCards(cardTypesToExtract, propsToExtract);
await exporting.writeTo('Output Test')



console.log(`\n`)
console.timeEnd('Total Time Elapsed');