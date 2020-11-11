export function cleaningData(data) {
    let prCapacity = getCapacity(data); // Array with all capacity data
    let prCityArray = filterCity(data); // array with all city names
    let prDescription = filterData(data, 'description'); // array with descriptions
    let objectArray = wrap(prCityArray, prCapacity, prDescription); // combine capacity, cityname and description into one object
    let randstadCities = selectRandstad(objectArray); // array with all randstad city data
    let randstadClean = cleanRandStadData(randstadCities); // array transformed for data vis
    let cleanData = listUnique(randstadClean); // Array with unique data points
    return cleanData
}

// returns an array of objects with all data for each randstad city combined and capacity added up.
export function combineDoubleCities(rsData) {
    let arr = rsData,
        result = [];

    arr.forEach(function (a) {
        if (!this[a.city]) { // if the city name is not in the array yet, continue
            this[a.city] = { // create new object
                description: a.city, // Quickfix for showing right cityname at datavis. should be description normally
                city: a.city, // city name is city out of previous object
                capacity: 0 // sets capacity to starting point of 0
            };
            result.push(this[a.city]); // push object to new array
        }
        this[a.city].capacity += a.capacity; // adds the capacity
    }, Object.create(null));

    return result;

    // WINNING RESOURCE: https://stackoverflow.com/questions/38294781/how-to-merge-duplicates-in-an-array-of-objects-and-sum-a-specific-property
    // RESOURCE: https://stackoverflow.com/questions/60036060/combine-object-array-if-same-key-value-in-javascript
}



// returns array of objects with the right citynames
function cleanRandStadData(rsData) {
    let delftClean = combineData(rsData, 'Delft'); // Returns Array with objects that combines both citynames to 'Delft' if one of them is equal to 'Delft'
    let dordrechtClean = combineData(delftClean, 'Dordrecht'); // Returns Array with objects that combines both citynames to this cityname and adds it to the previous array.
    let leidenClean = combineData(dordrechtClean, 'Leiden'); // Returns Array with objects that combines both citynames to this cityname and adds it to the previous array.
    let zaandamClean = combineData(leidenClean, 'Zaandam'); // Returns Array with objects that combines both citynames to this cityname and adds it to the previous array.
    let haarlemClean = combineData(zaandamClean, 'Haarlem'); // Returns Array with objects that combines both citynames to this cityname and adds it to the previous array.
    let utrechtClean = combineData(haarlemClean, 'Utrecht'); // Returns Array with objects that combines both citynames to this cityname and adds it to the previous array.
    let denHaagClean = combineData(utrechtClean, 'Den Haag'); // Returns Array with objects that combines both citynames to this cityname and adds it to the previous array.
    let rotterdamClean = combineData(denHaagClean, 'Rotterdam'); // Returns Array with objects that combines both citynames to this cityname and adds it to the previous array.
    let amsterdamClean = combineData(rotterdamClean, 'Amsterdam'); // Returns Array with objects that combines both citynames to this cityname and adds it to the previous array.

    let cleanData = [...amsterdamClean]; // creates a new array with all objects from above.
    let fixedCleanData = fixDescription(cleanData); // if description is undefined it sets the description as P+R + city name.

    return fixedCleanData;
}


// returns an array with all data for ranstad cities
function selectRandstad(objectArray) {
    let delftCities = filterRandstad(objectArray, 'Delft'); // creates an array with all datapoints for the city 
    let dordrechtCities = filterRandstad(objectArray, 'Dordrecht'); // creates an array with all datapoints for the city 
    let leidenCities = filterRandstad(objectArray, 'Leiden'); // creates an array with all datapoints for the city 
    let zaandamCities = filterRandstad(objectArray, 'Zaandam'); // creates an array with all datapoints for the city 
    let haarlemCities = filterRandstad(objectArray, 'Haarlem'); // creates an array with all datapoints for the city 
    let utrechtCities = filterRandstad(objectArray, 'Utrecht'); // creates an array with all datapoints for the city 
    let denHaagCities = filterRandstad(objectArray, 'Den Haag'); // creates an array with all datapoints for the city 
    let rotterdamCities = filterRandstad(objectArray, 'Rotterdam'); // creates an array with all datapoints for the city 
    let amsterdamCities = filterRandstad(objectArray, 'Amsterdam'); // creates an array with all datapoints for the city 

    let randstadCities = [...delftCities, ...dordrechtCities, ...leidenCities, ...zaandamCities, ...haarlemCities, ...utrechtCities, ...denHaagCities, ...rotterdamCities, ...amsterdamCities]
    // creates a new array that include all arrays for randstad cities

    return randstadCities;
}

