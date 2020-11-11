export function cleaningData(data){
      let prCapacity = getCapacity(data);
      let prCityArray = filterCity(data);
      let prDescription = filterData(data, 'description');
      let objectArray = wrap(prCityArray, prCapacity, prDescription);
      let randstadCities = selectRandstad(objectArray);
      let randstadClean = cleanRandStadData(randstadCities);
  		let cleanData = listUnique(randstadClean)
  return cleanData
}

export function combineDoubleCities(rsData) {
    let arr = rsData,
        result = [];

    arr.forEach(function (a) {
        if (!this[a.city]) {
            this[a.city] = {
                description: a.city,
                city: a.city,
                capacity: 0
            };
            result.push(this[a.city]);
        }
        this[a.city].capacity += a.capacity;
    }, Object.create(null));

    return result;
  
}



// returns array of objects with the right citynames
export function cleanRandStadData(rsData) {
    let delftClean = combineData(rsData, 'Delft');
    let dordrechtClean = combineData(delftClean, 'Dordrecht');
    let leidenClean = combineData(dordrechtClean, 'Leiden');
    let zaandamClean = combineData(leidenClean, 'Zaandam');
    let haarlemClean = combineData(zaandamClean, 'Haarlem');
    let utrechtClean = combineData(haarlemClean, 'Utrecht');
    let denHaagClean = combineData(utrechtClean, 'Den Haag');
    let rotterdamClean = combineData(denHaagClean, 'Rotterdam');
    let amsterdamClean = combineData(rotterdamClean, 'Amsterdam');

    let cleanData = [...amsterdamClean];

    let fixedCleanData = fixDescription(cleanData);

    return fixedCleanData;
    // console.log('fixed cities in randstad', amsterdamClean);
}


// returns an array with all data for ranstad cities
export function selectRandstad(objectArray) {

    let delftCities = filterRandstad(objectArray, 'Delft');
    let dordrechtCities = filterRandstad(objectArray, 'Dordrecht');
    let leidenCities = filterRandstad(objectArray, 'Leiden');
    let zaandamCities = filterRandstad(objectArray, 'Zaandam');
    let haarlemCities = filterRandstad(objectArray, 'Haarlem');
    let utrechtCities = filterRandstad(objectArray, 'Utrecht');
    let denHaagCities = filterRandstad(objectArray, 'Den Haag');
    let rotterdamCities = filterRandstad(objectArray, 'Rotterdam');
    let amsterdamCities = filterRandstad(objectArray, 'Amsterdam');

    let randstadCities = [...delftCities, ...dordrechtCities, ...leidenCities, ...zaandamCities, ...haarlemCities, ...utrechtCities, ...denHaagCities, ...rotterdamCities, ...amsterdamCities]
    // let randstadCities = [].concat(delftCities, dordrechtCities)
    // console.log('clean randstad city data', randstadCities)

    return randstadCities;

}

// returns an array of all the capicity for each parking area
export function getCapacity(prData) {
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
export function filterCity(prData) {
    // FIRST CITY NAME
    let accessPointDataArray = filterData(prData, 'accessPoints');
    let accessPointDataArrayClean = removeOuterArray(accessPointDataArray);
    let accessPointDataArrayFixed = fixEmptyValues(accessPointDataArrayClean);
    // console.log('fixed data array', accessPointDataArrayFixed);

    let accesPointAdress = filterData(accessPointDataArrayFixed, 'accessPointAddress')
    // console.log('adresses', accesPointAdress);

    let prCities = filterData(accesPointAdress, 'city')
    // console.log(prCities);

    // SECOND CITY NAME
    let operatorDataArray = filterData(prData, 'operator');
    // console.log('operator', operatorDataArray);
    let operatorCityName = filterData(operatorDataArray, 'name')
    // console.log('operator deep', operatorCityName);

    // BOTH NAMES IN 1 OBJECT
    let cityNameObject = wrapCity(prCities, operatorCityName)
    // console.log(cityNameObject);

    return cityNameObject
}


// FILTER DATA ON RANDSTAD CITIES
export function filterRandstad(prData, city) {
    let randstadData = prData.filter(array => {
        return array.cityFirst === city || array.citySecond === city;
    })
    return randstadData;
}


// returns an array of all data in a specific column
export function filterData(dataArray, column) {
    return dataArray.map(result => result[column]);
}


// removes outer array
export function removeOuterArray(prData) {
    return prData.map(result => result[0]);
}

export function fixEmptyValues(prData) {
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


// removes all items in array that do not have the key "name" in the object.
export function removeNoName(allData) {
    let newArray = allData.filter(obj => Object.keys(obj).includes("name"));
    return newArray
}
// Resource: https://stackoverflow.com/questions/51367551/how-to-remove-object-from-array-if-property-in-object-do-not-exist


export function wrap(city, capacity, description) {
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

export function wrapCity(cityNameOne, cityNameTwo) {
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

export function combineData(rsData, city) {
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
export function fixDescription(rsData) {
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