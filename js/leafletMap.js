class LeafletMap {

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
    }
    this.data = _data;
    this.keyMetric = _config.keyMetric;
    this.groupedDataByMonth = this.groupDataByMonth(_data);
    this.initVis();
    this.startDate = new Date(this.groupedDataByMonth[0][0]);
    this.endDate = new Date(this.groupedDataByMonth[this.groupedDataByMonth.length - 1][0]);
  }

  groupDataByMonth(data) {
    /// first order data by time
    data = data.sort((a, b) => new Date(a.time) - new Date(b.time));
    // Next get the earliest and latest month
    let startDate = new Date(data[0].time);
    let endDate = new Date(data[data.length - 1].time);
    // Create an array of months between the two dates
    let months = d3.timeMonths(startDate, endDate);
    // Create a 2D array where each element is a month and the data is all the earthquakes in that month
    let groupedDataByMonth = months.map(month => [month, data.filter(d => d3.timeMonth(new Date(d.time)).getTime() === month.getTime())]);
    return groupedDataByMonth;
  }

  initVis() {
    let vis = this;

    // Initialize map and layers

    vis.stadiaUrl = 'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}';
    vis.stadiaAttr = '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    vis.base_layer = L.tileLayer(vis.stadiaUrl, {
      minZoom: 0,
      maxZoom: 20,
      attribution: vis.stadiaAttr,
      ext: 'jpg'
    });

    vis.theMap = L.map('my-map', {
      center: [37.8, -96],
      zoom: 4,
      layers: [vis.base_layer]
    });

    vis.colorScale = d3.scaleSequential(d3.interpolateOranges).domain([0, 10]);
    vis.typeColor = d3.scaleSequential(d3.interpolateBlues).domain([0, 10]);

    L.svg({ clickable: true }).addTo(vis.theMap);
    vis.overlay = d3.select(vis.theMap.getPanes().overlayPane);
    vis.svg = vis.overlay.select('svg').attr("pointer-events", "auto");

    vis.theMap.on("zoomend", function () {
      vis.updateVis();
    });

    // Mag Type Controls
    vis.targetMag = "";

    document.getElementById('dropdown').addEventListener('change', (event) => {
      vis.targetMag = event.target.value;
      vis.updateVis();
    });

    // Animation controls
    vis.currentIndex = 0;
    vis.isAnimating = false;
    vis.animationRate = 1000;

    document.getElementById('start-animation').addEventListener('click', () => vis.startAnimation());
    document.getElementById('stop-animation').addEventListener('click', () => vis.stopAnimation());
    document.getElementById('rate').addEventListener('change', (event) => {
      vis.animationRate = 1000 / +event.target.value;
    });

    document.getElementById('time-slider').addEventListener('input', (event) => {
      vis.currentIndex = +event.target.value;
      vis.updateVis();
    });

    vis.updateVis();
  }

  updateVis() {
    let vis = this;
    console.log("called updateVis in leaflet")
    vis.groupedDataByMonth = vis.groupDataByMonth(vis.data);

    let currentData = vis.groupedDataByMonth[vis.currentIndex] ? vis.groupedDataByMonth[vis.currentIndex][1] : [];

    vis.Dots = vis.svg.selectAll('circle')
      .data(currentData)
      .join('circle')
      .attr("fill", d => d.magType === vis.targetMag ? vis.typeColor(d.mag) : vis.colorScale(d.mag))
      .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude, d.longitude]).x)
      .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude, d.longitude]).y)
      .attr("r", 3)
      .on('mouseover', function (event, d) {
      d3.select(this).transition()
        .duration('150')
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr('r', 4);

      d3.select('#tooltip')
        .style('opacity', 1)
        .style('z-index', 1000000)
        .html(`<div class="tooltip-label">
          Time: ${d.time}<br>
          Latitude: ${d.latitude}<br>
          Longitude: ${d.longitude}<br>
          Depth: ${d.depth}<br>
          Magnitude: ${d.mag}<br>
          Mag Type: ${d.magType}<br>
          Place: ${d.place}
        </div>`);
      })
      .on('mousemove', (event) => {
      d3.select('#tooltip')
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY + 10) + 'px');
      })
      .on('mouseleave', function () {
      d3.select(this).transition()
        .duration('150')
        .attr("stroke", "none")
        .attr("stroke-width", 0)
        .attr('r', 3);

      d3.select('#tooltip').style('opacity', 0);
      });

    document.getElementById('current-time-label').innerText = vis.groupedDataByMonth[vis.currentIndex] ? vis.groupedDataByMonth[vis.currentIndex][0].toLocaleString('default', { month: 'long', year: 'numeric' }) : 'No Data';
  }

  startAnimation() {
    let vis = this;
    vis.isAnimating = true;
    vis.animate();
  }

  stopAnimation() {
    let vis = this;
    vis.isAnimating = false;
  }

  animate() {
    let vis = this;
    if (!vis.isAnimating) return;

    vis.currentIndex = (vis.currentIndex + 1) % vis.groupedDataByMonth.length;
    document.getElementById('time-slider').value = vis.currentIndex;
    vis.updateVis();

    setTimeout(() => vis.animate(), vis.animationRate);
  }
}
