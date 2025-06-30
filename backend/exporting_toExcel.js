import ExcelJS from 'exceljs'; // For reading and writing Excel files
import * as cheerio from 'cheerio'; // For parsing HTML content in the card effects
import * as app from './app.js'

export async function writeToExcel(cards)
{
    const reqSources = ['Idol', 'Banchou', 'Senshi', 'Gunshi', 'Madoushi', 'Okashii', 'Neutral'];
    const excelArk = new ExcelJS.Workbook();
    await excelArk.xlsx.readFile('TestSheet.xlsx');
    

    const excelTab = excelArk.getWorksheet('All');


    // Order by Source
    reqSources.forEach(reqSource =>
    {
        let reqSourceCards;
        console.log(`Processing cards for source: ${reqSource}`);
        if (reqSource == 'Neutral') {reqSourceCards = cards.filter(card => card.reqSource == '');}
        else {reqSourceCards = cards.filter(card => card.reqSource == reqSource);}
        let arkRowBonus = 1;
        let arkRow;
        reqSourceCards.forEach(card =>
        {
            const sourceCell = excelTab.getColumn('A').values.findIndex(value => value === reqSource);
            arkRow = sourceCell + arkRowBonus; // Get the row number of the cell below the Source.
            const controlCell = excelTab.getCell(`A${arkRow + 1}`);
            const columns = ['B', 'C', 'D', 'E', 'F', 'G', 'H'];
            const values = 
            [
                card.title, 
                card.type ? card.type.charAt(0).toUpperCase() + card.type.slice(1) : '', 
                card.class,
                card.cost,
                card.health > 0 || card.dur > 0 ? `${card.atk}/${card.health > 0 ? card.health : card.dur}` : null,
                card.effectsDescription,
                Object.entries(Object.assign({}, ...(card.customCardProperties || [])))
                .filter (([key, count]) => app.keywords.includes(key) && Number(count) > 0)
                .map 
                (([key, count]) =>
                {
                    const tagName = key.charAt(0).toUpperCase() + key.slice(1);
                    const tagValue = Number(count);
                    return tagValue > 1 ? `${tagName} (${tagValue})` : tagName
                }) 
            ];
    
            // ENSURE THERE IS SPACE FOR THE CARD. If not create a new row
            if (controlCell.fill?.fgColor?.argb || controlCell.fill?.bgColor?.argb)
            {
                excelTab.spliceRows(arkRow + 1, 0, []);

                // Ensure that the new row has the same style as the previous row.
                const currentRow = excelTab.getRow(arkRow);
                const targetRow = excelTab.getRow(arkRow + 1);


                currentRow.eachCell({ includeEmpty: true }, (cell, colNumber) =>
                {
                    const t = targetRow.getCell(colNumber);
    
                    if (colNumber == 1) // If the cell is in column A, increment the value
                    {
                        const letter = cell.value[0];
                        const number = parseInt(cell.value.slice(1));
                        t.value = `${letter}${number + 1}`;         
                    }
                    else{t.value = cell.value;}
                    t.style = { ...cell.style };
                });
            };
    
            
            columns.forEach((column, value) =>
            {
                const cell = excelTab.getCell(`${column}${arkRow}`)
                const val = values[value]
                
                const defaultFont = 
                {
                    name: 'Arial',
                    size: 10,
                    bgColor: { argb: 'FFD9D9D9' }, // Grey background
                };
                
                if (column == 'G') // Set effect description (remove html tags)
                {
                    if (values[value] && values[value].trim())
                    {
                        // Parse the HTML content using cheerio
                        const $ = cheerio.load(values[value]);
                        const richText = [];
                        

                        // Extract text and apply styles
                        $('p').contents().each((_, node) =>
                        {
                            if (node.tagName === 'strong') 
                            {

                                if ($(node).text().trim())
                                {
                                    richText.push
                                    ({
                                        text: $(node).text(),
                                        font: { ...defaultFont, bold: true }
                                    });

                                }
                            }
                            else
                            {
                                if (node.data && node.data.trim())
                                {
                                    richText.push
                                    ({
                                        text: node.data,
                                        font: { ...defaultFont }
                                    });

                                }
                            }

                        });
                        cell.value = { richText };
                    }
                    else
                    {
                        cell.value = '- - -';
                        cell.style = { ...cell.style }
                    }

                }
                else
                {
                    if (val != null) 
                    { 
                        if (Array.isArray(val))
                        {
                            if (val.length > 0 && val != '') {cell.value = val.join(', ');}
                            else { cell.value = '---' }
                        }
                        else {cell.value = values[value];}
                        
                    }
                    else { cell.value = '---' }
                    // cell.style = { ...defaultFont };
                }
    
            });
            arkRowBonus++;
                
    
        })

    });


    await excelArk.xlsx.writeFile('TestSheet-updated.xlsx');
    console.log('Excel file updated successfully!');
}