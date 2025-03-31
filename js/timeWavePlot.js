class TimeWavePlot {
	

	constructor(_config, _data) {
		this.config = {
			parentElement: _config.parentElement,
			containerWidth: _config.containerWidth || 1100,
			containerHeight: _config.containerHeight || 500,
			margin: { top: 40, right: 50, bottom: 80, left: 70 }
		}

		this.originData = _data;
		this.data = _data;
		this.barColor = _config.barColor;
		this.keyMetric = _config.keyMetric;
		this.xAxisLabel = _config.xAxisLabel;
		this.titleText = _config.chartTitle;
        this.direction = _config.direction;
		this.stepSize = _config.stepSize;
		this.tooltipString = _config.tooltipString;
		this.xScaleSlot = _config.xScaleSlot;
		this.xType = _config.xType;
		this.id = _config.id;
		this.initVis();
	}

	initVis() {

		let vis = this;

		// Width and height mark the inner dimensions of the chart area
		vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
		vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

		// Define size of SVG drawing area
		vis.svg = d3.select(vis.config.parentElement).append('svg')
			.attr('class', 'center-container')
			.attr('width', vis.config.containerWidth)
			.attr('height', vis.config.containerHeight);

		// define chart element
		vis.chart = vis.svg.append('g')
			.attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

		// All subsequent functions/properties can ignore the margins

		// Add X axis label:
		vis.chart.append("text")
			.attr("text-anchor", "end")
			.attr("x", vis.width / 2 + vis.config.margin.left - 50)
			.attr("y", vis.height + vis.config.margin.top)
			.text(vis.xAxisLabel);

		// Y axis label:
		vis.chart.append("text")
			.attr("text-anchor", "end")
			.attr("transform", "rotate(-90)")
			.attr("y", -vis.config.margin.left + 30)
			.attr("x", -vis.config.margin.top - 80)
			.text("Magnitude (Converted)")

		// chart title
		vis.chart.append("text")
			.attr("x", (vis.width / 2))             
			.attr("y", 0 - (vis.config.margin.top / 2))
			.attr("text-anchor", "middle")  
			.style("font-size", "16px") 
			.style("text-decoration", "underline")  
			.text(vis.titleText);

		// create brush (for x dim)
		const brush = d3.brushX()
			.extent([[0, 0], [vis.width, vis.height]])
			.on('brush', function({selection}){
				if (selection) vis.brushed(selection)
			})
			.on('end', function({selection}){
				if (!selection) vis.brushed(null)
			});

		// create, draw empty axes
		vis.xAxisGroup = vis.chart.append('g')
			.attr('class', 'axis x-axis')
			.attr('transform', `translate(0, ${vis.height})`)

		vis.yAxisGroup = vis.chart.append('g')
			.attr('class', 'axis y-axis')

		// append brush to canvas
		const brushG = vis.chart.append('g')
			.attr('class', 'brush x-brush')
			.call(brush);
			
		brushSet.push(brushG)
		vis.updateVis()
	}

	updateVis() {

		console.log("called updateVis")
		let vis = this

		vis.filteredData = vis.data.filter(d => d.time && d.mag);

		// x scale: time
		vis.xScale = d3.scaleTime()
			.domain(d3.extent(vis.filteredData, d => new Date(d.time)))
			.range([0, vis.width]);

		// y scale: mag
		let yRange = [vis.height, 0]

		vis.yScale = d3.scaleLinear()
			.domain([3, d3.max(vis.filteredData, d => d.mag)])
			.range(yRange);

		// Initialize axes
		const xAxis = d3.axisBottom(vis.xScale)
		const yAxis = d3.axisLeft(vis.yScale)

		// Add dots
		vis.circles = vis.svg.selectAll('circle')
			.data(vis.filteredData)
			.join('circle')
			.attr('fill', vis.barColor)
			.attr('class', 'circle')
            .attr('cx', d => vis.xScale(new Date(d.time)) + 70)
            .attr('cy', d => vis.yScale(d.mag) + 40)
            .attr('r', 3)

		// show tooltip
		vis.circles.on('mouseover', (event, d) => {
			console.log(d);
			console.log(event);

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

		// move and kill tooltip
		vis.circles.on('mousemove', (event) => {
			d3.select('#tooltip')
				.style('left', (event.pageX + 10) + 'px')
				.style('top', (event.pageY + 10) + 'px');
		})
		.on('mouseleave', () => {
			d3.select('#tooltip').style('opacity', 0);
		});

		// adjust axes to new data.
		vis.xAxisGroup.call(xAxis)
		vis.yAxisGroup.call(yAxis)

	}

	// callback for brush
	brushed(selection) {
		let vis = this

		if (selection) {
			const selectedDomain = selection.map(vis.xScale.invert, vis.xScale); 
			//console.log(selectedDomain)

			// we need to filter out all data points that aren't in this selection, then update all visualizations.
			//console.log(filteredData)
			updateFilters(vis.keyMetric, selectedDomain);
		}
	}
}