class LeafletMap {

  /**
   * Class constructor with basic configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
    }
    this.data = _data;
    this.initVis();
  }
  
  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;


    //ESRI
    vis.esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    vis.esriAttr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

    //TOPO
    vis.topoUrl ='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    vis.topoAttr = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'

    //Thunderforest Outdoors- requires key... so meh... 
    vis.thOutUrl = 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}';
    vis.thOutAttr = '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    //Stamen Terrain
    vis.stUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}';
    vis.stAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    //this is the base map layer, where we are showing the map background
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

    // Make a color scale based on magnitude 0-10 with a gradient
    vis.colorScale = d3.scaleSequential(d3.interpolateOranges).domain([0,10]);

    //if you stopped here, you would just have a map

    //initialize svg for d3 to add to map
    L.svg({clickable:true}).addTo(vis.theMap)// we have to make the svg layer clickable
    vis.overlay = d3.select(vis.theMap.getPanes().overlayPane)
    vis.svg = vis.overlay.select('svg').attr("pointer-events", "auto")    

    //these are earthquake data points
    vis.Dots = vis.svg.selectAll('circle')
            .data(vis.data) 
            .join('circle')
              .attr("fill", d => vis.colorScale(d.mag))
              .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
              .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y) 
              .attr("r", d => 3)  // --- TO DO- want to make radius proportional to earthquake size? 
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

  }

  updateVis() {
    let vis = this;

    //want to see how zoomed in you are? 
    // console.log(vis.map.getZoom()); //how zoomed am I?
    //----- maybe you want to use the zoom level as a basis for changing the size of the points... ?
    
   
   //redraw based on new zoom- need to recalculate on-screen position
    vis.Dots
      .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
      .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y)
      .attr("fill", d => vis.colorScale(d.mag))
      .attr("r", 3) ; 

  }


  renderVis() {
    let vis = this;

    //not using right now... 
 
  }
}