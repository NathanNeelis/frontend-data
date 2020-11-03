const endpointNS = 'https://gateway.apiportal.ns.nl/places-api/v2/places'



getNsData(endpointNS)
    .then(nsData => {
        // console.log('all NS station data', nsData[0].locations);
        console.log('all NS data', nsData);

        // ------------- Train stations ------------- 
        let trainStation = nsData[0].locations;

        // Station name
        let trainStationName = filterData(trainStation, 'name'); // Name of the train station

        // train station code
        let trainStationCode = filterData(trainStation, 'stationCode'); // Unique code for each train station

        // location train station
        let trainStationLongitudeArray = filterData(trainStation, 'lng'); // longitude train station
        let trainStationLatitudeArray = filterData(trainStation, 'lat'); // latitude train station
        let trainStationLocation = latLongCombine(trainStationLatitudeArray, trainStationLongitudeArray); // Array of lat + long combined
        let trainStationCountry = filterData(trainStation, 'land'); // all country codes
        let trainStationNL = filterCountryNL(trainStation); // all stations based in NL

        console.log('all train station data', trainStation);
        // console.log('all train station names', trainStationName);
        // console.log('all train station code', trainStationCode);
        console.log('train station location clean', trainStationLocation);
        console.log('all train station country:', trainStationCountry);
        console.log('train station in NL:', trainStationNL);


        // ------------- PR PAID PARKING AREAS ------------- 
        let prPaid = nsData[4].locations; // all PR paid location data

        // PR Name
        let prPaidName = filterData(prPaid, 'name'); // Name of the PR parking area

        // PR station code
        let prPaidStationCode = filterData(prPaid, 'stationCode'); // refers to closest train station

        // PR paid location data
        let prPaidLongitudeArray = filterData(prPaid, 'lng'); // longitude PR parking area
        let prPaidLatitudeArray = filterData(prPaid, 'lat'); // latitude PR parking area
        let prPaidLocation = latLongCombine(prPaidLatitudeArray, prPaidLongitudeArray); // Array of lat + long combined

        // PR paid rates
        let prPaidRates = filterData(prPaid, 'extra'); // ALL rates: Day rate regular, Hour rate regular, Day rate train passenger. + Total amount parking spaces
        let prPaidRegularDayRate = filterData(prPaidRates, 'Dagtarief regulier'); // Day rate regular parking
        let prPaidRegularHourRate = filterData(prPaidRates, 'Uurtarief regulier'); // Hourly rate regular parking
        let prPaidTrainPassengerRate = filterData(prPaidRates, 'Dagtarief treinreiziger'); // Day rate for a train passenger

        // PR parking spaces
        let prPaidTotalParkingSpots = filterData(prPaidRates, 'Aantal parkeerplaatsen'); // Total amount of parking spots in the PR parking area


        // console logs
        // console.log('all PR location data', prPaid);
        // console.log('PR Paid parking area names', prPaidName);
        // console.log('PR locations clean:', prPaidLocation);
        // console.log('PR Paid stationCode', prPaidStationCode);
        // console.log('PR Paid rates', prPaidRates);

        // console.log('PR Paid regular day rate', prPaidRegularDayRate);
        // console.log('PR Paid regular hour rate', prPaidRegularHourRate);
        // console.log('PR Paid train passenger rate', prPaidTrainPassengerRate);
        // console.log('PR Paid total parking spots', prPaidTotalParkingSpots);

    })


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








// SEPERATE FUNCTIONS TO CLEAN DATA ARRAYS

// returns an array of all data in a specific column
function filterData(dataArray, column) {
    return dataArray.map(result => result[column]);
}

// remove empty values
function removeEmptySlots(arr) {
    let cleanData = arr.filter(function (cleanData) {
        return cleanData != ''; // returns an Array without empty values.
    })
    return cleanData;
}

// returns all values that have the country equals to NL
function filterCountryNL(stations) {
    let countryNL = stations.filter(function (stationArray) {
        return stationArray.land === 'NL';
    })
    return countryNL;
}

// returns an array of latitude + longitude locations
function latLongCombine(latitudeArray, longitudeArray) {
    let locationArray = latitudeArray.map(function (latitude, index) {
        return [latitude, longitudeArray[index]];
    });
    return locationArray;

}
// Combining lat + long array
//Resource: https://stackoverflow.com/questions/47235728/how-to-merge-two-arrays-with-latitudes-and-longitudes-to-display-markers
















// CODE FROM LIVECODING BELOW

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