
let originData = null;
let filteredData = null;
let filterSet = []

let magPlot = null;
let depthPlot = null;
let timeline = null;



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
    leafletMap = new LeafletMap({ parentElement: '#my-map'}, data);

    // magnitude waveplot
    magPlot = new WavePlot({
      parentElement: '#my-barchart',
      barColor: 'FireBrick',
      keyMetric: 'mag',
      xAxisLabel: 'Quake Magnitude (converted)',
      chartTitle: 'Distribution of Quakes by Magnitude',
      stepSize: 0.1,
      tooltipString: 'Magnitude (converted): '
    }, data)

    // depth waveplot
    depthPlot = new WavePlot({
      parentElement: '#my-barchart',
      barColor: 'DarkMagenta',
      keyMetric: 'depth',
      xAxisLabel: 'Quake Depth (km)',
      chartTitle: 'Distribution of Quakes by Depth',
      stepSize: 1,
      tooltipString: 'Depth (km): '
    }, data)

    newTimeline = new TimeWavePlot({
      parentElement: '#my-barchart',
      barColor: 'SteelBlue',
      keyMetric: 'time',
      xAxisLabel: 'Date',
      chartTitle: 'Timeline'
    }, data)

    timeline = new Timeline({ 
      parentElement: '#my-timeline',
      keyMetric: 'time'

    }, data);

    //focusTimeline = new FocusTimeline({parentElement: '#my-focus-timeline'}, data);


  })
  .catch(error => console.error(error));


function updateFilters(metric, filterRange){
  console.log("okiyasu! it's updateFilters!")
  console.log("oi josuke! my metric is ")
  console.log(metric)
  console.log("and the new range is")
  console.log(filterRange)

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

  console.log("dio... i have the new filter set...")
  console.log(filterSet)

  // FOR magPlot:

  // assign to filteredData the result of filtering data with each filter that wasn't this vis's keyMetric.
  filteredData = originData;

  for (const filter of filterSet) {
    if (filter[0] != magPlot.keyMetric){
      // cast to date objects if required
      if (filter[0] == "time"){
        filteredData = filteredData.filter(d => new Date(d[filter[0]]) >= filter[1][0] && new Date(d[filter[0]]) <= filter[1][1])
      } else {
        filteredData = filteredData.filter(d => d[filter[0]] >= filter[1][0] && d[filter[0]] <= filter[1][1])
      }

      console.log("and lo! the data was indeed filtered such that member " + filter[0] + " may lie only betwixt " + filter[1][0] + " and " + filter[1][1] + "!")
    }else {
      console.log("our regent saw this attempt to filter on " + filter[0] + " and with the Emperor's sword did put a stop to it.")
    }
  }
  console.log("and let it be recorded in the Library of Ptolemy that the filtered data rests as such:")
  console.log(filteredData)

  magPlot.data = filteredData;
  magPlot.updateVis()

  // FOR depthPlot:

  // assign to filteredData the result of filtering data with each filter that wasn't this vis's keyMetric.
  filteredData = originData;

  for (const filter of filterSet) {
    if (filter[0] != depthPlot.keyMetric){
      // cast to date objects if required
      if (filter[0] == "time"){
        filteredData = filteredData.filter(d => new Date(d[filter[0]]) >= filter[1][0] && new Date(d[filter[0]]) <= filter[1][1])
      } else {
        filteredData = filteredData.filter(d => d[filter[0]] >= filter[1][0] && d[filter[0]] <= filter[1][1])
      }

      console.log("and lo! the data was indeed filtered such that member " + filter[0] + " may lie only betwixt " + filter[1][0] + " and " + filter[1][1] + "!")
    }else {
      console.log("our regent saw this attempt to filter on " + filter[0] + " and with the Emperor's sword did put a stop to it.")
    }
  }
  console.log("and let it be recorded in the Library of Ptolemy that the filtered data rests as such:")
  console.log(filteredData)

  depthPlot.data = filteredData;
  depthPlot.updateVis()

    // FOR timeline:

  // assign to filteredData the result of filtering data with each filter that wasn't this vis's keyMetric.
  filteredData = originData;

  for (const filter of filterSet) {
    if (filter[0] != newTimeline.keyMetric){
      // cast to date objects if required
      if (filter[0] == "time"){
        filteredData = filteredData.filter(d => new Date(d[filter[0]]) >= filter[1][0] && new Date(d[filter[0]]) <= filter[1][1])
      } else {
        filteredData = filteredData.filter(d => d[filter[0]] >= filter[1][0] && d[filter[0]] <= filter[1][1])
      }

      console.log("and lo! the data was indeed filtered such that member " + filter[0] + " may lie only betwixt " + filter[1][0] + " and " + filter[1][1] + "!")
    }else {
      console.log("our regent saw this attempt to filter on " + filter[0] + " and with the Emperor's sword did put a stop to it.")
    }
  }
  console.log("and let it be recorded in the Library of Ptolemy that the filtered data rests as such:")
  console.log(filteredData)

  newTimeline.data = filteredData;
  newTimeline.updateVis()

}