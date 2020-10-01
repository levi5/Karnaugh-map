import {KarnaughMap, removeKarnaughMap} from "../../utils/KarnaughMap.js";


//Variables Globais//
const alphabet  =   ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
let truthTableValuesObject           =   [   ];
let tableFinal  =   [   ]; 
let expression  =   [   ];
let inputAmount =       0;



//Convert
function decForBin(dec, size) {
    var bin = dec >= 0 ? dec.toString(2) : (~dec).toString(2);
    return ("0".repeat(size) + bin).substr(-size);
}



function clearVariables() {
    truthTableValuesObject = [];
    expression = [];
    tableFinal = [];
}




function generatingTruthTable(numberOfVariables) {
    //generating truth table with values in 
    //binaries based on the number of variables.

    const numberLines   = (2 ** numberOfVariables);
    const numberColumns = numberOfVariables;

    let truthTable = new Array(numberLines);

    for (let line = 0; line < numberLines; line++) {

        truthTable[line] = new Array(numberColumns);
        const binaryValueArray = (decForBin(line, numberOfVariables));

        for (let column = 0; column < binaryValueArray.length; column++) {
            truthTable[line][column] = binaryValueArray[column];
        }
    }
    return truthTable;
}



function generating_truth_table_expression(obj) {
    const tableQCh          = [];
    expression              = [];
    let expressionHTML      = "";
    const sizeExpression    = obj.length;
    // Elementos HTML//
    const title = document.querySelector("main p");

    obj.forEach((event, index) => {

        const { content } = event;
        const size = content.length;
        let partExpression = "";


        for (let i = 0; i < size; i++) {
            if (content[i] === "0") 
                partExpression = partExpression + alphabet[i] + "' ";

            else if (content[i] === "1") 
                partExpression = partExpression + alphabet[i];

            expressionHTML = expressionHTML + generateHTMLExpression(alphabet[i], content[i]);
        }

        if (index < (sizeExpression -1))expressionHTML = expressionHTML + "+";
        else expressionHTML;
    
        expression.push(partExpression);
        tableQCh.push({
            string:partExpression,
            Bin:content
        });
    });

    title.innerHTML = `S = ${expressionHTML}`;
    return tableQCh;
}




function generateHTMLExpression(variableStr, elementStr){
    //Generating the expression of the truth 
    //table with and without complement.

    let textHTML = null;

    if (elementStr === "0")
        textHTML = `<span class="complement">${variableStr}</span>`;
    else
        textHTML = `<span class="not-complement">${variableStr}</span>`;
    
    return textHTML;
}



function removeElement() {

    const truthTable            = document.querySelectorAll (".table tr");
    const tableKarnaugh         = document.querySelectorAll ("main section div table tr");
    let buttons                 = document.querySelectorAll (".table button");
    let headerTable             = document.querySelectorAll ("main .section-table .table-title li");
    let truthTableExpression    = document.querySelector    ("#table-expression");

    if (truthTable !== null) {
        truthTable.forEach  (line    => line.remove   ());
        buttons.forEach     (button  => button.remove ());
        headerTable.forEach (element => element.remove());
        clearVariables();
        truthTableExpression.innerText = "";
    }

    if(tableKarnaugh !== null)
        tableKarnaugh.forEach(line => line.remove());
}










function removeL(event) {

    removeKarnaughMap();
    const selected_line = document.querySelector(`#line-${event.value}`);
    ///setar value button//
    const button = document.querySelector(`#button-${event.value}`);

    let line        = Number(event.value);
    let content     = selected_line.innerText.split("\t");
  

    if (button.innerText == "0") {

        truthTableValuesObject = [...truthTableValuesObject, {line, content}];
        button.innerText = "1";

    } else {
        const valueLine = Number(button.value);

        truthTableValuesObject = truthTableValuesObject.filter(({line, content})=>{
            if(line !== valueLine)return {line, content};
        });
       
        button.innerText = "0";
    }

    button.classList.toggle("selected_button");
    tableFinal = generating_truth_table_expression(truthTableValuesObject);
    HideButtonSolution();
}




function createButton(number) {

    const button = document.createElement("button");

    button.innerText = "0";
    button.setAttribute("onClick", "removeL(this)");
    button.setAttribute("value", `${number}`);
    button.setAttribute("id", `button-${number}`);

    return button;
}


function createTableTitle(number) {

    const div = document.querySelector(".section-table div");
    let cont = 0;

    alphabet.filter((letra) => {

        if (cont < number) {
            let cellTitle = document.createElement("li");
            cellTitle.textContent = letra;
            div.appendChild(cellTitle);
        }

        else if (cont == number) {
            let cellTitle = document.createElement("li");
            cellTitle.textContent = "S";
            div.appendChild(cellTitle);
        }
        cont += 1;
    });
}


//Gerar mapa k
document.querySelector("#Get-MapK").addEventListener("click", () => {

    if (expression.length !== 0){
        if(expression.length > 1)
            expression = expression.join("+");
        else
            expression = new String(expression);

        const numberOfVar = Number(String(inputAmount));
        removeKarnaughMap();
        KarnaughMap(numberOfVar, expression, tableFinal);
    }
});


function HideButtonSolution(){
    const buttonGetMapK = document.querySelector("#Get-MapK");

    if (expression.length !== 0)
        buttonGetMapK.classList.remove("btn-disabled");
    else  
        buttonGetMapK.classList.add("btn-disabled");
}









///////////////////////////////////////////////////////////////////////

document.querySelector(".btn").addEventListener("click", () => {

    removeElement();
    removeKarnaughMap();
    HideButtonSolution();

    inputAmount     = document.querySelector("input").value;
    inputAmount     = inputAmount !== "" ? parseInt(inputAmount, 10) : 1;

    const numberOfVariables   = Number(String(inputAmount));


    if (numberOfVariables <= 5 & numberOfVariables > 1) {

        const table = generatingTruthTable(numberOfVariables);
        const table_element = document.querySelector(".table");



        //Gerando o titulo com as Variáveis//

        createTableTitle(numberOfVariables);
        ///Gerando os valores de 0 a N-1

        for (let line = 0; line < table.length; line++) {

            var row = document.createElement("tr");

            for (let column = 0; column < table[line].length; column++) {


                const ele = table[line][column];
                let cell = document.createElement("td");

                cell.textContent = ele;
                row.appendChild(cell);
            }

            const line_button = createButton(line);

            row.setAttribute("id", `line-${line}`);
            table_element.appendChild(row);
            table_element.appendChild(line_button);
        }
    }
});



export {
    removeL,
    createButton,

};