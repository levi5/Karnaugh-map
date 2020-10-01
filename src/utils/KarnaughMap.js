import alphabet from "../temp/alphabet.js";
import labels from "../temp/labels.js";


function getLabel(numberOfVar) {

    let [data] = labels.filter((item) => {
        if (item.id == numberOfVar) return item;
    });
    return data;

}
const generatingMatrix = (numberOfVar, expression) => {

    let { lines, columns } = getLabel(numberOfVar);
    let table = [];
    let tableL = [];

    lines.map((line) => {

        const vet = [];
        const vet2 = [];

        columns.map((column) => {

            const valueTmp = line + column;

            if (expression.indexOf(valueTmp) > -1) {
                vet.push(1);


            }
            else {
                vet.push(0);
            }
            vet2.push(valueTmp);
        });

        tableL.push(vet2);
        table.push(vet);
    });

    return [table, tableL];
};

/////


function KarnaughMap(numberOfVar, expression, S) {
  

    if (numberOfVar > 0){
        let newTable = [];


        const numberLineTemp = Math.floor(numberOfVar / 2);
        const numberCol = (2 ** numberLineTemp);
        const numberLine = (2 ** (numberOfVar - numberLineTemp));

        expression = expression.replace(/\s/g, "").split("+");

        newTable = QMcCluskey(S);
        newTable = essentialCousinImplants(newTable, numberOfVar);
        console.log(newTable);

        const [table] = generatingMatrix(numberOfVar, expression);

        if (expression)
            drawKarnaughMapTable(numberOfVar, expression, numberLine, numberCol, table, newTable);

    }
}






function QMcCluskey(table) {
    let stop = true;
    let finalTable = [];

    while (stop) {

        const tableQMcCluskey = groupingValues(table);
        table = similarCalculation(tableQMcCluskey);
        finalTable = table;
        stop = stopOrContinue(table);
    }
    finalTable = groupingValues(finalTable);
    finalTable = removeDuplicateElements(finalTable);
    return finalTable;
}

///////


// Funções  auxiliares
function setTableLabels(numberOfVar) {

    let data = getLabel(numberOfVar);
    const { lines, columns } = data;

    return {
        lines,
        columns
    };
}




function numberOfOnes(array) {
    let counter = 0;
    array.map((item) => {
        if (item === "1") {
            counter += 1;
        }
    });
    return counter;
}


function getGroupingIndexes(arrayOne, table) {


    const str1 = JSON.stringify(arrayOne);
    let stop = true;

    let value;

    table.filter((item) => {
        const { Bin, decimalValue } = item;
        const str2 = JSON.stringify(Bin);
        if (str1 == str2 && stop) {
            stop = false;
            value = decimalValue;
            return;
        }
    });
    return [...value];
}





function similarCalculation(table) {
    let table1 = ungrudgingArrays(table);
    table = removeDuplicateElements(table);
    table = groupingValues(table);

    let size = table.length;
    let newTable = [];

    if (size > 1) {

        table.map((group, indexLine) => {

            group.map((element) => {

                const item = element.Bin;
                const decimalValueArrayOne = element.decimalValue;

                let nextItem;
                let index = indexLine + 1;

                if (index < size) {
                    if (table[index] !== undefined) {
                        table[index].map((arrayTwo) => {

                            const decimalValueArrayTwo = arrayTwo.decimalValue;
                            nextItem = arrayTwo.Bin;

                            var tmp = oneChance(item, nextItem, indexLine, index, decimalValueArrayOne, decimalValueArrayTwo, table1);
                            if (tmp.Bin.length > 0) newTable.push(tmp);
                        });
                    } else {
                        index = size;
                    }
                }
            });
        });
    }


    table = ungrudgingArrays(table);

    if (newTable.length === 0) return table;
    else {
        newTable = getUnusedValues(table, newTable);
        return newTable;
    }
}


function oneChance(vet1, vet2, indexLine, index, indexVetOne, indexVetTwo) {
    let q = 0;
    let vetF = [];

    for (let line = 0; line < vet1.length; line++) {

        if ((q <= 1) && (vet1[line] !== "-" && vet2[line] !== "-")) {

            if (vet1[line] === vet2[line]) {
                vetF.push(vet1[line]);

            } else if (q === 0 & vet1[line] !== vet2[line]) {
                q++;
                vetF.push("-");
            } else {
                q++;
            }

        } else if (vet1[line] === "-" & vet2[line] === "-") vetF.push(vet1[line]);

        else {

            vetF = [];
            break;
        }
    }

    // console.log(`(${indexVetOne}, ${indexVetTwo}) = ${[vetF]}`);

    return {
        Bin: vetF,
        decimalValue: [...indexVetOne, ...indexVetTwo]
    };
}


////////////////////////////////////////concertar func

