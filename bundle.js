(function (d3) {
  'use strict';

  function cleaningData(data){
        let prCapacity = getCapacity(data);
        let prCityArray = filterCity(data);
        let prDescription = filterData(data, 'description');
        let objectArray = wrap(prCityArray, prCapacity, prDescription);
        let randstadCities = selectRandstad(objectArray);
        let randstadClean = cleanRandStadData(randstadCities);
    		let cleanData = listUnique(randstadClean);
    return cleanData
  }

  function combineDoubleCities(rsData) {
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

      let fixedCleanData = fixDescription(cleanData);

      return fixedCleanData;
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

      let randstadCities = [...delftCities, ...dordrechtCities, ...leidenCities, ...zaandamCities, ...haarlemCities, ...utrechtCities, ...denHaagCities, ...rotterdamCities, ...amsterdamCities];
      // let randstadCities = [].concat(delftCities, dordrechtCities)
      // console.log('clean randstad city data', randstadCities)

      return randstadCities;

  }

  // returns an array of all the capicity for each parking area
  function getCapacity(prData) {
      let prSpecifications = filterData(prData, 'specifications');
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

      let accesPointAdress = filterData(accessPointDataArrayFixed, 'accessPointAddress');
      // console.log('adresses', accesPointAdress);

      let prCities = filterData(accesPointAdress, 'city');
      // console.log(prCities);

      // SECOND CITY NAME
      let operatorDataArray = filterData(prData, 'operator');
      // console.log('operator', operatorDataArray);
      let operatorCityName = filterData(operatorDataArray, 'name');
      // console.log('operator deep', operatorCityName);

      // BOTH NAMES IN 1 OBJECT
      let cityNameObject = wrapCity(prCities, operatorCityName);
      // console.log(cityNameObject);

      return cityNameObject
  }


  // FILTER DATA ON RANDSTAD CITIES
  function filterRandstad(prData, city) {
      let randstadData = prData.filter(array => {
          return array.cityFirst === city || array.citySecond === city;
      });
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
  // Resource: https://stackoverflow.com/questions/51367551/how-to-remove-object-from-array-if-property-in-object-do-not-exist


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
      });
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
      });
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

  // variables
  const svg = d3.select('svg');

  const height = +(svg.attr('height'));
  const width = +(svg.attr('width'));

  const xValue = d => d.description;
  const xAxisLabel = '';
    
  const yValue = d => d.capacity;
  const yAxisLabel = 'Capacity';
    
  const margin = { top: 10, right: 120, bottom: 230, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const yScale = d3.scaleLinear();
  const xScale = d3.scaleBand();

  const g = svg.append('g')
    	.attr('transform', `translate(${margin.left}, ${margin.top})`);


  // exporting functions

  function setupScales(data){
        yScale
          .domain([d3.max(data, yValue), 0])
          .range([0, innerHeight])
          .nice();

        xScale
          .domain(data.map(xValue))
          .range([0, innerWidth])
          .padding(0.2); 
      }

  function setupAxis(data){
    const yAxis = d3.axisLeft(yScale)
    	.tickSize(-innerWidth);
    		// .tickFormat(format('.1s')); // changing 7.000 to 7k
    const xAxis = d3.axisBottom(xScale);

    
    // y Axis GROUPI G
    const yAxisG = g.append('g').call(yAxis);
    
    yAxisG
    .selectAll('.domain') // removing Y axis line and ticks
    		.remove();
    
    yAxisG.append('text') // Y LABEL
    	.attr('class', 'axis-label')
    	.attr('y', -50)
    	.attr('x', -innerHeight / 2)
    	.attr('fill', 'black')
    	.attr('transform', `rotate(-90)`)  // ROTATING Y LABEL
    	.attr('text-anchor', 'middle')
    	.text(yAxisLabel);
    
    yAxisG
    	.attr('class', 'axis-y');
    	
    
    // x Axis GROUPING
    const xAxisG = g.append('g').call(xAxis);
    
    xAxisG
    .attr('transform', `translate(0, ${innerHeight})`)
    .attr('class', 'axis-x')
      .selectAll("text")
            .attr("transform", `rotate(50)`)
    				.attr('text-anchor', 'start')
            .attr('x', 10)
    				.attr('y', 5)
            // .attr("dy", 10)
    	.selectAll('.domain, .tick line') // removing X axis line and ticks
    		.remove();
    xAxisG.append('text') // X AS LABEL
    	.attr('class', 'axis-label')
    	.attr('x', innerWidth / 2)
    	.attr('y', 60)
    	.attr('fill', 'black')
    	.text(xAxisLabel);
    }

  function drawBars(data){
    g.selectAll('.bar')
    	.data(data)
    	.enter()
    		.append('rect')
    			.attr('class', 'bar')
    			.attr('x', d => xScale(xValue(d)))
    			.attr('y', d => yScale(yValue(d)))
    			.attr('width', xScale.bandwidth())
    
    			.attr("y", function(d) {
      			return yScale(0);
      			})
          .attr("height", 0)
          .transition().duration(1000)
          .attr('y', d => yScale(yValue(d)))
          .attr('height', d => innerHeight - yScale(yValue(d)));

    // add title, Done this now in the HTML with a H1
    // g.append('text')
    // 	.attr('y', -30)
    // 	.attr('class', 'title')
    // 	.text(title)
    }


  function setupInput(data){
   // &CREDITS code example by Laurens
    const input = d3.select('input')
    		.on("click", () => changeOutput(data));
  }

  function changeOutput(data){
    
    // const dataSelection = filterOn? prDataSet.filter(parking => parking.capacity) : data
    const dataSelection = d3.select('input').property('checked') ? combineDoubleCities(data) : data;

    console.log('new data', dataSelection);
    
    //Update the domains
    yScale
    .domain([d3.max(dataSelection, yValue), 0])
    .nice();

    xScale
    .domain(dataSelection.map(xValue));

    
    //Bars will store all bars created so far
    //$CREDITS ==  Code example by LAURENS 
    const bars = g.selectAll('.bar')
    	.data(dataSelection);
    
    
    // update
    bars
    	.attr('y', d => yScale(yValue(d)))
      .attr('x', d => xScale(xValue(d)))
    	.attr('width', xScale.bandwidth())
    
      .attr("y", function(d) {
      	return yScale(0);
      	})
    	.attr("height", 0)
    	.transition().duration(1000)
    	.attr('y', d => yScale(yValue(d)))
    	.attr('height', d => innerHeight - yScale(yValue(d)));
    // console.log('data at update point', dataSelection)
   
    
    //Enter
    bars.enter()
    		.append('rect')
    			.attr('class', 'bar')
    			.attr('x', d => xScale(xValue(d)))
    			.attr('y', d => yScale(yValue(d)))
    			.attr('width', xScale.bandwidth())
        
      	.attr("y", function(d) {
      	return yScale(0);
      	})
        .attr("height", 0)
        .transition().duration(1000)
        .attr('y', d => yScale(yValue(d)))
        .attr("height", d => innerHeight - yScale(yValue(d)));

    		// RESOURCE BARS FROM BOTTOM TO TOP:
    		// RESOURCE: https://stackoverflow.com/questions/36126004/height-transitions-go-from-top-down-rather-than-from-bottom-up-in-d3
    
    //Exit
    bars.exit()
    		.remove();

    //Update the ticks	
      svg.select('.axis-x')
        .call(d3.axisBottom(xScale))
      	.attr('transform', `translate(0, ${innerHeight})`)
    		.selectAll("text")
            .attr("transform", `rotate(50)`)
    				.attr('text-anchor', 'start')
            .attr('x', 10)
    				.attr('y', 5);
    	svg.select('.axis-y')
        .call(d3.axisLeft(yScale).tickSize(-innerWidth))
  			  .selectAll('.domain') // removing Y axis line and ticks
    			.remove();
    	
  }

  const endpointNPR = 'https://gist.githubusercontent.com/NathanNeelis/b28e16c0433b12da6bc716b276901ae9/raw/402754fa45924af802d06c5672043153bb990d5b/NPR_park_and_ride';

  makeVisualization();
  async function makeVisualization(){
    getData(endpointNPR)
        .then(data => {
      
      	let prData = cleaningData(data);
        let combine = combineDoubleCities(prData);

        console.log('all P+R', data);
        console.log('P+R for each city', combine);
      	
      	setupScales(prData); // import from visual
      	setupAxis(); // import from visual
      	drawBars(prData); // import from visual
      	setupInput(prData); // import from visual
    });
  }

  async function getData(url) {
      const response = await fetch(url);
      const data = await response.json();
      return data;
  }

}(d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbInRyYW5zZm9ybS5qcyIsInZpc3VhbC5qcyIsImluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBjbGVhbmluZ0RhdGEoZGF0YSl7XG4gICAgICBsZXQgcHJDYXBhY2l0eSA9IGdldENhcGFjaXR5KGRhdGEpO1xuICAgICAgbGV0IHByQ2l0eUFycmF5ID0gZmlsdGVyQ2l0eShkYXRhKTtcbiAgICAgIGxldCBwckRlc2NyaXB0aW9uID0gZmlsdGVyRGF0YShkYXRhLCAnZGVzY3JpcHRpb24nKTtcbiAgICAgIGxldCBvYmplY3RBcnJheSA9IHdyYXAocHJDaXR5QXJyYXksIHByQ2FwYWNpdHksIHByRGVzY3JpcHRpb24pO1xuICAgICAgbGV0IHJhbmRzdGFkQ2l0aWVzID0gc2VsZWN0UmFuZHN0YWQob2JqZWN0QXJyYXkpO1xuICAgICAgbGV0IHJhbmRzdGFkQ2xlYW4gPSBjbGVhblJhbmRTdGFkRGF0YShyYW5kc3RhZENpdGllcyk7XG4gIFx0XHRsZXQgY2xlYW5EYXRhID0gbGlzdFVuaXF1ZShyYW5kc3RhZENsZWFuKVxuICByZXR1cm4gY2xlYW5EYXRhXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lRG91YmxlQ2l0aWVzKHJzRGF0YSkge1xuICAgIGxldCBhcnIgPSByc0RhdGEsXG4gICAgICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgYXJyLmZvckVhY2goZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgaWYgKCF0aGlzW2EuY2l0eV0pIHtcbiAgICAgICAgICAgIHRoaXNbYS5jaXR5XSA9IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYS5jaXR5LFxuICAgICAgICAgICAgICAgIGNpdHk6IGEuY2l0eSxcbiAgICAgICAgICAgICAgICBjYXBhY2l0eTogMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXNbYS5jaXR5XSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpc1thLmNpdHldLmNhcGFjaXR5ICs9IGEuY2FwYWNpdHk7XG4gICAgfSwgT2JqZWN0LmNyZWF0ZShudWxsKSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICBcbn1cblxuXG5cbi8vIHJldHVybnMgYXJyYXkgb2Ygb2JqZWN0cyB3aXRoIHRoZSByaWdodCBjaXR5bmFtZXNcbmV4cG9ydCBmdW5jdGlvbiBjbGVhblJhbmRTdGFkRGF0YShyc0RhdGEpIHtcbiAgICBsZXQgZGVsZnRDbGVhbiA9IGNvbWJpbmVEYXRhKHJzRGF0YSwgJ0RlbGZ0Jyk7XG4gICAgbGV0IGRvcmRyZWNodENsZWFuID0gY29tYmluZURhdGEoZGVsZnRDbGVhbiwgJ0RvcmRyZWNodCcpO1xuICAgIGxldCBsZWlkZW5DbGVhbiA9IGNvbWJpbmVEYXRhKGRvcmRyZWNodENsZWFuLCAnTGVpZGVuJyk7XG4gICAgbGV0IHphYW5kYW1DbGVhbiA9IGNvbWJpbmVEYXRhKGxlaWRlbkNsZWFuLCAnWmFhbmRhbScpO1xuICAgIGxldCBoYWFybGVtQ2xlYW4gPSBjb21iaW5lRGF0YSh6YWFuZGFtQ2xlYW4sICdIYWFybGVtJyk7XG4gICAgbGV0IHV0cmVjaHRDbGVhbiA9IGNvbWJpbmVEYXRhKGhhYXJsZW1DbGVhbiwgJ1V0cmVjaHQnKTtcbiAgICBsZXQgZGVuSGFhZ0NsZWFuID0gY29tYmluZURhdGEodXRyZWNodENsZWFuLCAnRGVuIEhhYWcnKTtcbiAgICBsZXQgcm90dGVyZGFtQ2xlYW4gPSBjb21iaW5lRGF0YShkZW5IYWFnQ2xlYW4sICdSb3R0ZXJkYW0nKTtcbiAgICBsZXQgYW1zdGVyZGFtQ2xlYW4gPSBjb21iaW5lRGF0YShyb3R0ZXJkYW1DbGVhbiwgJ0Ftc3RlcmRhbScpO1xuXG4gICAgbGV0IGNsZWFuRGF0YSA9IFsuLi5hbXN0ZXJkYW1DbGVhbl07XG5cbiAgICBsZXQgZml4ZWRDbGVhbkRhdGEgPSBmaXhEZXNjcmlwdGlvbihjbGVhbkRhdGEpO1xuXG4gICAgcmV0dXJuIGZpeGVkQ2xlYW5EYXRhO1xuICAgIC8vIGNvbnNvbGUubG9nKCdmaXhlZCBjaXRpZXMgaW4gcmFuZHN0YWQnLCBhbXN0ZXJkYW1DbGVhbik7XG59XG5cblxuLy8gcmV0dXJucyBhbiBhcnJheSB3aXRoIGFsbCBkYXRhIGZvciByYW5zdGFkIGNpdGllc1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdFJhbmRzdGFkKG9iamVjdEFycmF5KSB7XG5cbiAgICBsZXQgZGVsZnRDaXRpZXMgPSBmaWx0ZXJSYW5kc3RhZChvYmplY3RBcnJheSwgJ0RlbGZ0Jyk7XG4gICAgbGV0IGRvcmRyZWNodENpdGllcyA9IGZpbHRlclJhbmRzdGFkKG9iamVjdEFycmF5LCAnRG9yZHJlY2h0Jyk7XG4gICAgbGV0IGxlaWRlbkNpdGllcyA9IGZpbHRlclJhbmRzdGFkKG9iamVjdEFycmF5LCAnTGVpZGVuJyk7XG4gICAgbGV0IHphYW5kYW1DaXRpZXMgPSBmaWx0ZXJSYW5kc3RhZChvYmplY3RBcnJheSwgJ1phYW5kYW0nKTtcbiAgICBsZXQgaGFhcmxlbUNpdGllcyA9IGZpbHRlclJhbmRzdGFkKG9iamVjdEFycmF5LCAnSGFhcmxlbScpO1xuICAgIGxldCB1dHJlY2h0Q2l0aWVzID0gZmlsdGVyUmFuZHN0YWQob2JqZWN0QXJyYXksICdVdHJlY2h0Jyk7XG4gICAgbGV0IGRlbkhhYWdDaXRpZXMgPSBmaWx0ZXJSYW5kc3RhZChvYmplY3RBcnJheSwgJ0RlbiBIYWFnJyk7XG4gICAgbGV0IHJvdHRlcmRhbUNpdGllcyA9IGZpbHRlclJhbmRzdGFkKG9iamVjdEFycmF5LCAnUm90dGVyZGFtJyk7XG4gICAgbGV0IGFtc3RlcmRhbUNpdGllcyA9IGZpbHRlclJhbmRzdGFkKG9iamVjdEFycmF5LCAnQW1zdGVyZGFtJyk7XG5cbiAgICBsZXQgcmFuZHN0YWRDaXRpZXMgPSBbLi4uZGVsZnRDaXRpZXMsIC4uLmRvcmRyZWNodENpdGllcywgLi4ubGVpZGVuQ2l0aWVzLCAuLi56YWFuZGFtQ2l0aWVzLCAuLi5oYWFybGVtQ2l0aWVzLCAuLi51dHJlY2h0Q2l0aWVzLCAuLi5kZW5IYWFnQ2l0aWVzLCAuLi5yb3R0ZXJkYW1DaXRpZXMsIC4uLmFtc3RlcmRhbUNpdGllc11cbiAgICAvLyBsZXQgcmFuZHN0YWRDaXRpZXMgPSBbXS5jb25jYXQoZGVsZnRDaXRpZXMsIGRvcmRyZWNodENpdGllcylcbiAgICAvLyBjb25zb2xlLmxvZygnY2xlYW4gcmFuZHN0YWQgY2l0eSBkYXRhJywgcmFuZHN0YWRDaXRpZXMpXG5cbiAgICByZXR1cm4gcmFuZHN0YWRDaXRpZXM7XG5cbn1cblxuLy8gcmV0dXJucyBhbiBhcnJheSBvZiBhbGwgdGhlIGNhcGljaXR5IGZvciBlYWNoIHBhcmtpbmcgYXJlYVxuZXhwb3J0IGZ1bmN0aW9uIGdldENhcGFjaXR5KHByRGF0YSkge1xuICAgIGxldCBwclNwZWNpZmljYXRpb25zID0gZmlsdGVyRGF0YShwckRhdGEsICdzcGVjaWZpY2F0aW9ucycpXG4gICAgLy8gY29uc29sZS5sb2coJ2FsbCBzcGVjaWZpY2F0aW9ucycsIHByU3BlY2lmaWNhdGlvbnMpO1xuXG4gICAgbGV0IHByU3BlY2lmaWNhdGlvbkNsZWFuID0gcmVtb3ZlT3V0ZXJBcnJheShwclNwZWNpZmljYXRpb25zKTtcbiAgICAvLyBjb25zb2xlLmxvZygnc3BlY2lmaWNhdGlvbnMnLCBwclNwZWNpZmljYXRpb25DbGVhbilcblxuICAgIGxldCBwclNQZWNpZmljYXRpb25GaXhlZCA9IGZpeEVtcHR5VmFsdWVzKHByU3BlY2lmaWNhdGlvbkNsZWFuKTtcbiAgICAvLyBjb25zb2xlLmxvZygndGVzdGluZycsIHByU1BlY2lmaWNhdGlvbkZpeGVkKTtcbiAgICBsZXQgcHJDYXBpY2l0eSA9IGZpbHRlckRhdGEocHJTUGVjaWZpY2F0aW9uRml4ZWQsICdjYXBhY2l0eScpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdjYXBhY2l0eSBlYWNoIGdhcmFnZScsIHByQ2FwaWNpdHkpO1xuXG4gICAgcmV0dXJuIHByQ2FwaWNpdHk7XG5cbn1cblxuLy8gUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgY2l0aWVzXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyQ2l0eShwckRhdGEpIHtcbiAgICAvLyBGSVJTVCBDSVRZIE5BTUVcbiAgICBsZXQgYWNjZXNzUG9pbnREYXRhQXJyYXkgPSBmaWx0ZXJEYXRhKHByRGF0YSwgJ2FjY2Vzc1BvaW50cycpO1xuICAgIGxldCBhY2Nlc3NQb2ludERhdGFBcnJheUNsZWFuID0gcmVtb3ZlT3V0ZXJBcnJheShhY2Nlc3NQb2ludERhdGFBcnJheSk7XG4gICAgbGV0IGFjY2Vzc1BvaW50RGF0YUFycmF5Rml4ZWQgPSBmaXhFbXB0eVZhbHVlcyhhY2Nlc3NQb2ludERhdGFBcnJheUNsZWFuKTtcbiAgICAvLyBjb25zb2xlLmxvZygnZml4ZWQgZGF0YSBhcnJheScsIGFjY2Vzc1BvaW50RGF0YUFycmF5Rml4ZWQpO1xuXG4gICAgbGV0IGFjY2VzUG9pbnRBZHJlc3MgPSBmaWx0ZXJEYXRhKGFjY2Vzc1BvaW50RGF0YUFycmF5Rml4ZWQsICdhY2Nlc3NQb2ludEFkZHJlc3MnKVxuICAgIC8vIGNvbnNvbGUubG9nKCdhZHJlc3NlcycsIGFjY2VzUG9pbnRBZHJlc3MpO1xuXG4gICAgbGV0IHByQ2l0aWVzID0gZmlsdGVyRGF0YShhY2Nlc1BvaW50QWRyZXNzLCAnY2l0eScpXG4gICAgLy8gY29uc29sZS5sb2cocHJDaXRpZXMpO1xuXG4gICAgLy8gU0VDT05EIENJVFkgTkFNRVxuICAgIGxldCBvcGVyYXRvckRhdGFBcnJheSA9IGZpbHRlckRhdGEocHJEYXRhLCAnb3BlcmF0b3InKTtcbiAgICAvLyBjb25zb2xlLmxvZygnb3BlcmF0b3InLCBvcGVyYXRvckRhdGFBcnJheSk7XG4gICAgbGV0IG9wZXJhdG9yQ2l0eU5hbWUgPSBmaWx0ZXJEYXRhKG9wZXJhdG9yRGF0YUFycmF5LCAnbmFtZScpXG4gICAgLy8gY29uc29sZS5sb2coJ29wZXJhdG9yIGRlZXAnLCBvcGVyYXRvckNpdHlOYW1lKTtcblxuICAgIC8vIEJPVEggTkFNRVMgSU4gMSBPQkpFQ1RcbiAgICBsZXQgY2l0eU5hbWVPYmplY3QgPSB3cmFwQ2l0eShwckNpdGllcywgb3BlcmF0b3JDaXR5TmFtZSlcbiAgICAvLyBjb25zb2xlLmxvZyhjaXR5TmFtZU9iamVjdCk7XG5cbiAgICByZXR1cm4gY2l0eU5hbWVPYmplY3Rcbn1cblxuXG4vLyBGSUxURVIgREFUQSBPTiBSQU5EU1RBRCBDSVRJRVNcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJSYW5kc3RhZChwckRhdGEsIGNpdHkpIHtcbiAgICBsZXQgcmFuZHN0YWREYXRhID0gcHJEYXRhLmZpbHRlcihhcnJheSA9PiB7XG4gICAgICAgIHJldHVybiBhcnJheS5jaXR5Rmlyc3QgPT09IGNpdHkgfHwgYXJyYXkuY2l0eVNlY29uZCA9PT0gY2l0eTtcbiAgICB9KVxuICAgIHJldHVybiByYW5kc3RhZERhdGE7XG59XG5cblxuLy8gcmV0dXJucyBhbiBhcnJheSBvZiBhbGwgZGF0YSBpbiBhIHNwZWNpZmljIGNvbHVtblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckRhdGEoZGF0YUFycmF5LCBjb2x1bW4pIHtcbiAgICByZXR1cm4gZGF0YUFycmF5Lm1hcChyZXN1bHQgPT4gcmVzdWx0W2NvbHVtbl0pO1xufVxuXG5cbi8vIHJlbW92ZXMgb3V0ZXIgYXJyYXlcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVPdXRlckFycmF5KHByRGF0YSkge1xuICAgIHJldHVybiBwckRhdGEubWFwKHJlc3VsdCA9PiByZXN1bHRbMF0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZml4RW1wdHlWYWx1ZXMocHJEYXRhKSB7XG4gICAgLy8gQ3JlYXRlIGFuIG9iamVjdCB3aXRoIGFsbCB0aGUga2V5cyBpbiBpdFxuICAgIC8vIFRoaXMgd2lsbCByZXR1cm4gb25lIG9iamVjdCBjb250YWluaW5nIGFsbCBrZXlzIHRoZSBpdGVtc1xuICAgIGxldCBvYmogPSBwckRhdGEucmVkdWNlKChyZXMsIGl0ZW0pID0+ICh7XG4gICAgICAgIC4uLnJlcyxcbiAgICAgICAgLi4uaXRlbVxuICAgIH0pKTtcbiAgICAvLyBjb25zb2xlLmxvZygnbmlldXcgb2JqZWN0Jywgb2JqKTtcblxuICAgIC8vIEdldCB0aG9zZSBrZXlzIGFzIGFuIGFycmF5XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgIC8vIGNvbnNvbGUubG9nKCdhbGwgb2JqZWN0IGtleXMnLCBrZXlzKVxuXG4gICAgLy8gQ3JlYXRlIGFuIG9iamVjdCB3aXRoIGFsbCBrZXlzIHNldCB0byB0aGUgZGVmYXVsdCB2YWx1ZSAoJ1VOS05PV04nKVxuICAgIGxldCBkZWYgPSBrZXlzLnJlZHVjZSgocmVzdWx0LCBrZXkpID0+IHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSAwO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sIHt9KTtcbiAgICAvLyBjb25zb2xlLmxvZygnQWxsIGtleXMgd2l0aCBhIFVOS09XTiB2YWx1ZScsIGRlZik7XG5cbiAgICAvLyBVc2Ugb2JqZWN0IGRlc3RydWN1cmluZyB0byByZXBsYWNlIGFsbCBkZWZhdWx0IHZhbHVlcyB3aXRoIHRoZSBvbmVzIHdlIGhhdmVcbiAgICBsZXQgcmVzdWx0ID0gcHJEYXRhLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgLi4uZGVmLFxuICAgICAgICAuLi5pdGVtXG4gICAgfSkpO1xuXG4gICAgLy8gY29uc29sZS5sb2coJ2FkZHMgYWxsIHZhbHVlcyB0aGF0IHdlIGhhdmUgdG8gcmVwbGFjZSB0aGUgMCB2YWx1ZXMnLCByZXN1bHQpXG5cbiAgICByZXR1cm4gcmVzdWx0XG5cbiAgICAvLyBDUkVESVRTIEZPUiB1c2VyMTg0OTk0IEAgc3RhY2tvdmVyZmxvd1xuICAgIC8vIEFNQVpJTkcgUkVTT1VSQ0U6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ3ODcwODg3L2hvdy10by1maWxsLWluLW1pc3Npbmcta2V5cy1pbi1hbi1hcnJheS1vZi1vYmplY3RzXG59XG5cblxuLy8gcmVtb3ZlcyBhbGwgaXRlbXMgaW4gYXJyYXkgdGhhdCBkbyBub3QgaGF2ZSB0aGUga2V5IFwibmFtZVwiIGluIHRoZSBvYmplY3QuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlTm9OYW1lKGFsbERhdGEpIHtcbiAgICBsZXQgbmV3QXJyYXkgPSBhbGxEYXRhLmZpbHRlcihvYmogPT4gT2JqZWN0LmtleXMob2JqKS5pbmNsdWRlcyhcIm5hbWVcIikpO1xuICAgIHJldHVybiBuZXdBcnJheVxufVxuLy8gUmVzb3VyY2U6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxMzY3NTUxL2hvdy10by1yZW1vdmUtb2JqZWN0LWZyb20tYXJyYXktaWYtcHJvcGVydHktaW4tb2JqZWN0LWRvLW5vdC1leGlzdFxuXG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwKGNpdHksIGNhcGFjaXR5LCBkZXNjcmlwdGlvbikge1xuICAgIGxldCBpdGVtcyA9IGNpdHkubWFwKChjaXR5LCBpbmRleCkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFx0ZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uW2luZGV4XSxcbiAgICAgICAgICAgIGNpdHlGaXJzdDogY2l0eS5jaXR5Rmlyc3QsXG4gICAgICAgICAgICBjaXR5U2Vjb25kOiBjaXR5LmNpdHlTZWNvbmQsXG4gICAgICAgICAgICBjYXBhY2l0eTogY2FwYWNpdHlbaW5kZXhdXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBpdGVtc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JhcENpdHkoY2l0eU5hbWVPbmUsIGNpdHlOYW1lVHdvKSB7XG4gICAgbGV0IGNpdGllcyA9IGNpdHlOYW1lT25lLm1hcCgoY2l0eSwgaW5kZXgpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNpdHlGaXJzdDogY2l0eSxcbiAgICAgICAgICAgIGNpdHlTZWNvbmQ6IGNpdHlOYW1lVHdvW2luZGV4XVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY2l0aWVzXG59XG4vLyBSRVNPVVJDRSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80MDUzOTU5MS9ob3ctdG8tY3JlYXRlLWFuLWFycmF5LW9mLW9iamVjdHMtZnJvbS1tdWx0aXBsZS1hcnJheXNcblxuXG4vLyBUaGlzIGZ1bmN0aW9uIGNoZWNrcyBpZiB0aGUgY2l0eSBpbiB0aGUgZGF0YSBpcyB0aGUgc2FtZSBhcyB0aGUgaW5wdXQgY2l0eSwgXG4vLyBpZiBzbyB0aGVuIGl0IGNoYW5nZXMgdGhlIG9iamVjdCB0byBjaXR5OiBjaXR5LlxuLy8gaW5zdGVhZCBvZiBjaXR5Rmlyc3QgYW5kIGNpdHlTZWNvbmQuXG4vLyBJdCBhbHNvIGNoZWNrcyBpZiB0aGVyZSBhbHJlYWR5IGlzIGEga2V5IFwiY2l0eVwiIHRoYXQgY29udGFpbnMgZGF0YVxuXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZURhdGEocnNEYXRhLCBjaXR5KSB7XG4gICAgbGV0IGNsZWFuRGF0YSA9IHJzRGF0YS5tYXAoKGRhdGEpID0+IHtcbiAgICAgICAgaWYgKGRhdGEuY2l0eUZpcnN0ID09PSBjaXR5IHx8IGRhdGEuY2l0eVNlY29uZCA9PT0gY2l0eSkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2kgYW0gbG9va2luZyBmb3InLCBjaXR5KVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZGF0YS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICBjaXR5OiBjaXR5LCAvLyBSRVBMQUNFUyBjaXR5Rmlyc3QgYW5kIGNpdHlTZWNvbmQgRk9SIENJVFk6IENJVFlcbiAgICAgICAgICAgICAgICBjYXBhY2l0eTogZGF0YS5jYXBhY2l0eSAvLyBBRERTIFRIRSBDQVBBQ0lUWVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGRhdGEuY2l0eSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRhdGEuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgY2l0eTogZGF0YS5jaXR5LCAvLyBDSEVDS1MgSUYgREFUQS5DSVRZIEFMUkVBRFkgRVhJU1QsIElGIFNPIFJFVFVSTlMgVEhFIFNBTUUgREFUQS5cbiAgICAgICAgICAgICAgICBjYXBhY2l0eTogZGF0YS5jYXBhY2l0eSAvLyBBRERTIENBUEFDSVRZXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSByZXR1cm4geyAvLyBJRiBUSEUgQUJPVkUgU1RBVEVNRU5UIElTIE5PVCBTTywgVEhFTiBSRVRVUk4gVEhFIFNBTUUgT0JKRUNUIEFTIEJFRk9SRS5cbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkYXRhLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgY2l0eUZpcnN0OiBkYXRhLmNpdHlGaXJzdCxcbiAgICAgICAgICAgIGNpdHlTZWNvbmQ6IGRhdGEuY2l0eVNlY29uZCxcbiAgICAgICAgICAgIGNhcGFjaXR5OiBkYXRhLmNhcGFjaXR5XG4gICAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBjbGVhbkRhdGE7XG5cbiAgICAvLyBESVQgS0FOIFdBQVJTQ0hJSk5MSUpLIE5PRyBXRUwgTU9PSUVSIE1FVCBFRU4gQVJSQVkgVkFOIFJBTkRTVEFEIENJVElFUyBESUUgSElFUiBMT09QVC4gTUlTU0NISUVOIFZPT1IgTEFURVIuXG59XG4gIFxuXG4vLyBJZiB0aGVyZSBpcyBhIHVuZGVmaW5lZCBkZXNjcmlwdGlvbiBpdCByZXR1cm5zIHRoZSBkZXNjcmlwdGlvbiBhcyAnUCtSJyArIHRoZSBjaXR5IG5hbWVcbmV4cG9ydCBmdW5jdGlvbiBmaXhEZXNjcmlwdGlvbihyc0RhdGEpIHtcbiAgICBsZXQgY2xlYW5EYXRhID0gcnNEYXRhLm1hcCgoZGF0YSkgPT4ge1xuICAgICAgICBpZiAoZGF0YS5kZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkKSB7IC8vIGlmIGRlc2NyaXB0aW9uIGlzIHVuZGVmaW5lZCwgY2hhbmdlIGRlc2NyaXB0aW9uIHRvIFArUiArIGNpdHluYW1lXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUCtSICcgKyBkYXRhLmNpdHksXG4gICAgICAgICAgICAgICAgY2l0eTogZGF0YS5jaXR5LFxuICAgICAgICAgICAgICAgIGNhcGFjaXR5OiBkYXRhLmNhcGFjaXR5XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSByZXR1cm4geyAvLyBpZiBkZXNjcmlwdGlvbiBpcyB2YWxpZCwgcmV0dXJuIG9iamVjdCBhcyBub3JtYWwuXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogZGF0YS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGNpdHk6IGRhdGEuY2l0eSxcbiAgICAgICAgICAgIGNhcGFjaXR5OiBkYXRhLmNhcGFjaXR5XG4gICAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBjbGVhbkRhdGE7XG5cbn1cblxuZnVuY3Rpb24gbGlzdFVuaXF1ZShyc0RhdGEpIHtcbiAgICBjb25zdCB1bmlxdWVBcnJheSA9IHJzRGF0YS5maWx0ZXIoKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBrZXlzID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgICByZXR1cm4gaW5kZXggPT09IHJzRGF0YS5maW5kSW5kZXgob2JqID0+IHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopID09PSBrZXlzO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiB1bmlxdWVBcnJheTtcblxuICAgIC8vIFRoYW5rcyB0byBFeWRyaWFuIEAgc3RhY2tvdmVyZmxvd1xuICAgIC8vIFJlc291cmNlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMjE4OTk5L3JlbW92ZS1kdXBsaWNhdGVzLWZyb20tYW4tYXJyYXktb2Ytb2JqZWN0cy1pbi1qYXZhc2NyaXB0XG5cbn0iLCJpbXBvcnQgeyBzZWxlY3QsICBcbiAgICAgICAgc2NhbGVMaW5lYXIsIFxuICAgICAgICBtYXgsIFxuICAgICAgICBzY2FsZUJhbmQsIFxuICAgICAgICBheGlzTGVmdCxcbiAgICAgICBcdGF4aXNCb3R0b20sXG4gICAgICAgXHRmb3JtYXQsXG4gICAgICAgIG5pY2VcbiAgICAgICB9IGZyb20gJ2QzJztcblxuaW1wb3J0IHsgY29tYmluZURvdWJsZUNpdGllcyB9IGZyb20gJy4vdHJhbnNmb3JtJ1xuXG4vLyB2YXJpYWJsZXNcbmNvbnN0IHN2ZyA9IHNlbGVjdCgnc3ZnJyk7XG5cbmNvbnN0IGhlaWdodCA9ICsoc3ZnLmF0dHIoJ2hlaWdodCcpKTtcbmNvbnN0IHdpZHRoID0gKyhzdmcuYXR0cignd2lkdGgnKSk7XG5cbi8vIHZhbHVlIGFjY2Vzc2Vyc1xuY29uc3QgdGl0bGUgPSAnQ2FwaWNpdHkgUCtSIGZvciBlYWNoIFJhbmRzdGFkIGNpdHknXG5cbmNvbnN0IHhWYWx1ZSA9IGQgPT4gZC5kZXNjcmlwdGlvblxuY29uc3QgeEF4aXNMYWJlbCA9ICcnO1xuICBcbmNvbnN0IHlWYWx1ZSA9IGQgPT4gZC5jYXBhY2l0eVxuY29uc3QgeUF4aXNMYWJlbCA9ICdDYXBhY2l0eSc7XG4gIFxuY29uc3QgbWFyZ2luID0geyB0b3A6IDEwLCByaWdodDogMTIwLCBib3R0b206IDIzMCwgbGVmdDogODAgfVxuY29uc3QgaW5uZXJXaWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XG5jb25zdCBpbm5lckhlaWdodCA9IGhlaWdodCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xuXG5jb25zdCB5U2NhbGUgPSBzY2FsZUxpbmVhcigpXG5jb25zdCB4U2NhbGUgPSBzY2FsZUJhbmQoKVxuXG5jb25zdCBnID0gc3ZnLmFwcGVuZCgnZycpXG4gIFx0LmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHttYXJnaW4ubGVmdH0sICR7bWFyZ2luLnRvcH0pYCk7XG5cblxuLy8gZXhwb3J0aW5nIGZ1bmN0aW9uc1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBTY2FsZXMoZGF0YSl7XG4gICAgICB5U2NhbGVcbiAgICAgICAgLmRvbWFpbihbbWF4KGRhdGEsIHlWYWx1ZSksIDBdKVxuICAgICAgICAucmFuZ2UoWzAsIGlubmVySGVpZ2h0XSlcbiAgICAgICAgLm5pY2UoKTtcblxuICAgICAgeFNjYWxlXG4gICAgICAgIC5kb21haW4oZGF0YS5tYXAoeFZhbHVlKSlcbiAgICAgICAgLnJhbmdlKFswLCBpbm5lcldpZHRoXSlcbiAgICAgICAgLnBhZGRpbmcoMC4yKTsgXG4gICAgfVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBBeGlzKGRhdGEpe1xuICBjb25zdCB5QXhpcyA9IGF4aXNMZWZ0KHlTY2FsZSlcbiAgXHQudGlja1NpemUoLWlubmVyV2lkdGgpXG4gIFx0XHQvLyAudGlja0Zvcm1hdChmb3JtYXQoJy4xcycpKTsgLy8gY2hhbmdpbmcgNy4wMDAgdG8gN2tcbiAgY29uc3QgeEF4aXMgPSBheGlzQm90dG9tKHhTY2FsZSlcblxuICBcbiAgLy8geSBBeGlzIEdST1VQSSBHXG4gIGNvbnN0IHlBeGlzRyA9IGcuYXBwZW5kKCdnJykuY2FsbCh5QXhpcylcbiAgXG4gIHlBeGlzR1xuICAuc2VsZWN0QWxsKCcuZG9tYWluJykgLy8gcmVtb3ZpbmcgWSBheGlzIGxpbmUgYW5kIHRpY2tzXG4gIFx0XHQucmVtb3ZlKClcbiAgXG4gIHlBeGlzRy5hcHBlbmQoJ3RleHQnKSAvLyBZIExBQkVMXG4gIFx0LmF0dHIoJ2NsYXNzJywgJ2F4aXMtbGFiZWwnKVxuICBcdC5hdHRyKCd5JywgLTUwKVxuICBcdC5hdHRyKCd4JywgLWlubmVySGVpZ2h0IC8gMilcbiAgXHQuYXR0cignZmlsbCcsICdibGFjaycpXG4gIFx0LmF0dHIoJ3RyYW5zZm9ybScsIGByb3RhdGUoLTkwKWApICAvLyBST1RBVElORyBZIExBQkVMXG4gIFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gIFx0LnRleHQoeUF4aXNMYWJlbClcbiAgXG4gIHlBeGlzR1xuICBcdC5hdHRyKCdjbGFzcycsICdheGlzLXknKVxuICBcdFxuICBcbiAgLy8geCBBeGlzIEdST1VQSU5HXG4gIGNvbnN0IHhBeGlzRyA9IGcuYXBwZW5kKCdnJykuY2FsbCh4QXhpcylcbiAgXG4gIHhBeGlzR1xuICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke2lubmVySGVpZ2h0fSlgKVxuICAuYXR0cignY2xhc3MnLCAnYXhpcy14JylcbiAgICAuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGByb3RhdGUoNTApYClcbiAgXHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnc3RhcnQnKVxuICAgICAgICAgIC5hdHRyKCd4JywgMTApXG4gIFx0XHRcdFx0LmF0dHIoJ3knLCA1KVxuICAgICAgICAgIC8vIC5hdHRyKFwiZHlcIiwgMTApXG4gIFx0LnNlbGVjdEFsbCgnLmRvbWFpbiwgLnRpY2sgbGluZScpIC8vIHJlbW92aW5nIFggYXhpcyBsaW5lIGFuZCB0aWNrc1xuICBcdFx0LnJlbW92ZSgpO1xuICB4QXhpc0cuYXBwZW5kKCd0ZXh0JykgLy8gWCBBUyBMQUJFTFxuICBcdC5hdHRyKCdjbGFzcycsICdheGlzLWxhYmVsJylcbiAgXHQuYXR0cigneCcsIGlubmVyV2lkdGggLyAyKVxuICBcdC5hdHRyKCd5JywgNjApXG4gIFx0LmF0dHIoJ2ZpbGwnLCAnYmxhY2snKVxuICBcdC50ZXh0KHhBeGlzTGFiZWwpXG4gIH1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdCYXJzKGRhdGEpe1xuICBnLnNlbGVjdEFsbCgnLmJhcicpXG4gIFx0LmRhdGEoZGF0YSlcbiAgXHQuZW50ZXIoKVxuICBcdFx0LmFwcGVuZCgncmVjdCcpXG4gIFx0XHRcdC5hdHRyKCdjbGFzcycsICdiYXInKVxuICBcdFx0XHQuYXR0cigneCcsIGQgPT4geFNjYWxlKHhWYWx1ZShkKSkpXG4gIFx0XHRcdC5hdHRyKCd5JywgZCA9PiB5U2NhbGUoeVZhbHVlKGQpKSlcbiAgXHRcdFx0LmF0dHIoJ3dpZHRoJywgeFNjYWxlLmJhbmR3aWR0aCgpKVxuICBcbiAgXHRcdFx0LmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICBcdFx0XHRyZXR1cm4geVNjYWxlKDApO1xuICAgIFx0XHRcdH0pXG4gICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDApXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMTAwMClcbiAgICAgICAgLmF0dHIoJ3knLCBkID0+IHlTY2FsZSh5VmFsdWUoZCkpKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgZCA9PiBpbm5lckhlaWdodCAtIHlTY2FsZSh5VmFsdWUoZCkpKTtcblxuICAvLyBhZGQgdGl0bGUsIERvbmUgdGhpcyBub3cgaW4gdGhlIEhUTUwgd2l0aCBhIEgxXG4gIC8vIGcuYXBwZW5kKCd0ZXh0JylcbiAgLy8gXHQuYXR0cigneScsIC0zMClcbiAgLy8gXHQuYXR0cignY2xhc3MnLCAndGl0bGUnKVxuICAvLyBcdC50ZXh0KHRpdGxlKVxuICB9XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwSW5wdXQoZGF0YSl7XG4gLy8gJkNSRURJVFMgY29kZSBleGFtcGxlIGJ5IExhdXJlbnNcbiAgY29uc3QgaW5wdXQgPSBzZWxlY3QoJ2lucHV0JylcbiAgXHRcdC5vbihcImNsaWNrXCIsICgpID0+IGNoYW5nZU91dHB1dChkYXRhKSk7XG59XG5cbmZ1bmN0aW9uIGNoYW5nZU91dHB1dChkYXRhKXtcbiAgXG4gIC8vIGNvbnN0IGRhdGFTZWxlY3Rpb24gPSBmaWx0ZXJPbj8gcHJEYXRhU2V0LmZpbHRlcihwYXJraW5nID0+IHBhcmtpbmcuY2FwYWNpdHkpIDogZGF0YVxuICBjb25zdCBkYXRhU2VsZWN0aW9uID0gc2VsZWN0KCdpbnB1dCcpLnByb3BlcnR5KCdjaGVja2VkJykgPyBjb21iaW5lRG91YmxlQ2l0aWVzKGRhdGEpIDogZGF0YVxuXG4gIGNvbnNvbGUubG9nKCduZXcgZGF0YScsIGRhdGFTZWxlY3Rpb24pXG4gIFxuICAvL1VwZGF0ZSB0aGUgZG9tYWluc1xuICB5U2NhbGVcbiAgLmRvbWFpbihbbWF4KGRhdGFTZWxlY3Rpb24sIHlWYWx1ZSksIDBdKVxuICAubmljZSgpXG5cbiAgeFNjYWxlXG4gIC5kb21haW4oZGF0YVNlbGVjdGlvbi5tYXAoeFZhbHVlKSlcblxuICBcbiAgLy9CYXJzIHdpbGwgc3RvcmUgYWxsIGJhcnMgY3JlYXRlZCBzbyBmYXJcbiAgLy8kQ1JFRElUUyA9PSAgQ29kZSBleGFtcGxlIGJ5IExBVVJFTlMgXG4gIGNvbnN0IGJhcnMgPSBnLnNlbGVjdEFsbCgnLmJhcicpXG4gIFx0LmRhdGEoZGF0YVNlbGVjdGlvbilcbiAgXG4gIFxuICAvLyB1cGRhdGVcbiAgYmFyc1xuICBcdC5hdHRyKCd5JywgZCA9PiB5U2NhbGUoeVZhbHVlKGQpKSlcbiAgICAuYXR0cigneCcsIGQgPT4geFNjYWxlKHhWYWx1ZShkKSkpXG4gIFx0LmF0dHIoJ3dpZHRoJywgeFNjYWxlLmJhbmR3aWR0aCgpKVxuICBcbiAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24oZCkge1xuICAgIFx0cmV0dXJuIHlTY2FsZSgwKTtcbiAgICBcdH0pXG4gIFx0LmF0dHIoXCJoZWlnaHRcIiwgMClcbiAgXHQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDEwMDApXG4gIFx0LmF0dHIoJ3knLCBkID0+IHlTY2FsZSh5VmFsdWUoZCkpKVxuICBcdC5hdHRyKCdoZWlnaHQnLCBkID0+IGlubmVySGVpZ2h0IC0geVNjYWxlKHlWYWx1ZShkKSkpXG4gIC8vIGNvbnNvbGUubG9nKCdkYXRhIGF0IHVwZGF0ZSBwb2ludCcsIGRhdGFTZWxlY3Rpb24pXG4gXG4gIFxuICAvL0VudGVyXG4gIGJhcnMuZW50ZXIoKVxuICBcdFx0LmFwcGVuZCgncmVjdCcpXG4gIFx0XHRcdC5hdHRyKCdjbGFzcycsICdiYXInKVxuICBcdFx0XHQuYXR0cigneCcsIGQgPT4geFNjYWxlKHhWYWx1ZShkKSkpXG4gIFx0XHRcdC5hdHRyKCd5JywgZCA9PiB5U2NhbGUoeVZhbHVlKGQpKSlcbiAgXHRcdFx0LmF0dHIoJ3dpZHRoJywgeFNjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgXG4gICAgXHQuYXR0cihcInlcIiwgZnVuY3Rpb24oZCkge1xuICAgIFx0cmV0dXJuIHlTY2FsZSgwKTtcbiAgICBcdH0pXG4gICAgICAuYXR0cihcImhlaWdodFwiLCAwKVxuICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKVxuICAgICAgLmF0dHIoJ3knLCBkID0+IHlTY2FsZSh5VmFsdWUoZCkpKVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZCA9PiBpbm5lckhlaWdodCAtIHlTY2FsZSh5VmFsdWUoZCkpKTtcblxuICBcdFx0Ly8gUkVTT1VSQ0UgQkFSUyBGUk9NIEJPVFRPTSBUTyBUT1A6XG4gIFx0XHQvLyBSRVNPVVJDRTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzYxMjYwMDQvaGVpZ2h0LXRyYW5zaXRpb25zLWdvLWZyb20tdG9wLWRvd24tcmF0aGVyLXRoYW4tZnJvbS1ib3R0b20tdXAtaW4tZDNcbiAgXG4gIC8vRXhpdFxuICBiYXJzLmV4aXQoKVxuICBcdFx0LnJlbW92ZSgpXG5cbiAgLy9VcGRhdGUgdGhlIHRpY2tzXHRcbiAgICBzdmcuc2VsZWN0KCcuYXhpcy14JylcbiAgICAgIC5jYWxsKGF4aXNCb3R0b20oeFNjYWxlKSlcbiAgICBcdC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7aW5uZXJIZWlnaHR9KWApXG4gIFx0XHQuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGByb3RhdGUoNTApYClcbiAgXHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnc3RhcnQnKVxuICAgICAgICAgIC5hdHRyKCd4JywgMTApXG4gIFx0XHRcdFx0LmF0dHIoJ3knLCA1KVxuICBcdHN2Zy5zZWxlY3QoJy5heGlzLXknKVxuICAgICAgLmNhbGwoYXhpc0xlZnQoeVNjYWxlKS50aWNrU2l6ZSgtaW5uZXJXaWR0aCkpXG5cdFx0XHQgIC5zZWxlY3RBbGwoJy5kb21haW4nKSAvLyByZW1vdmluZyBZIGF4aXMgbGluZSBhbmQgdGlja3NcbiAgXHRcdFx0LnJlbW92ZSgpXG4gIFx0XG59XG5cblxuIiwiY29uc3QgZW5kcG9pbnROUFIgPSAnaHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9OYXRoYW5OZWVsaXMvYjI4ZTE2YzA0MzNiMTJkYTZiYzcxNmIyNzY5MDFhZTkvcmF3LzQwMjc1NGZhNDU5MjRhZjgwMmQwNmM1NjcyMDQzMTUzYmI5OTBkNWIvTlBSX3BhcmtfYW5kX3JpZGUnO1xuXG5pbXBvcnQge1xuICBcdFx0XHRjb21iaW5lRG91YmxlQ2l0aWVzLCBcbiAgXHRcdFx0Y2xlYW5pbmdEYXRhXG5cdFx0XHRcdH0gZnJvbSAnLi90cmFuc2Zvcm0nO1xuXG5pbXBvcnQgeyBzZXR1cFNjYWxlcywgXG4gICAgICAgIHNldHVwQXhpcywgXG4gICAgICAgIGRyYXdCYXJzLFxuXHRcdFx0XHRzZXR1cElucHV0XG4gICAgICAgfSBmcm9tICcuL3Zpc3VhbCdcblxubWFrZVZpc3VhbGl6YXRpb24oKVxuYXN5bmMgZnVuY3Rpb24gbWFrZVZpc3VhbGl6YXRpb24oKXtcbiAgZ2V0RGF0YShlbmRwb2ludE5QUilcbiAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgIFxuICAgIFx0bGV0IHByRGF0YSA9IGNsZWFuaW5nRGF0YShkYXRhKTtcbiAgICAgIGxldCBjb21iaW5lID0gY29tYmluZURvdWJsZUNpdGllcyhwckRhdGEpO1xuXG4gICAgICBjb25zb2xlLmxvZygnYWxsIFArUicsIGRhdGEpXG4gICAgICBjb25zb2xlLmxvZygnUCtSIGZvciBlYWNoIGNpdHknLCBjb21iaW5lKTtcbiAgICBcdFxuICAgIFx0c2V0dXBTY2FsZXMocHJEYXRhKSAvLyBpbXBvcnQgZnJvbSB2aXN1YWxcbiAgICBcdHNldHVwQXhpcyhwckRhdGEpIC8vIGltcG9ydCBmcm9tIHZpc3VhbFxuICAgIFx0ZHJhd0JhcnMocHJEYXRhKSAvLyBpbXBvcnQgZnJvbSB2aXN1YWxcbiAgICBcdHNldHVwSW5wdXQocHJEYXRhKSAvLyBpbXBvcnQgZnJvbSB2aXN1YWxcbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldERhdGEodXJsKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgcmV0dXJuIGRhdGE7XG59XG5cblxuIl0sIm5hbWVzIjpbInNlbGVjdCIsInNjYWxlTGluZWFyIiwic2NhbGVCYW5kIiwibWF4IiwiYXhpc0xlZnQiLCJheGlzQm90dG9tIl0sIm1hcHBpbmdzIjoiOzs7RUFBTyxTQUFTLFlBQVksQ0FBQyxJQUFJLENBQUM7RUFDbEMsTUFBTSxJQUFJLFVBQVUsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDekMsTUFBTSxJQUFJLFdBQVcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDekMsTUFBTSxJQUFJLGFBQWEsR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0VBQzFELE1BQU0sSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7RUFDckUsTUFBTSxJQUFJLGNBQWMsR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDdkQsTUFBTSxJQUFJLGFBQWEsR0FBRyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUM1RCxJQUFJLElBQUksU0FBUyxHQUFHLFVBQVUsQ0FBQyxhQUFhLEVBQUM7RUFDN0MsRUFBRSxPQUFPLFNBQVM7RUFDbEIsQ0FBQztBQUNEO0VBQ08sU0FBUyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUU7RUFDNUMsSUFBSSxJQUFJLEdBQUcsR0FBRyxNQUFNO0VBQ3BCLFFBQVEsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNwQjtFQUNBLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFB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