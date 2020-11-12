const endpointNPR = 'https://gist.githubusercontent.com/NathanNeelis/b28e16c0433b12da6bc716b276901ae9/raw/402754fa45924af802d06c5672043153bb990d5b/NPR_park_and_ride';

import {
  combineDoubleCities,
  cleaningData
} from './transform';

import {
  setupScales,
  setupAxis,
  drawBars,
  yScale,
  xScale,
  xValue,
  yValue,
  g,
  margin,
  innerHeight,
  innerWidth,
  svg,
  height,
  width
} from './visual'

import {
  select,
  scaleLinear,
  max,
  scaleBand,
  axisLeft,
  axisBottom,
  format,
  nice
} from 'd3';

let prDataSet

makeVisualization()
async function makeVisualization() {
  getData(endpointNPR)
    .then(data => {

      let prData = cleaningData(data);
      let combine = combineDoubleCities(prData);

      console.log('all P+R', data)
      console.log('P+R for each city', combine);

      prDataSet = cleaningData(data) // binding data to global data variable

      setupScales(prData) // import from visual
      setupAxis(prData) // import from visual
      drawBars(prData) // import from visual
      setupInput(prData) // not an import 
    });
}

async function getData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function setupInput() {
  // &CREDITS code example by Laurens
  const input = select('#filter')
    // .on("click", changeOutput)
    // .on("click", () => changeOutput(data));
    .on('click', changeOutput)
}

function changeOutput() {
  const filterOn = this ? this.checked : false;
  console.log('checkbox', this.checked)

  const dataSelection = filterOn ? combineDoubleCities(prDataSet) : prDataSet
  console.log('new data', dataSelection)

  //Update the domains
  yScale
    .domain([max(dataSelection, yValue), 0])
    .nice()

  xScale
    .domain(dataSelection.map(xValue))


  //Bars will store all bars created so far
  //$CREDITS ==  Code example by LAURENS 
  const bars = g.selectAll('.bar')
    .data(dataSelection)


  // update
  bars
    .attr('y', d => yScale(yValue(d)))
    .attr('x', d => xScale(xValue(d)))
    .attr('width', xScale.bandwidth())

    .attr("y", function (d) {
      return yScale(0);
    })
    .attr("height", 0)
    .transition().duration(1000)
    .attr('y', d => yScale(yValue(d)))
    .attr('height', d => innerHeight - yScale(yValue(d)))
  // console.log('data at update point', dataSelection)


  //Enter
  bars.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(xValue(d)))
    .attr('y', d => yScale(yValue(d)))
    .attr('width', xScale.bandwidth())

    .attr("y", function (d) {
      return yScale(0);
    })
    .attr("height", 0)
    .transition().duration(1000)
    .attr('y', d => yScale(yValue(d)))
    .attr("height", d => innerHeight - yScale(yValue(d)));

  // RESOURCE BARS FROM BOTTOM TO TOP:
  // credits for Harry Vane @ stackoverflow
  // RESOURCE: https://stackoverflow.com/questions/36126004/height-transitions-go-from-top-down-rather-than-from-bottom-up-in-d3

  //Exit
  bars.exit()
    .remove()

  //Update the ticks	
  svg.select('.axis-x')
    .call(axisBottom(xScale))
    .attr('transform', `translate(0, ${innerHeight})`)
    .selectAll("text")
    .attr("transform", `rotate(50)`)
    .attr('text-anchor', 'start')
    .attr('x', 10)
    .attr('y', 5)
  svg.select('.axis-y')
    .call(axisLeft(yScale).tickSize(-innerWidth))
    .selectAll('.domain') // removing Y axis line and ticks
    .remove()

}