// returns an array of all the capicity for each parking area
function getCapacity(prData) {
    let prSpecifications = filterData(prData, 'specifications') // all specifications
    let prSpecificationClean = removeOuterArray(prSpecifications); // all specificiations without the outer array
    let prSPecificationFixed = fixEmptyValues(prSpecificationClean); // changes empty values to "0" 
    // TODO: write code to clean empty values to 'UNKNOWN' and then make the adding up the capicity data work.

    let prCapicity = filterData(prSPecificationFixed, 'capacity'); //  Array of capacity for each parking area
    return prCapicity;
}

// Returns an array of all cities
function filterCity(prData) {

    // FIRST CITY NAME in accessPoint data
    let accessPointDataArray = filterData(prData, 'accessPoints'); // Array with all accesPoint data 
    let accessPointDataArrayClean = removeOuterArray(accessPointDataArray); // Array with all accesPoint data without outer array
    let accessPointDataArrayFixed = fixEmptyValues(accessPointDataArrayClean); // Array with all missing values set to "0"
    // TODO: write code to clean empty values to 'UNKNOWN' and then make the adding up the capicity data work.

    let accesPointAdress = filterData(accessPointDataArrayFixed, 'accessPointAddress') // Array with all adress data
    let prCities = filterData(accesPointAdress, 'city') // Array with all city names

    // SECOND CITY NAME in operatorData 
    let operatorDataArray = filterData(prData, 'operator'); // Array of all operator data
    let operatorCityName = filterData(operatorDataArray, 'name') // Array of names in the operator data

    // BOTH NAMES IN 1 OBJECT
    let cityNameObject = wrapCity(prCities, operatorCityName) // Array with object with both city names

    return cityNameObject
}


// FILTER DATA ON RANDSTAD CITIES
function filterRandstad(prData, city) {
    let randstadData = prData.filter(array => {
        return array.cityFirst === city || array.citySecond === city; // return array if object city equals the giving city name
    })
    return randstadData;
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
        result[key] = 0;
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


// returns new object with city name, capacity and description in it.
function wrap(city, capacity, description) {
    let items = city.map((city, index) => {
        return {
            description: description[index],
            cityFirst: city.cityFirst,
            citySecond: city.citySecond,
            capacity: capacity[index]
        }
    });

    return items
}

// returns new object with both city names
function wrapCity(cityNameOne, cityNameTwo) {
    let cities = cityNameOne.map((city, index) => {
        return {
            cityFirst: city,
            citySecond: cityNameTwo[index]
        }
    });

    return cities
}
// RESOURCE https://stackoverflow.com/questions/40539591/how-to-create-an-array-of-objects-from-multiple-arrays


// This function checks if the city in the data is the same as the input city, 
// if so then it changes the object to city: city.
// instead of cityFirst and citySecond.
// It also checks if there already is a key "city" that contains data

function combineData(rsData, city) {
    let cleanData = rsData.map((data) => {
        if (data.cityFirst === city || data.citySecond === city) {
            // console.log('i am looking for', city)
            return {
                description: data.description,
                city: city, // REPLACES cityFirst and citySecond FOR CITY: CITY
                capacity: data.capacity // ADDS THE CAPACITY
            }
        } else if (data.city != undefined) {
            return {
                description: data.description,
                city: data.city, // CHECKS IF DATA.CITY ALREADY EXIST, IF SO RETURNS THE SAME DATA.
                capacity: data.capacity // ADDS CAPACITY
            }
        } else return { // IF THE ABOVE STATEMENT IS NOT SO, THEN RETURN THE SAME OBJECT AS BEFORE.
            description: data.description,
            cityFirst: data.cityFirst,
            citySecond: data.citySecond,
            capacity: data.capacity
        }
    })
    return cleanData;

    // DIT KAN WAARSCHIJNLIJK NOG WEL MOOIER MET EEN ARRAY VAN RANDSTAD CITIES DIE HIER LOOPT. MISSCHIEN VOOR LATER.
}


// If there is a undefined description it returns the description as 'P+R' + the city name
function fixDescription(rsData) {
    let cleanData = rsData.map((data) => {
        if (data.description === undefined) { // if description is undefined, change description to P+R + cityname
            return {
                description: 'P+R ' + data.city,
                city: data.city,
                capacity: data.capacity
            }
        } else return { // if description is valid, return object as normal.
            description: data.description,
            city: data.city,
            capacity: data.capacity
        }
    })
    return cleanData;

}

function listUnique(rsData) {
    const uniqueArray = rsData.filter((value, index) => {
        const keys = JSON.stringify(value);
        return index === rsData.findIndex(obj => {
            return JSON.stringify(obj) === keys;
        });
    });

    return uniqueArray;

    // Thanks to Eydrian @ stackoverflow
    // Resource: https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript

}