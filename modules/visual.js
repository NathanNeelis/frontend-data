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

import {
  combineDoubleCities
} from './transform'

// variables
const svg = select('svg');

const height = +(svg.attr('height'));
const width = +(svg.attr('width'));

// value accessers
const title = 'Capicity P+R for each Randstad city'

const xValue = d => d.description
const xAxisLabel = '';

const yValue = d => d.capacity
const yAxisLabel = 'Capacity';

const margin = {
  top: 10,
  right: 120,
  bottom: 230,
  left: 70
}
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const yScale = scaleLinear()
const xScale = scaleBand()

const g = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);


// exporting functions that are setting up the scales
export function setupScales(data) {
  yScale
    .domain([max(data, yValue), 0])
    .range([0, innerHeight])
    .nice();

  xScale
    .domain(data.map(xValue))
    .range([0, innerWidth])
    .padding(0.2);
}

// function that sets up the axis
export function setupAxis(data) {
  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)
  // .tickFormat(format('.1s')); // changing 7.000 to 7k
  const xAxis = axisBottom(xScale)


  // y Axis GROUPI G
  const yAxisG = g.append('g').call(yAxis)

  yAxisG
    .selectAll('.domain') // removing Y axis line and ticks
    .remove()

  yAxisG.append('text') // Y LABEL
    .attr('class', 'axis-label')
    .attr('y', -40)
    .attr('x', -innerHeight / 2)
    .attr('fill', 'black')
    .attr('transform', `rotate(-90)`) // ROTATING Y LABEL
    .attr('text-anchor', 'middle')
    .text(yAxisLabel)

  yAxisG
    .attr('class', 'axis-y')


  // x Axis GROUPING
  const xAxisG = g.append('g').call(xAxis)

  xAxisG
    .attr('transform', `translate(0, ${innerHeight})`)
    .attr('class', 'axis-x')
    .selectAll("text")
    .attr("transform", `rotate(50)`)
    .attr('text-anchor', 'start')
    .attr('x', 10)
    .attr('y', 5)
    .selectAll('.domain, .tick line') // removing X axis line and ticks
    .remove();
  xAxisG.append('text') // X AS LABEL
    .attr('class', 'axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', 60)
    .attr('fill', 'black')
    .text(xAxisLabel)
}

// function that creates the data bars in the bar chart
export function drawBars(data) {
  g.selectAll('.bar')
    .data(data)
    .enter()
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
    .attr('height', d => innerHeight - yScale(yValue(d)));

  // add title, Done this now in the HTML with a H1
  // g.append('text')
  // 	.attr('y', -30)
  // 	.attr('class', 'title')
  // 	.text(title)
}

export function setupInput(data) {
  // &CREDITS code example by Laurens
  const input = select('input')
    .on("click", () => changeOutput(data));
}

function changeOutput(data) {

  const dataSelection = select('input').property('checked') ? combineDoubleCities(data) : data
  console.log('new data', dataSelection)
  // RESOURCE selecting checkbox: https://bl.ocks.org/johnnygizmo/3d593d3bf631e102a2dbee64f62d9de4


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