import fs from 'fs/promises';
import {token, projectId} from './config.js'
import YAML from 'yaml';

const ref = 'master';
const repositoryPath = `https://dev.dulst.com/api/v4/projects/${projectId}/repository`



async function fetchTree(cardType)
{
    const treePath = encodeURIComponent(`src/cards/${cardType}`);
    const treeUrl = `${repositoryPath}/tree?path=${treePath}&ref=${ref}`
    let allCards = []; // Array to hold all cards fetched from the API.
    for (let page = 1; ; page++)
    {
        const response = await fetch(`${treeUrl}&per_page=100&page=${page}`, 
        {
            headers: 
            {
                'PRIVATE-TOKEN': token
            }
        });
        let data = await response.json();
        for (const file of data) 
        {
            const card = await fetchFile(cardType, file.name)
            console.log(card)
            allCards.push(card);


        };
        if (data.length < 100) 
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
    const parsedData = YAML.parse(data);
    return parsedData
}

// fetchFile('unit', 'Adored City Girl 65556937.yml');
fetchTree('unit');

