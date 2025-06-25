import fs from 'fs/promises';
import {token, projectId} from './config.js';
import YAML from 'yaml';
import * as exporting from './exporting_toExcel.js';

const ref = 'master';
const repositoryPath = `https://dev.dulst.com/api/v4/projects/${projectId}/repository`
const pageSize = 100; // Number of items per page

export async function fetchTree(cardType, propsToExtract)
{
    const treePath = encodeURIComponent(`src/cards/${cardType}`);
    const treeUrl = `${repositoryPath}/tree?path=${treePath}&ref=${ref}`
    let allCards = []; // Array to hold all cards fetched from the API.
    let page = 1;
    const batchSize = 5; // Number of pages to fetch concurrently
    while (true) // creates an array like [1,2,3,4,5... up to batchSize]
    {
        const pageNumbers = [];
        for (let i = 0; i < batchSize; i++) 
        {
            pageNumbers.push(page + i);
        }

        // Fetch pages concurrently
        const pagesData = await Promise.all
        (
            pageNumbers.map(currentPage =>
                fetch(`${treeUrl}&per_page=${pageSize}&page=${currentPage}`,
                {
                    headers: 
                    {
                        'PRIVATE-TOKEN': token
                    }
                })
                .then(response => response.json() ) // Convert each response to JSON
            )
        );

        const flattenedBatch = pagesData.flat();
        const allFiles = await Promise.all
        (
            flattenedBatch.map(file => fetchFile(cardType, propsToExtract, file.name))
        );
        const filteredCards = allFiles.filter(card => card !== null);
        allCards.push(...filteredCards);
        if (flattenedBatch.length < pageSize) 
        {
            break; // Exit the loop if the last batch has fewer items than pageSize
        }
        page += batchSize; // Move to the next batch of pages
        
    };
    console.log(`Fetched ${allCards.length} cards of type ${cardType}`);
    await fs.writeFile(`db/${cardType}.json`, JSON.stringify(allCards, null, 2));
    console.log(`Saved ${cardType}.json`);

    // Export all cards to Excel
    await exporting.writeToExcel(allCards);
}

export async function fetchFile(cardType, propsToExtract, fileName)
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

export async function fetchAllCards(cardTypes, propsToExtract)
{
    fetchTree('unit', propsToExtract);
    // const promises = cardTypes.map(cardType => fetchTree(cardType, propsToExtract));
    // await Promise.all(promises);
}