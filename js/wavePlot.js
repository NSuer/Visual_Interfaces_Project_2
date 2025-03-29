class WavePlot {
	

	constructor(_config, _data) {
		this.config = {
			parentElement: _config.parentElement,
			containerWidth: _config.containerWidth || 500,
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
		this.flipY = _config.flipY;
		this.tooltipString = _config.tooltipString;
		this.xScaleSlot = _config.xScaleSlot;
		this.id = _config.id;
		this.initVis();
	}

	initVis() {

		let vis = this;


		vis.xScale = null;

		console.log(vis.data)

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
			.attr("x", vis.width / 2 + vis.config.margin.left + 20)
			.attr("y", vis.height + vis.config.margin.top)
			.text(vis.xAxisLabel);

		// Y axis label:
		vis.chart.append("text")
			.attr("text-anchor", "end")
			.attr("transform", "rotate(-90)")
			.attr("y", -vis.config.margin.left + 20)
			.attr("x", -vis.config.margin.top - 100)
			.text("# Of Quakes")

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

		// append brush to canvas
		const brushG = vis.chart.append('g')
			.attr('class', 'brush x-brush')
			.call(brush);
		
		vis.updateVis()
	}

	updateVis() {

		console.log("called updateVis")
		let vis = this

		// determine distribution of the current dataset (with filter applied upstream)
		let aggrData = []
		let xRange = d3.extent(vis.data, d => d[vis.keyMetric])
		console.log("Current xRange: " + xRange)

		let targetXValue = xRange[0]
		while (targetXValue <= xRange[1]) {
			aggrData.push([targetXValue, d3.filter(vis.data, (d) => d[vis.keyMetric] == targetXValue).length])
			targetXValue += this.stepSize
			targetXValue = +(targetXValue.toFixed(1))
		}

		console.log(aggrData)

		// x scale: magnitude or depth (continuous between two extremes)
		vis.xScale = d3.scaleLinear()
			.domain(d3.extent(vis.data, d => d[vis.keyMetric]))
			.range([0, vis.width]);
		//	.paddingInner(0.15);

		// y scale: # of quakes at a given converted intensity (precision 0.0)

		let yRange = null
		if (vis.flipY){
			yRange = [0, vis.height]
		} else {
			yRange = [vis.height, 0]
		}
		vis.yScale = d3.scaleLinear()
			.domain([0, d3.max(aggrData, d => d[1])])
			.range(yRange);

		// Initialize axes
		const xAxis = d3.axisBottom(vis.xScale)
		const yAxis = d3.axisLeft(vis.yScale)

		// Draw the axis (move xAxis to the bottom with 'translate')
		const xAxisGroup = vis.chart.append('g')
			.attr('class', 'axis x-axis')
			.attr('transform', `translate(0, ${vis.height})`)
			.call(xAxis);

		const yAxisGroup = vis.chart.append('g')
			.attr('class', 'axis y-axis')
			.call(yAxis);

		// Add dots
		vis.circles = vis.svg.selectAll('circle')
			.data(aggrData)
			.join('circle')
			.attr('fill', vis.barColor)
			.attr('class', 'circle')
			.attr('cx', d => vis.xScale(d[0]) + 80)
			.attr('cy', d => vis.yScale(d[1]) + 40)
            .attr('r', 3)

		vis.circles.on('mouseover', (event, d) => {
			console.log(d);
			console.log(event);

			d3.select('#tooltip')
				.style('opacity', 1)
				.style('z-index', 1000000)
				.html(`<div class="tooltip-label">
					${vis.tooltipString} ${d[0]}<br>
					Number of Quakes: ${d[1]}<br>
				</div>`);
		})


		vis.circles.on('mousemove', (event) => {
			d3.select('#tooltip')
				.style('left', (event.pageX + 10) + 'px')
				.style('top', (event.pageY + 10) + 'px');
		})
		.on('mouseleave', () => {
			d3.select('#tooltip').style('opacity', 0);
		});
	}

	renderVis() {
		
	}

	brushed(selection) {
		let vis = this

		if (selection) {
			const selectedDomain = selection.map(vis.xScale.invert, vis.xScale); // why is vis.xScale not in scope?
			console.log(selectedDomain)
			// Do something with the new selection
			// ...
			// we need to filter out all data points that aren't in this selection, then update all visualizations.
			console.log(filteredData)
			updateFilters(vis.keyMetric, selectedDomain);

		}
	}
	
	

}