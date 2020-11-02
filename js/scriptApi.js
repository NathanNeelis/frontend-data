const endpoint = 'https://opendata.rdw.nl/resource/t5pc-eb34.json'; // welke dataset?
const endpointNS = 'https://gateway.apiportal.ns.nl/places-api/v2/places'
// const endpointCBS = 'https://opendata.cbs.nl/ODataApi/odata/70072ned/TypedDataSet'
const selectedColumn = 'areaid'; // column of choice

getData(endpoint)
    .then(rdwData => {
        console.log('all RDW data:', rdwData);
        console.log('first element:', rdwData[0]);
        const areaIdArray = filterData(rdwData, selectedColumn);
        console.log(areaIdArray);
    })

getNsData(endpointNS)
    .then(nsData => {
        console.log('all NS station data', nsData[0].locations);
        console.log('all NS data', nsData);
    })

// getData(endpointCBS)
//     .then(cbsData => {
//         console.log('all CBS data:', cbsData);
//     })

async function getNsData(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Ocp-Apim-Subscription-Key': 'df890e3c5bc84d9a88399e3d551d1f6a'
        }
    })
    const data = await response.json();
    return data.payload;
}

// Github repo from Bas Araar that had used the NS API before, got this info from Deanne in Teams.
//Resources: https://github.com/aaraar/web-app-from-scratch-1920/blob/188a235e690a3e0963b1eac0907f89bcbd2827a8/src/Api.ts#L61-L81
// MDN about fetch, got the resource from Robert.
//Resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// returns an array of all data in a specific column
function filterData(dataArray, column) {
    return dataArray.map(result => result[column]);
}

// Returns all unique values in an array
function listUnique(dataArray) {
    // code to find the unique values
    let uniqueArray = [];
    dataArray.map(item => {
        if (uniqueArray.indexOf == -1) // If items does not excist yet in the array, then add it to the array.
        {
            uniqueArray.push(item);
        }
    })
    return uniqueArray;
}
// RESOURCE: code by Laurens - livecoding API


// compares two arrays and returns the values  that are present in array1 but not in array 2.
function compareArray(array1, array2) {
    // code below...
    return valuesOnlyPresentInArray1
}

// Returns the number of times a value is present in an Array
function countValuesInArray(valueArray, specificValue) {
    // code below...
    let count = 0;
    valueArray.forEach(item => {
        if (item == specificValue) {
            count += 1
        }
    })
    return count

    //to do: 
    // search in all items and count if there are more.
}