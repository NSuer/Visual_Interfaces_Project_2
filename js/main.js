let originData = null;
let filteredData = null;
let filterSet = []

let plotSet = []
let brushSet = []

d3.csv('data/magTypeInfo.csv')
  .then(data => {
    console.log("number of items: " + data.length);

    // Extract magType values
    const magTypes = data.map(d => d.magType);

    // Initialize the dropdown menu
    const dropdown = d3.select("#dropdown");

    dropdown
      .selectAll("option")
      .data(magTypes)
      .enter()
      .append("option")
      .attr("value", d => d)
      .text(d => d);

    // Set the default value to the first option
    dropdown.property("value", magTypes[0]);

    // Initialize the displayed values with the first magType
    updateDisplayedValues(data[0]);

    // Add an event listener to update the displayed values when a new option is selected
    dropdown.on("change", function () {
      const selectedMagType = this.value;
      const selectedData = data.find(d => d.magType === selectedMagType);
      updateDisplayedValues(selectedData);
    });
  })
  .catch(error => console.error(error));

// Function to update the displayed values
function updateDisplayedValues(selectedData) {
  d3.select("#type-range").text(selectedData.Scale || "N/A");
  d3.select("#metric-value").text(selectedData.Measurement || "N/A");
  d3.select("#usage-value").text(selectedData.Usage || "N/A");
}

d3.csv('data/Data.csv')  //**** TO DO  switch this to loading the quakes 'data/2024-2025.csv'
.then(data => {
    console.log("number of items: " + data.length);

    originData = data;

    data.forEach(d => {  //convert from string to number
      d.latitude = +d.latitude; 
      d.longitude = +d.longitude;  

      // force magnitude and depth to be numbers of precision 0.0
      d.mag = +((+d.mag).toFixed(1));
      d.depth = +((+d.depth).toFixed(0));

    });

    // Initialize chart and then show it
    leafletMap = new LeafletMap({ 
      parentElement: '#my-map',
      keyMetric: 'place'
    }, data);

    // magnitude waveplot
    let magPlot = new WavePlot({
      parentElement: '#my-barchart',
      barColor: 'FireBrick',
      keyMetric: 'mag',
      xAxisLabel: 'Quake Magnitude (converted)',
      chartTitle: 'Distribution of Quakes by Magnitude',
      stepSize: 0.1,
      tooltipString: 'Magnitude (converted): '
    }, data)

    // depth waveplot
    let depthPlot = new WavePlot({
      parentElement: '#my-barchart',
      barColor: 'DarkMagenta',
      keyMetric: 'depth',
      xAxisLabel: 'Quake Depth (km)',
      chartTitle: 'Distribution of Quakes by Depth',
      stepSize: 1,
      tooltipString: 'Depth (km): '
    }, data)

    let newTimeline = new TimeWavePlot({
      parentElement: '#my-timeline',
      barColor: 'SteelBlue',
      keyMetric: 'time',
      xAxisLabel: 'Date',
      chartTitle: 'Timeline'
    }, data)

    plotSet.push(magPlot)
    plotSet.push(depthPlot)
    plotSet.push(newTimeline)
    plotSet.push(leafletMap)

    document.getElementById('reset-filters').addEventListener('click', () => resetFilters());
  })
  .catch(error => console.error(error));


function updateFilters(metric, filterRange){

  let newFilter = true

  // update record of filters with this new / updated one
  for (let index = 0; index < filterSet.length; index ++) {
    if (filterSet[index][0] == metric) {
      filterSet[index][1] = filterRange;
      newFilter = false;
    }
  }

  // if the filter didn't already exist in the set, add it with this current value range.
  if (newFilter) {
    filterSet.push([metric, filterRange])
  }

  //console.log("dio... i have the new filter set...")
  //console.log(filterSet)

  let count = 0;

  // for each created plot
  while (count < plotSet.length) {
    let currPlot = plotSet[count]

    // assign to filteredData the result of filtering data with each filter that wasn't this vis's keyMetric.
    filteredData = originData;

    // for each filter applied by a plot
    for (const filter of filterSet) {
      // each plot shouldn't filter on itself
      if (filter[0] != currPlot.keyMetric) {

        // filter data to current domain
        if (filter[0] == "time"){
          // cast to date objects if required
          filteredData = filteredData.filter(d => new Date(d[filter[0]]) >= filter[1][0] && new Date(d[filter[0]]) <= filter[1][1])
        } else {
          filteredData = filteredData.filter(d => d[filter[0]] >= filter[1][0] && d[filter[0]] <= filter[1][1])
        }

        //console.log("and lo! the data was indeed filtered such that member " + filter[0] + " may lie only betwixt " + filter[1][0] + " and " + filter[1][1] + "!")
      } else {
        //console.log("our regent saw this attempt to filter on " + filter[0] + " and with the Emperor's sword did put a stop to it.")
      }
    }
    //console.log("and let it be recorded in the Library of Ptolemy that the filtered data rests as such:")
    //console.log(filteredData)

    // write filtered dataset out to plot, make it update on that. 
    currPlot.data = filteredData;
    currPlot.updateVis()

    count ++
  }
}

function resetFilters() {

  console.log("filters, I command thee... reset!")
  
  // destroy all filters on the logical side
  filterSet = []

  // reset all visual brush elements
  let count = 0
  while (count < brushSet.length) {
    let currBrush = brushSet[count]
    currBrush.call(d3.brush().clear)
    count ++
  }

  // set all plots to their full dataset
  count = 0
  while (count < plotSet.length) {
    let currPlot = plotSet[count]
    currPlot.data = originData;
    currPlot.updateVis()
    count ++
  }
}
