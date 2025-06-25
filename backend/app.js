import fs from 'fs/promises';
import {token, projectId} from './config.js'
import YAML from 'yaml';

const ref = 'master';
const repositoryPath = `https://dev.dulst.com/api/v4/projects/${projectId}/repository`
const propsToExtract = ['title', 'cost', 'atk', 'health'];
const pageSize = 100; // Number of items per page


async function fetchTree(cardType)
{
    const treePath = encodeURIComponent(`src/cards/${cardType}`);
    const treeUrl = `${repositoryPath}/tree?path=${treePath}&ref=${ref}`
    let allCards = []; // Array to hold all cards fetched from the API.
    for (let page = 1; ; page++)
    {
        const response = await fetch(`${treeUrl}&per_page=${pageSize}&page=${page}`, 
        {
            headers: 
            {
                'PRIVATE-TOKEN': token
            }
        });
        const data = await response.json();
        const allFiles = await Promise.all
        (
            data.map(file => fetchFile(cardType, file.name))

        );
        const filteredCards = allFiles.filter(card => card !== null);
        allCards.push(...filteredCards);
        if (data.length < pageSize) 
        {
            break;
        }
    }
    console.log(`Fetched ${allCards.length} cards of type ${cardType}`);
    await fs.writeFile(`${cardType}.json`, JSON.stringify(allCards, null, 2));
    console.log(`Saved ${cardType}.json`);
}

async function fetchFile(cardType, fileName)
{
    const filePath = encodeURIComponent(`src/cards/${cardType}/${fileName}`);
    const fileUrl = `${repositoryPath}/files/${filePath}/raw?ref=${ref}`
    const response = await fetch(fileUrl, 
    {
        headers: 
        {
            'PRIVATE-TOKEN': token
        }
    });
    const data = await response.text();
    if (data.includes('version: alpha')) 
    {
        console.log(`Skipping ${fileName} due to alpha version`);
        return null; // Skip files with 'version: alpha'
    }
    else
    {
        const filteredData = data
            .split('\n')
            .filter(line => 
                propsToExtract.some(prop => line.startsWith(`${prop}:`))
            );
        const parsedData = YAML.parse(filteredData.join('\n'));
        return parsedData
    }
}
fetchTree('unit');
fetchTree('event');
fetchTree('twist');
fetchTree('dream');
fetchTree('equip');
fetchTree('member');


