const endpointNPR = 'https://gist.githubusercontent.com/NathanNeelis/b28e16c0433b12da6bc716b276901ae9/raw/402754fa45924af802d06c5672043153bb990d5b/NPR_park_and_ride';

getData(endpointNPR)
    .then(prData => {
        console.log('all Park & ride data:', prData);

        let prCapacity = getCapacity(prData);
        // console.log('All Capacities', prCapacity)

        // FIX THIS ONE -- to realy citiname
        let prCityArray = filterCity(prData);
        // console.log('all cities', prCityArray);

        let objectArray = wrap(prCityArray, prCapacity);
        // console.log('new object', objectArray);

        // let tarifArray = getRate(prData); // RATES TO DO LATER

        // ARRAY WITH DATA OBJECT FOR RANDSTAND CITIES
        // randstad cities; Delft, Dordrecht, Leiden, Zaanstad, Haarlem, Utrecht, Den Haag, Rotterdam, Amsterdam
        let randstadCities = selectRandstad(objectArray);
        console.log('testing randstad cities', randstadCities);

        // clean the randstad cities.
        // combine the data if city name is the same and add capacity.
        let randstadClean = cleanRandStadData(randstadCities);
        console.log('randstad cities', randstadClean)

        let combine = combineDoubleCities(randstadClean);
        console.log(typeof combine)
        console.log('randstad fixed', combine);


    })

async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function combineDoubleCities(rsData) {

    // let combinedData = rsData.map((data) => {
    //     if (data.city === data.city) {
    //         return {
    //             city: data.city,
    //             capacity: data.capacity + data.capacity
    //         }

    //     }
    // })
    // console.log('test test test', combinedData)


    // let combinedData = obj.reduce((a, v) => {
    //     if (a[v.city]) {
    //         a[v.city].capacity = a[v.city].capacity + v.capacity
    //         // console.log('andere data', a[v.city].capacity = a[v.city].capacity + v.capacity)
    //     } else {
    //         a[v.city] = v
    //         // console.log('dit is v', v)
    //     }
    //     // console.log('dit is a', a)
    //     return a

    // }, [])
    // console.log('test combining', combinedData);
    // return combinedData

    let arr = rsData,
        result = [];

    arr.forEach(function (a) {
        if (!this[a.city]) {
            this[a.city] = {
                city: a.city,
                capacity: 0
            };
            result.push(this[a.city]);
        }
        this[a.city].capacity += a.capacity;
    }, Object.create(null));

    return result;

    // WINNING RESOURCE: https://stackoverflow.com/questions/38294781/how-to-merge-duplicates-in-an-array-of-objects-and-sum-a-specific-property
    // RESOURCE: https://stackoverflow.com/questions/60036060/combine-object-array-if-same-key-value-in-javascript
}

// returns array of objects with the right citynames
function cleanRandStadData(rsData) {
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

    return cleanData;
    // console.log('fixed cities in randstad', amsterdamClean);
}





// returns an array with all data for ranstad cities
function selectRandstad(objectArray) {

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

// // RATES FOR PR AREAS
// function getRate(prData) {
//     let tariffsData = filterData(prData, 'tariffs')
//     console.log('tarifs Data', tariffsData)

//     let tariffsDataClean = wrapRates(tariffsData);
//     console.log('found rate', tariffsDataClean);

//     console.log('finding rate', tariffsData[0][0].intervalRates[0].charge)


// }

// FILTER DATA ON RANDSTAD CITIES
function filterRandstad(prData, city) {
    let randstadData = prData.filter(array => {
        return array.cityFirst === city || array.citySecond === city;
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


// removes all items in array that do not have the key "name" in the object.
function removeNoName(allData) {
    let newArray = allData.filter(obj => Object.keys(obj).includes("name"));
    return newArray
}
// Resource: https://stackoverflow.com/questions/51367551/how-to-remove-object-from-array-if-property-in-object-do-not-exist


function wrap(city, capacity) {
    let items = city.map((city, index) => {
        return {
            cityFirst: city.cityFirst,
            citySecond: city.citySecond,
            capacity: capacity[index]
        }
    });

    return items
}

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
                city: city, // REPLACES cityFirst and citySecond FOR CITY: CITY
                capacity: data.capacity // ADDS THE CAPACITY
            }
        } else if (data.city != undefined) {
            return {
                city: data.city, // CHECKS IF DATA.CITY ALREADY EXIST, IF SO RETURNS THE SAME DATA.
                capacity: data.capacity // ADDS CAPACITY
            }
        } else return { // IF THE ABOVE STATEMENT IS NOT SO, THEN RETURN THE SAME OBJECT AS BEFORE.
            cityFirst: data.cityFirst,
            citySecond: data.citySecond,
            capacity: data.capacity
        }
    })
    return cleanData;

    // DIT KAN WAARSCHIJNLIJK NOG WEL MOOIER MET EEN ARRAY VAN RANDSTAD CITIES DIE HIER LOOPT. MISSCHIEN VOOR LATER.
}