function removeDuplicateElements(table) {

    table = ungrudgingArrays(table);
    const tmpTable = table;

    let newTable = table
        .map(e => JSON.stringify(e.Bin))
        .reduce((acc, cur) => (acc.includes(cur) || acc.push(cur), acc), [])
        .map(e => JSON.parse(e));


    table = [];
    newTable.map((item) => {

        const decimalValue = getGroupingIndexes(item, tmpTable);

        const value = numberOfOnes(item);
        const tmp = { decimalValue, Bin: item, amountOne: value };
        table.push(tmp);

    });

    return table;


}





function stopOrContinue(newTable) {


    let qq = 0;
    let stop = false;
    const size = newTable.length;
    let cont = 0;



    if (size !== 1) {
        while (cont < size) {

            for (let line = cont + 1; line < newTable.length; line++) {

                if (line < newTable.length) {
                    const { Bin } = newTable[cont];
                    const Bin2 = newTable[line].Bin;
                    const numColumns = Bin.length;


                    for (let column = 0; column < numColumns; column++) {

                        if (Bin[column] !== "-" & Bin2[column] !== "-") {

                            if ((Bin[column] !== Bin2[column]) & (qq <= 1)) {

                                stop = qq >= 1 ? false : true;
                                qq += 1;
                            }

                            else if (Bin[column] === Bin2[column]) {
                                stop = true;
                            }
                            else {
                                qq=0;
                                break;
                            }
                        }
                        else if (Bin[column] === "-" & Bin2[column] === "-") {
                            stop = qq > 1 ? false : true;
                        } else {
                            stop = false;
                            qq = 0;
                            break;
                        }
                    }

                } else {
                    cont = size;
                    break;
                }



            }
            cont++;
            if (stop) return stop;


        }

    }
    return stop;

}


////////////////


function groupingValues(table) {

    const tableQMcCluskey = [];
    let value = 0;

    table.map((item) => {
        const { Bin } = item;
        const decimalValue = [parseInt(Bin.join(""), 2)];

        value = numberOfOnes(Bin);
        item = { decimalValue, ...item, amountOne: value };

        if (tableQMcCluskey[value] != undefined) {
            let size = tableQMcCluskey[value].length;
            tableQMcCluskey[value][size] = item;
        } else {
            tableQMcCluskey[value] = [item];
        }
    });


    return tableQMcCluskey;
}

function ungrudgingArrays(table) {
    let newArray = [];

    table.map((itens) => {
        itens.map((element) => {
            newArray = [...newArray, element];

        });
    });
    return newArray;

}
////////////////////////////////////////////////////////////////////

function arrayCompare(arrayOne, arrayTwo) {
    const result = arrayOne.filter(function (item) { return arrayTwo.indexOf(item) > -1; });
    return result.length;
}


function getCombinedValues(table, newTable){

    let valueOne = [];
    let valueTwo = [];

    table.map((item) => {
        valueOne = [...valueOne, ...item.decimalValue];
    });

    newTable.map((item) => {
        valueTwo = [...valueTwo, ...item.decimalValue];
    });

    const setOne = new Set(valueOne);
    const setTwo = new Set(valueTwo);

    return [setOne, setTwo];
}



function getUnusedValues(table, newTable) {
   
    let [setOne, setTwo] = getCombinedValues(table, newTable);

    let valueOne = [...setOne];
    let valueTwo = [...setTwo];

    let result = valueOne.filter((item) => {
        if (!(valueTwo.includes(item)))
            return item;
    });

    if (result.length > 0) {

        table.filter((item) => {

            const { decimalValue } = item;
            if (arrayCompare(result, decimalValue) === result.length)newTable.push(item);

        });
    }
    return newTable;
}


//////////////////////////////////////////////////////////////
function essentialCousinImplants(table, numberOfVar) {

    const numberOfColumns = (2 ** numberOfVar);
    const numberOfLines = table.length;
    let gTable = [];

    for (let line = 0; line < numberOfLines; line++) {

        const { decimalValue } = table[line];
        let arrayTmp = [];

        for (let column = 0; column < numberOfColumns; column++) {

            const existElement = decimalValue.indexOf(column);

            if (existElement !== -1) {
                arrayTmp.push("X");
            } else {
                arrayTmp.push("O");
            }

        }
        gTable.push(arrayTmp);

    }

    const size = gTable.length;

    if (size > 1) {
        let counter = 0;
      
        let newTable =[];

        while (counter < size) {

            for (let column = 0; column < numberOfColumns; column++) {

                if (gTable[0][column] === "X") {

                    let xCounter = 0;

                    for (let line = 0; line < numberOfLines; line++) {
                        if (gTable[line][column] === "X") xCounter += 1;
                    }

                    if (xCounter === 1) {
                        newTable.push(table[counter]);
                        break;
                    }
                }
            }
            counter++;
            gTable = changePosition(gTable, counter, 0);
        }

    
        table = setImpatientExpression(table, newTable);
       
        return table;
    } else {
        return table;
    }



}


