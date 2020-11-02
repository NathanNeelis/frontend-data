const dataSurvey = data; // loading all survey data and storing it in a variable.
// console.log(dataSurvey);


// clean data arrays
let cleanEyeData = cleaningEyeColorData();
console.log('clean eye color data:', cleanEyeData);

let cleanGlazenWaterData = cleaningGlazenWaterData();
console.log('clean glazen water data', cleanGlazenWaterData);


// FUNCTIONS CLEANING DATA ARRAYS
// Column Aantal glazen water per dag
function cleaningGlazenWaterData() {
    let columnName = "aantalGlazenWaterPerDag";
    let allAnswersInColumn = getData(dataSurvey, columnName);
    let cleanDataOfEmptySlots = removeEmptySlots(allAnswersInColumn)
    let cleanData = stringToNumbers(cleanDataOfEmptySlots);
    return cleanData;
}

// Column kleur ogen
// to do
// all data to lowercase
// convert all color names to hex color codes
// * Check and put een # voor color codes (DONE)
// * Space after the # (removes " "??) DONE
// remove rest incorrect data 
function cleaningEyeColorData() {
    let secondColumnName = "oogKleur";
    let allEyeColorData = getData(dataSurvey, secondColumnName);
    let eyeColorDataLowerCase = toLowerCase(allEyeColorData);
    let eyeHexColors = replaceColorNamesToHexcolors(eyeColorDataLowerCase);
    let eyeHexColorSpaces = removeSpaces(eyeHexColors);
    let dataHexCheck = hexCheck(eyeHexColorSpaces);
    let removeLongStrings = checkTotalCharacters(dataHexCheck, 8);
    return removeLongStrings
}

// FUNCTION TO GET THE DATA
// returns all data for a specific column
function getData(answers, question) {
    let answerData = [];
    for (answer of answers) {
        answerData.push(answer[question]);
    }
    return answerData; // Array with all the data in the specific column
};

// SEPERATE FUNCTIONS TO CLEAN DATA ARRAYS
// converts all string numbers to numbers (integers)
function stringToNumbers(arr) {
    let newCleanData = arr.map(x => +x);
    return newCleanData;
}
// RESOURCE: https://stackoverflow.com/questions/15677869/how-to-convert-a-string-of-numbers-to-an-array-of-numbers

// removes all empty slots
function removeEmptySlots(arr) {

    // filter with a original for loop example
    // let cleanData = [];
    // for (let i = 0; i < arr.length; i++) {
    //     if (arr[i] != "") {
    //         cleanData.push(arr[i])
    //     }
    // }
    // return cleanData;


    // filter with the .filter() example
    // let cleanData = arr.filter(function (cleanData) {
    //     // return cleanData != "" || 0;  // also would remove the data that is zero.
    //     return cleanData != "";
    // })
    // return cleanData;

    // .filter() shortest
    let cleanData = arr.filter(keys => keys != "");
    return cleanData;
}

// All data to lowercase
function toLowerCase(arr) {
    let newCleanData = arr.map(x => x.toLowerCase());
    return newCleanData;
}


function replaceColorNamesToHexcolors(arr) {
    let cleanData = arr.map(
        x => {
            return x
                .replace(/blauw/, '#0000FF')
                .replace(/blue/, '#0000FF')
                .replace(/groen/, '#008000')
                .replace(/green/, '#008000')
                .replace(/bruin/, '#A52A2A')
                .replace(/brown/, '#A52A2A')
                .replace(/rood/, '#FF0000')
                .replace(/red/, '#FF0000')
                .replace(/roze/, '#FFC0CB')
                .replace(/pink/, '#FFC0CB')
                .replace(/oranje/, '#FFA500')
                .replace(/orange/, '#FFA500')
                .replace(/geel/, '#FFFF00')
                .replace(/yellow/, '#FFFF00')
                .replace(/paars/, '#800080')
                .replace(/purple/, '#800080')
                .replace(/grijs/, '#808080')
                .replace(/gray/, '#808080')
                .replace(/wit/, '#FFFFFF')
                .replace(/white/, '#FFFFFF');

        });

    // RESOURCE: https://stackoverflow.com/questions/953311/replace-string-in-javascript-array
    // RESOURCE: https://stackoverflow.com/questions/7990879/how-to-combine-str-replace-expressions-in-javascript
    // RESOURCE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
    // RESOURCE: Color data https://htmlcolorcodes.com/color-names/


    return cleanData; // Array with colornames converted to hex colors.
}

function removeSpaces(arr) {
    // using an original for loop
    // let cleanData = [];
    // for (let i = 0; i < arr.length; i++) {
    //     cleanData.push(arr[i].replace(/ /, ''));
    // }

    // using the .map method
    // let cleanData = arr.map(
    //     keys => {
    //         return keys.replace(/ /, '')
    //     });

    // Shortest version .map()
    let cleanData = arr.map(keys => keys.replace(/ /, ''));
    return cleanData; // Array without spaces in strings.
}


function hexCheck(arr) { // Check if arrayItems start with #
    let cleanData = arr;
    for (result in cleanData) {
        if (arr[result].charAt(0) !== '#') { // If the first char is nog a # 
            cleanData[result] = '#' + cleanData[result] // add the # infront of the string
        }
    }
    return cleanData // return array with added #
}

// .charAt idea code help by Marco Fijan

function checkTotalCharacters(arr, amount) {
    let newData = arr.filter(function (newData) {
        return newData.length < amount;
    })
    return newData;
}