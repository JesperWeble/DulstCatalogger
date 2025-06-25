import * as fetching from './fetching.js';
import * as exporting from './exporting_toExcel.js';

const cardTypesToExtract = ['hero', 'unit', 'event', 'twist', 'dream', 'equip', 'member'];


const propsToExtract = ['title', 'cost', 'atk', 'health', 'effectsDescription', 'expansion', 'reqSource'];



// async function fetchTree(cardType)
// {
//     const treePath = encodeURIComponent(`src/cards/${cardType}`);
//     const treeUrl = `${repositoryPath}/tree?path=${treePath}&ref=${ref}`
//     let allCards = []; // Array to hold all cards fetched from the API.
//     for (let page = 1; ; page++)
//     {
//         const response = await fetch(`${treeUrl}&per_page=${pageSize}&page=${page}`, 
//         {
//             headers: 
//             {
//                 'PRIVATE-TOKEN': token
//             }
//         });
//         const data = await response.json();
//         const allFiles = await Promise.all
//         (
//             data.map(file => fetchFile(cardType, file.name))

//         );
//         const filteredCards = allFiles.filter(card => card !== null);
//         allCards.push(...filteredCards);
//         if (data.length < pageSize) 
//         {
//             break;
//         }
//     }
//     console.log(`Fetched ${allCards.length} cards of type ${cardType}`);
//     await fs.writeFile(`${cardType}.json`, JSON.stringify(allCards, null, 2));
//     console.log(`Saved ${cardType}.json`);
// }





console.time('Total Time Elapsed');
await fetching.fetchAllCards(cardTypesToExtract, propsToExtract);
console.timeEnd('Total Time Elapsed');