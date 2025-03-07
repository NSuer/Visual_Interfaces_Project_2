class LeafletMap {

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
    }
    this.data = _data;
    this.groupedDataByMonth = this.groupDataByMonth(_data);
    this.initVis();
    this.startDate = new Date(this.groupedDataByMonth[0][0]);
    this.endDate = new Date(this.groupedDataByMonth[this.groupedDataByMonth.length - 1][0]);
  }

  groupDataByMonth(data) {
    /// first order data by time
    data = data.sort((a,b) => new Date(a.time) - new Date(b.time));
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

    // Initialize map and layers (same as before)
    vis.esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    vis.esriAttr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    vis.base_layer = L.tileLayer(vis.esriUrl, {
      id: 'esri-image',
      attribution: vis.esriAttr,
      ext: 'png'
    });

    vis.theMap = L.map('my-map', {
      center: [37.8, -96],
      zoom: 4,
      layers: [vis.base_layer]
    });

    vis.colorScale = d3.scaleSequential(d3.interpolateOranges).domain([0,10]);

    L.svg({clickable:true}).addTo(vis.theMap);
    vis.overlay = d3.select(vis.theMap.getPanes().overlayPane);
    vis.svg = vis.overlay.select('svg').attr("pointer-events", "auto");

    vis.Dots = vis.svg.selectAll('circle')
      .data(vis.data)
      .join('circle')
      .attr("fill", d => vis.colorScale(d.mag))
      .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
      .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y)
      .attr("r", 3)
      .on('mouseover', function(event,d) {
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
              Place: ${d.place}
            </div>`);
        })
      .on('mousemove', (event) => {
        d3.select('#tooltip')
         .style('left', (event.pageX + 10) + 'px')   
          .style('top', (event.pageY + 10) + 'px');
       })              
      .on('mouseleave', function() {
        d3.select(this).transition()
          .duration('150')
          .attr("stroke", "none")
          .attr("stroke-width", 0)
          .attr('r', 3);

        d3.select('#tooltip').style('opacity', 0);
        });

    vis.theMap.on("zoomend", function(){
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

    let currentData = vis.groupedDataByMonth[vis.currentIndex] ? vis.groupedDataByMonth[vis.currentIndex][1] : [];

    vis.Dots = vis.svg.selectAll('circle')
      .data(currentData)
      .join('circle')
      .attr("fill", d => vis.colorScale(d.mag))
      .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
      .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y)
      .attr("r", 3)
      .on('mouseover', function(event,d) {
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
              Place: ${d.place}
            </div>`);
        })
      .on('mousemove', (event) => {
        d3.select('#tooltip')
         .style('left', (event.pageX + 10) + 'px')   
          .style('top', (event.pageY + 10) + 'px');
       })              
      .on('mouseleave', function() {
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
