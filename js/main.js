




d3.csv('data/Data.csv')  //**** TO DO  switch this to loading the quakes 'data/2024-2025.csv'
.then(data => {
    console.log("number of items: " + data.length);

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
    wavePlot = new WavePlot({
      parentElement: '#my-barchart',
      barColor: 'FireBrick',
      keyMetric: 'mag',
      xAxisLabel: 'Quake Magnitude (converted)',
      chartTitle: 'Distribution of Quakes by Magnitude',
      stepSize: 0.1,
      flipY: false
    }, data)

    // magnitude waveplot
    wavePlot = new WavePlot({
      parentElement: '#my-barchart',
      barColor: 'MidnightBlue',
      keyMetric: 'depth',
      xAxisLabel: 'Quake Depth (km)',
      chartTitle: 'Distribution of Quakes by Depth',
      stepSize: 1,
      flipY: false
    }, data)

    timeline = new Timeline({ parentElement: '#my-timeline'}, data);


  })
  .catch(error => console.error(error));
