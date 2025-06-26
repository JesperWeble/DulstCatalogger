import ExcelJS from 'exceljs';
import fs from 'fs/promises';

export async function writeToExcel(cards)
{

    const reqSources = ['Idol', 'Banchou', 'Senshi', 'Gunshi', 'Madoushi', 'Okashii', 'Neutral'];
    const excelArk = new ExcelJS.Workbook();
    await excelArk.xlsx.readFile('TestSheet.xlsx');
    

    const excelTab = excelArk.getWorksheet('All');

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
            const columns = ['B', 'C', 'E', 'G'];
            const values = 
            [
                card.title, 
                card.type ? card.type.charAt(0).toUpperCase() + card.type.slice(1) : '', 
                card.cost, 
                card.effectsDescription
            ];
            
    
            // ENSURE THERE IS SPACE FOR THE CARD
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
                const oldStyle = {...cell.style}
                if (column == 'G')
                {
                    cell.value = 
                    { 
                        richText: values[value] 
                        .replace(/<\/?p>/g, '')
                        .split(/<\/?strong>/)
                        .map((text, i) =>
                        ({
                            text: text.replace(/<[^>]+>/g, ''),
                            font: i % 2 ? { bold: true } : undefined,
                        }))
                    };
                    cell.style = oldStyle; // Preserve the old style

                }
                else
                {
                    cell.value = values[value];
                }
    
            });
            arkRowBonus++;
                
    
        })

    });


    await excelArk.xlsx.writeFile('TestSheet-updated.xlsx');
    console.log('Excel file updated successfully!');
}