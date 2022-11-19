class LineChart{

constructor(globalFlags, redrawOthers) {
    this.data = globalFlags;
    this.redrawOthers = redrawOthers;
    
    let svg = d3.select('.lineChart');
    const MARGIN = {left: 80, right: 50, bottom: 100, top: 50};
    const CHART_HEIGHT = svg.style('height').slice(0,-2);
    const CHART_WIDTH = svg.style('width').slice(0,-2);

    // let disney = distributors.get('Walt Disney Studios Motion Pictures');
    // console.log(disney)
    
    // console.log(this.data.grossing.sort((a,b) => (a['Distributor'] < b['Distributor'])? 1:-1))
    

    let xScale = d3.scaleTime()
        .domain([new Date('1927'), new Date('2021')])
        .range([0, CHART_WIDTH- 100]);
        // .nice();
    let yScale = d3.scaleLinear()
        .domain([0, 82372098598]) 
        .range([CHART_HEIGHT -MARGIN.bottom - MARGIN.top, 10 - MARGIN.top])
        .nice();
    
    this.drawAxis(xScale, yScale);
    this.drawLines(xScale,yScale,this.data.grossing);

    // Timeline
    let timeline = svg.append('g')
        .attr('id', 'timeline');
    timeline.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', 30)
        .attr('width', CHART_WIDTH - 100)
        .style('fill', 'aliceblue');
    timeline.attr('transform', `translate(${MARGIN.left},${CHART_HEIGHT - 50})`)
        .call(d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat('%Y')));
    timeline.selectAll('line')
        .attr('y2', 30)
        .style('stroke', 'grey');
    timeline.select('path')
        .remove();
    timeline.selectAll('text')
        .attr('font-size', '15px')


    const g = svg.append('g')
        .attr('transform',`translate(${MARGIN.left},${CHART_HEIGHT - 50})`)
        .attr('class','brushes');
    const brushGroups = svg.selectAll('.brushes');
    let activeBrush = null;
    let activeBrushNode = null;

    let hold = this;
    brushGroups.each(function() {
        const selection = d3.select(this);
        const brush = d3.brushX()
            .extent([[0,0], [CHART_WIDTH - 100, 30]])
            .on('start brush end', function() {
                if (activeBrush && selection !== activeBrushNode) {
                    activeBrushNode.call(activeBrush.move, null);
                }
                activeBrush = brush;
                activeBrushNode = selection;
                if (selection) {
                    const [[x0, y0], [x1, y1]] = selection.nodes()[0].__brush.selection;

                 
                    let dateA = new Date(parseInt(xScale.invert(x0).getYear() + 1900) + '');
                    let dateB = new Date(parseInt(xScale.invert(x1).getYear() + 1900) + '');
                      
                    let distributors = d3.group(hold.data.grossing, (d)=> d['Distributor']);
                    let filteredData = [];
                    distributors.forEach(function(d) {
                        let dFilter = d.filter(function(a) {
                            let dateHold = (new Date(a['Title'].substr(-5).slice(0,-1)));
                            return  dateHold < dateB;
                        })
                        for (let j = 0; j< dFilter.length; j++) {
                            filteredData.push(dFilter[j])
                            if (j === dFilter.length-1 && dFilter.length !== d.length) {
                                filteredData.push(d[j+1]);
                            }
                        }
                    });

                    let max = 0;
                    for (let i = 0; i < filteredData.length; i++) {
                        if (max < filteredData[i]['salesAccum'])
                            max = filteredData[i]['salesAccum']
                    }


                    let xFilter = d3.scaleTime()
                        .domain([dateA, dateB])
                        .range([0, CHART_WIDTH - 100]);
                    let yFilter = d3.scaleLinear()
                        .domain([0, max])
                        .range([CHART_HEIGHT - MARGIN.bottom - MARGIN.top, 10 - MARGIN.top])
                        .nice();
                    hold.drawAxis(xFilter, yFilter);
                    hold.drawLines(xFilter, yFilter, filteredData);
                    
                }
            });
        selection.call(brush);
        return selection;
    })
}

drawAxis(xScale, yScale) {
    let svg = d3.select('.lineChart');
    const MARGIN = {left: 80, right: 50, bottom: 100, top: 50};
    const CHART_HEIGHT = svg.style('height').slice(0,-2);
    const CHART_WIDTH = svg.style('width').slice(0,-2);
    svg.select('#x-axis').remove();
    svg.select('#y-axis').remove();
    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(${MARGIN.left},${CHART_HEIGHT - MARGIN.bottom})`)
        .call(d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat('%Y')));

    svg.append('g')
        .attr('id', 'y-axis')
        .call(d3.axisLeft(yScale)
        .tickFormat((d)=> d/1000000000 + ' B'))
        .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);
    
}

drawLines(xScale, yScale, data) {
    let svg = d3.select('.lineChart');
    svg.select('#lines').remove();
    let distributors = d3.group(data, (d)=> d['Distributor']);
    
    distributors.forEach(function(d) {
        d.sort((a,b) => (a['Title'].slice(-6) > b['Title'].slice(-6))? 1:-1);
        let hold = 0;
        for (let i = 0; i < d.length; i++) {
            hold = hold + parseFloat(d[i]['World Sales (in $)']);
            d[i]['salesAccum'] = hold;
        }
    });

    // let maxDate = xScale.invert(1000);
    // let minDate = xScale.invert(0);
    
    let lines = svg.append('g')
        .attr('id', 'lines')
        .selectAll('path')
        .data(distributors)
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1)
        .attr('d', ([group, values]) => d3.line()
            .x(function(d) {
                let date = d['Title'].substr(-5).slice(0,-1);
                // if (xScale(new Date(date)) >= 0)
                    return xScale(new Date(date))
            })
            .y(function(d) {
                let date = d['Title'].substr(-5).slice(0,-1);
                
                // if (xScale(new Date(date)) >= 0)
                    return yScale(d['salesAccum']);
            })(values))
        .on('mouseover', function() {
            lines.attr('stroke', 'lightgrey');
            d3.select(this)
                .attr('stroke', 'steelblue')
                .attr('stroke-width', '3');
        })
        .on('mouseout', function() {
            lines.attr('stroke', 'steelblue')
                .attr('stroke-width','1');
        });
    lines.attr('transform', `translate(${80}, ${50})`);
}

draw(){
}
}
