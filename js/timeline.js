class Timeline {

    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            contextHeight: 50,
        }
        this.keyMetric = _config.keyMetric;
        this.data = _data;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = d3.select(vis.config.parentElement).node().getBoundingClientRect().width;
        vis.height = d3.select(vis.config.parentElement).node().getBoundingClientRect().height;
        vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };

        vis.svg = d3.select(vis.config.parentElement).append('svg')
            .attr('width', vis.width + vis.margin.left + vis.margin.right)
            .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate(${vis.margin.left},${vis.margin.top})`);

        vis.x = d3.scaleTime()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom(vis.x);
        vis.yAxis = d3.axisLeft(vis.y);

        vis.chart = vis.svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${vis.height})`);

        vis.svg.append('g')
            .attr('class', 'y-axis');

            console.log('Initialized visualization');
            vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.filteredData = vis.data.filter(d => d.time && d.mag);
        vis.x.domain(d3.extent(vis.filteredData, d => new Date(d.time)));
        vis.y.domain([3, d3.max(vis.filteredData, d => d.mag)]);

        vis.svg.select('.x-axis')
            .call(vis.xAxis);

        vis.svg.select('.y-axis')
            .call(vis.yAxis);

        vis.circles = vis.svg.selectAll('.circle')
            .data(vis.filteredData)
            .join('circle')
            .attr('class', 'circle')
            .attr('cx', d => vis.x(new Date(d.time)))
            .attr('cy', d => vis.y(d.mag))
            .attr('r', 3)
            .attr('fill', 'steelblue')
            .on('mouseover', function (event, d) {
                d3.select(this).transition()
                    .duration(150)
                    .attr("fill", "red")
                    .attr("r", 5);

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
            .on('mouseleave', function () {
                d3.select(this).transition()
                    .duration(150)
                    .attr("fill", "steelblue")
                    .attr("r", 3);

                d3.select('#tooltip').style('opacity', 0);
            });

        console.log('Updated visualization');
    }

    renderVis() {
        let vis = this;

        //not using right now... 
    }
}