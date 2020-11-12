const endpointNPR = 'https://gist.githubusercontent.com/NathanNeelis/b28e16c0433b12da6bc716b276901ae9/raw/402754fa45924af802d06c5672043153bb990d5b/NPR_park_and_ride';

import {
  combineDoubleCities,
  cleaningData
} from './transform';

import {
  setupScales,
  setupAxis,
  drawBars,
  setupInput
} from './visual'

makeVisualization()
async function makeVisualization() {
  getData(endpointNPR)
    .then(data => {

      let prData = cleaningData(data);
      let combine = combineDoubleCities(prData);

      console.log('all P+R', data)
      console.log('P+R for each city', combine);

      setupScales(prData) // import from visual
      setupAxis(prData) // import from visual
      drawBars(prData) // import from visual
      setupInput(prData) // import from visual
    });
}

async function getData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}