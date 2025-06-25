import ExcelJS from 'exceljs';
import fs from 'fs/promises';

export async function writeToExcel(cards)
{

    const reqSources = ['Idol', 'Banchou', 'Senshi', 'Gunshi', 'Madoushi', 'Okashii'];
    const excelArk = new ExcelJS.Workbook();
    await excelArk.xlsx.readFile('TestSheet.xlsx');
    

    const excelTab = excelArk.getWorksheet('All');
    let arkRow = 3; // ++

    cards.sort((a, b) => a.cost - b.cost); // Sort cards by cost

    reqSources.forEach(reqSource =>
    {
        if (reqSource)
        {
            reqSourceCard = cards.filter(card => card.reqSource == reqSource);
            // TODO **

        }
        else
        {
            // Put neutral cards here
        }

    }
    )


    
    cards.forEach(card =>
    {
        const controlCell = excelTab.getCell(`A${arkRow + 1}`);
        const columns = ['B', 'C', 'E', 'G'];
        const values = [card.title, card.type, card.cost, card.effectsDescription];

        // ENSURE THERE IS SPACE FOR THE CARD
        if (controlCell.fill?.fgColor?.argb)
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
            excelTab.getCell(`${column}${arkRow}`).value = values[value];

        });
        arkRow++;
            

    })

    
    
    

    await excelArk.xlsx.writeFile('TestSheet-updated.xlsx');
    console.log('Excel file updated successfully!');
}