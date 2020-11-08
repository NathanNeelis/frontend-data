const endpointNPR = 'https://gist.githubusercontent.com/NathanNeelis/b28e16c0433b12da6bc716b276901ae9/raw/402754fa45924af802d06c5672043153bb990d5b/NPR_park_and_ride';

getData(endpointNPR)
    .then(prData => {
        console.log('all Park & ride data:', prData);

        let prCapacity = getCapacity(prData);
        console.log('All Capacities', prCapacity)

        let prCityArray = filterCity(prData);
        console.log('all cities', prCityArray);

    })

async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// returns an array of all the capicity for each parking area
function getCapacity(prData) {
    let prSpecifications = filterData(prData, 'specifications')
    // console.log('all specifications', prSpecifications);
    let prSpecificationClean = removeOuterArray(prSpecifications);
    // console.log('specifications', prSpecificationClean)
    let prSPecificationFixed = fixEmptyValues(prSpecificationClean);
    // console.log('testing', prSPecificationFixed);
    let prCapicity = filterData(prSPecificationFixed, 'capacity');
    // console.log('capacity each garage', prCapicity);

    return prCapicity;

}

// Returns an array of all cities
function filterCity(prData) {
    let operatorDataArray = filterData(prData, 'operator');
    let operatorCityName = filterData(operatorDataArray, 'name')
    return operatorCityName
}

// returns an array of all data in a specific column
function filterData(dataArray, column) {
    return dataArray.map(result => result[column]);
}


// removes outer array
function removeOuterArray(prData) {
    return prData.map(result => result[0]);
}

function fixEmptyValues(prData) {
    // Create an object with all the keys in it
    // This will return one object containing all keys the items
    let obj = prData.reduce((res, item) => ({
        ...res,
        ...item
    }));
    // console.log('nieuw object', obj);

    // Get those keys as an array
    let keys = Object.keys(obj);
    // console.log('all object keys', keys)

    // Create an object with all keys set to the default value ('UNKNOWN')
    let def = keys.reduce((result, key) => {
        result[key] = 'UNKNOWN'
        return result;
    }, {});
    // console.log('All keys with a UNKOWN value', def);

    // Use object destrucuring to replace all default values with the ones we have
    let result = prData.map((item) => ({
        ...def,
        ...item
    }));

    // console.log('adds all values that we have to replace the 0 values', result)

    return result

    // CREDITS FOR user184994 @ stackoverflow
    // AMAZING RESOURCE: https://stackoverflow.com/questions/47870887/how-to-fill-in-missing-keys-in-an-array-of-objects
}


// removes all items in array that do not have the key "name" in the object.
function removeNoName(allData) {
    let newArray = allData.filter(obj => Object.keys(obj).includes("name"));
    return newArray
}
// Resource: https://stackoverflow.com/questions/51367551/how-to-remove-object-from-array-if-property-in-object-do-not-exist