function changePosition(arr, from, to) {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
    return arr;
}

function setImpatientExpression(table, newTable){
    let [setOne, setTwo] = getCombinedValues(table, newTable);
    let valueOne = [...setOne];
    let valueTwo = [...setTwo];



    let result = valueOne.filter((item) => {
        if (!(valueTwo.includes(item)))
            return item;
    });

    
    if (result.length > 0) {
        let opc = true;

        table.filter((item) => {

            const { decimalValue } = item;
            if (arrayCompare(result, decimalValue) === result.length && opc) {
                opc = false;
                newTable.push(item);
            }
        });
    }
    return newTable;
}






//functions for creating elements on the screen//

function drawKarnaughMapTable(numberOfVar, expression, numberLine, numberCol, table, obj) {

    // eslint-disable-next-line no-unused-vars
    const[e, expressionHTML] = finalExpressionMapK(obj, numberOfVar);
    
    const table_labels = setTableLabels(numberOfVar, expression);



    const titleTop = document.querySelector("#MapK-title-top");
    const tableKarnaugh = document.querySelector("#content-table-MapK table");
    const divs = document.querySelector("#content-table-MapK #MapK-title-left");
    const expressionHTMLMapK = document.querySelector(".MapK p");


    table_labels.columns.map((value) => {
        const li = document.createElement("li");
        li.textContent = value;
        titleTop.appendChild(li);
    });

    table_labels.lines.map((value) => {
        const li = document.createElement("li");
        li.textContent = value;
        divs.appendChild(li);
    });

    let counter = 0;
    for (let line = 0; line < numberLine; line++) {

        var row = document.createElement("tr");

        for (let column = 0; column < numberCol; column++) {
            const ele = table[line][column];
            let cell = document.createElement("td");
            cell.textContent = ele;
            cell.setAttribute("id", `${counter}`);
            row.appendChild(cell);
            counter++;
        }

        row.setAttribute("id", `line-${line}`);
        tableKarnaugh.appendChild(row);
    }

    paintTheTable(obj);
    expressionHTMLMapK.innerHTML = `S = ${expressionHTML}`;
}



function paintTheTable(obj){
    
    obj.map((item)=>{

        const {decimalValue} = item;
        decimalValue.map(()=>{

            const elementHTML = [...document.querySelectorAll("#content-table-MapK table tr td")];
    
            elementHTML.map((dr)=>{
                if(String(dr.textContent) === "1"){
                    dr.style.backgroundColor = "#CE390F";
                    dr.style.color ="#FFF";
                }
            });
        });
    });
}




function finalExpressionMapK(obj, numberOfVar){

    const variableAlphabet = alphabet.slice(0 , numberOfVar);
    const subExpression = [];
    let expressionHTML = "";
      
    const sizeExpression =  obj.length;
    
    obj.map((item, index)=>{
        const expression = item.Bin;
     
        let letter = "";
        let tmp  ="";
       
       
        expression.map((element, index)=>{
            if(element !== "-"){
                letter = variableAlphabet[index];
                

                if(element === "0")tmp = tmp + letter + "'";
                else if(element === "1") tmp = tmp + letter;

                expressionHTML = expressionHTML + finalExpressionMapKHTML(letter, element);
            }
          
        });
        subExpression.push(tmp);

        if (index < (sizeExpression -1))expressionHTML = expressionHTML + "+";
        else expressionHTML;
        
    });


    return [subExpression, expressionHTML];



}

function finalExpressionMapKHTML(variableStr, elementStr){

    let textHTML = null;

    if (elementStr === "0")textHTML = `<span class="complement">${variableStr}</span>`;
    else textHTML = `<span class="not-complement">${variableStr}</span>`;

    return textHTML;
}


//
function removeKarnaughMap() {

    const tableKarnaugh = document.querySelectorAll("#content-table-MapK table tr");
    const titleTopLi = document.querySelectorAll("#MapK-title-top li");
    const MapKTitleLeftLi = document.querySelectorAll("#content-table-MapK #MapK-title-left li");
    const expressionHTML = document.querySelectorAll(".MapK p span");
    const paragraph = document.querySelector(".MapK p ");


    if (tableKarnaugh !== null) {
        tableKarnaugh.forEach(element => element.remove());
        titleTopLi.forEach(element => element.remove());
        MapKTitleLeftLi.forEach(element => element.remove());
        expressionHTML.forEach(element => element.remove());
        paragraph.innerHTML = "";
        
    }
}




export { KarnaughMap, removeKarnaughMap };