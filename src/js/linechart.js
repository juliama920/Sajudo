class LineChart{

constructor(globalFlags, redrawOthers) {
    this.data = globalFlags;
    this.redrawOthers = redrawOthers;

    let disDropdown = document.getElementById('disDropdown');
    disDropdown.addEventListener('change', (e,d) => {
        if (d3.select('#disDropdown').property('value') === 'Disney'){
            this.data.selectedDistributor = 'Walt Disney Studios Motion Pictures';
            this.redrawOthers(this);
            this.data.lineChart.draw();
            
        }
        else if (d3.select('#disDropdown').property('value') === 'TwentiethCenturyFox'){
            this.data.selectedDistributor = 'Twentieth Century Fox';
            this.redrawOthers(this);
            this.data.lineChart.draw();
        }
        else if(d3.select('#disDropdown').property('value') === 'ParamountPictures') {
            this.data.selectedDistributor = 'Paramount Pictures';
            this.redrawOthers(this);
            this.data.lineChart.draw();

        }
        else { // Warner Bros
            this.data.selectedDistributor = 'Warner Bros.';
            this.redrawOthers(this);
            this.data.lineChart.draw();
        }
    })


    
    let svg = d3.select('.lineChart');
    const MARGIN = {left: 70, right: 50, bottom: 100, top: 50};
    const CHART_HEIGHT = svg.style('height').slice(0,-2);
    const CHART_WIDTH = svg.style('width').slice(0,-2); // 1000

    this.xScale = d3.scaleTime()
        .domain([new Date('1927'), new Date('2021')])
        .range([0, CHART_WIDTH- 100])
        .nice();
    this.yScale = d3.scaleLinear()
        .domain([0, 82372098598]) 
        .range([CHART_HEIGHT -MARGIN.bottom - MARGIN.top, 10 - MARGIN.top])
        .nice();
    // xScale for timeline
    let xScale = d3.scaleTime()
        .domain([new Date('1927'), new Date('2021')])
        .range([0, CHART_WIDTH- 100])
        .nice();

    svg.append('text')
        .attr('id', 'textY')
        .text('Net Gross Income in Billions of Dollars')
        .attr('transform', 'rotate(-90)')
        .attr('x', -320)
        .attr('y', 20)
        .attr('fill', 'black')
        .attr('font-size', '16px')
        .attr('font-weight','bold');

    svg.append('text')
        .text('Time in Years')
        .attr('transform', `translate(400,475)`)
        .attr('fill', 'black')
        .attr('font-size', '16px')
        .attr('font-weight','bold');
    
    this.drawAxis(this.xScale, this.yScale);
    this.drawLines(this.xScale,this.yScale,this.data.grossing);

    // Timeline
    let timeline = svg.append('g')
        .attr('id', 'timeline');
    timeline.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', 30)
        .attr('width', CHART_WIDTH - 100)
        .style('fill', 'aliceblue');
    timeline.attr('transform', `translate(${MARGIN.left},${CHART_HEIGHT - 60})`)
        .call(d3.axisBottom(this.xScale)
        .tickFormat(d3.timeFormat('%Y')));
    timeline.selectAll('line')
        .attr('y2', 30)
        .style('stroke', 'grey');
    timeline.select('path')
        .remove();
    timeline.selectAll('text')
        .attr('font-size', '15px')

    const g = svg.append('g')
        .attr('transform',`translate(${MARGIN.left},${CHART_HEIGHT - 60})`)
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
                
                if(selection.nodes()[0].__brush.selection === null) {
    
                    hold.xScale = d3.scaleTime().domain([new Date('1927'), new Date('2021')])
                        .range([0, CHART_WIDTH - 100]).nice();
                    hold.yScale= d3.scaleLinear()
                        .domain([0, 82372098598])
                        .range([CHART_HEIGHT - MARGIN.bottom - MARGIN.top, 10 - MARGIN.top])
                        .nice();

                    hold.drawAxis(hold.xScale,hold.yScale);    
                    hold.drawLines(hold.xScale, hold.yScale, hold.data.grossing);
                    

                }
                else if (selection) {
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

                    hold.xScale = d3.scaleTime()
                        .domain([dateA, dateB])
                        .range([0, CHART_WIDTH - 100]).nice();
                    hold.yScale= d3.scaleLinear()
                        .domain([0, max])
                        .range([CHART_HEIGHT - MARGIN.bottom - MARGIN.top, 10 - MARGIN.top])
                        .nice();
                        
                    hold.drawLines(hold.xScale, hold.yScale, filteredData);

                    if (svg.select('.cover').nodes().length > 0){
                        svg.select('.cover').raise();
                        svg.select('.cover2').raise();
                    }
                    else {
                        svg.append('rect')
                            .attr('class','cover')
                            .attr('height',380)
                            .attr('width', 50)
                            .attr('x', 870)
                            .attr('y', 0)
                            .style('fill','white');
                        svg.append('rect')
                            .attr('class', 'cover2')
                            .attr('height', 430)
                            .attr('width', 70)
                            .attr('x', 0)
                            .attr('y', 0)
                            .style('fill', 'white');
                    }
                    hold.drawAxis(hold.xScale, hold.yScale);
                    
                    svg.select('#textY').raise();
                }
            });
        selection.call(brush);
        return selection;
    })
}

drawAxis(xScale, yScale) {
    let svg = d3.select('.lineChart');
    const MARGIN = {left: 70, right: 50, bottom: 100, top: 50};
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
    
    let hold = this;
    let lines = svg.append('g')
        .attr('id', 'lines')
        .selectAll('path')
        .data(distributors)
        .join('path')
        .attr('class', (d)=> d[0].replaceAll(' ', '').replaceAll('.','').replaceAll('-','')
            .replaceAll('(','')
            .replaceAll(')',''))
        .attr('fill', 'none')
        .attr('stroke-width', 3)
        .attr('d', ([group, values]) => d3.line()
            .x(function(d) {
                let temp = (hold.data.combined.filter(function(a){return a['Title'] === d['Title']}))
                let date = (temp[0]['Release Date'])
                if(date.length === 0) {
                    date = d['Title'].substr(-5).slice(0,-1);
                }
                
                date = d['Title'].substr(-5).slice(0,-1);
                return xScale(new Date(date));
            })
            .y(function(d) {
                let date = d['Title'].substr(-5).slice(0,-1);
                // if (xScale(new Date(date)) >= 0)
                    return yScale(d['salesAccum']);
            })(values))
        .on('mouseover', function(e) {
            hold.data.toolTip.clearData();
            let className = (this.getAttribute('class'));
            distributors.forEach(function(d) {
                if(className === d[0]['Distributor'].replaceAll(' ', '').replaceAll('.','').replaceAll('-','')
                .replaceAll('(','')
                .replaceAll(')',''))
                    hold.data.tooltipValues.Distributor = (d[0]['Distributor']).toString();
            });

            // d3.select('#toolTip').attr('hidden', null);
            hold.data.toolTip.draw(e.x, e.y);
            // If Distributor is selected, don't change that path on mouseover
            if (d3.selectAll('#click').nodes().length > 0){ 
                let holder = d3.selectAll('#click').nodes()[0];
                if (this !== holder){
                    lines.attr('id', 'hover');
                    d3.select(holder).attr('id', 'click');
                    d3.select(this)
                        .attr('id', '');
                }
            }
            else { // If no distributor is selected all lines indicate mouseover
            lines.attr('id', 'hover');
            d3.select(this)
                .attr('id', '');
            }
        })
        .on('mouseout', function() {
            
            // d3.select('#toolTip').attr('hidden', 'hidden');
            // If Distributor is selected, don't change that path on mouseout
            if (d3.selectAll('#click').nodes().length > 0){
                let holder = d3.selectAll('#click').nodes()[0];
                lines.attr('id', 'hover');
                d3.select(holder).attr('id', 'click');
            } else {
                lines.attr('id', '');
            }
            
            hold.data.toolTip.destroy();
        })
        .on('click', function(event) {
            // Distributor gets selected
            hold.data.selectedDistributor = event.target.__data__[0];
            lines.attr('id', 'hover');
            d3.select(this)
                .attr('id', 'click')
                .raise();

            hold.drawCircles(xScale, yScale, hold.data.grossing);
            //hold.redrawOthers(hold);
            globalFlags.table.draw();
            if(d3.select('#type').property('value')==="scatter"){
                globalFlags.bubbleChart.removeScatter()
                globalFlags.bubbleChart.drawScatter();
        
            }
            else{ globalFlags.bubbleChart.draw(); }
        
        });
    
    // Reset path selector
    svg.on('click', function(event) {
        if (event.x < 985 &&
            event.x > 90 &&
            event.y > 622 &&
            event.y < 650) {
                // Click event is in brush area, ignore
            }
        // Click event is a svg object, reset linechart and table    
        else if((event.path.length === 7)) { 
            lines.attr('id', '');
            hold.data.selectedDistributor = null;
            hold.data.selectedMovie = null;
            hold.redrawOthers(hold);

            svg.select('#circles').remove();
            hold.data.toolTip.destroy();
        }  
    });
    lines.attr('transform', `translate(${80}, ${50})`);
    this.draw();
}

drawCircles(xScale, yScale, data) {

    let svg = d3.select('.lineChart');
    let distributors = d3.group(data, (d)=> d['Distributor']);
    let selectedData = distributors.get(this.data.selectedDistributor);

    let genre=['Action', 'Drama', 'Animation',  'Adventure',
    'Crime', 'Horror', 'Comedy', 'Biography' ,'Mystery', 'Fantasy'];
    let colormap=d3.scaleOrdinal().domain(genre).range(d3.schemeCategory10)  
    

    // d3.select(`.${this.data.selectedDistributor.replaceAll(' ', '').substring(0,5)}`)
    let hold = this;

    svg.select('#circles').remove();
    let circles = svg.append('g')
        .attr('id','circles')
        .selectAll('circle')
        .data(selectedData)
        .join('circle')
        .attr('id', 'unselected')
        .attr('class', (d) => d.Title.replaceAll(' ','')
            .replaceAll(':','')
            .replaceAll('-','')
            .replaceAll('(','')
            .replaceAll(')','')
            .replaceAll('\'','')
            .replaceAll('!','')
            .replaceAll(',',''))
        .attr('cx', function(d) {
            let date = d['Title'].substr(-5).slice(0,-1);
            // console.log(date);
            // console.log(xScale.invert(900));
            if(new Date(date) < xScale.invert(900) && new Date(date) > xScale.invert(0)) 
                return xScale(new Date(date)) + 80;
        })
        .attr('cy', function(d) {
            
            let date = d['Title'].substr(-5).slice(0,-1);
            if(new Date(date) < xScale.invert(900)&& new Date(date) > xScale.invert(0))
                return yScale(d['salesAccum']) + 50;
        })
        .attr('r', 5)
        .on('mouseover', function (e){
            let className = (this.getAttribute('class'));
            selectedData.forEach(function(d) {
                if(className === d['Title'].replaceAll(' ','')
                .replaceAll(':','')
                .replaceAll('-','')
                .replaceAll('(','')
                .replaceAll(')','')
                .replaceAll('\'','')
                .replaceAll('!','')
                .replaceAll(',','') ) {
                    hold.data.tooltipValues.Movie = (d['Title']).toString();
                    hold.data.tooltipValues.Distributor = (d['Distributor']).toString()
                    
            hold.data.tooltipValues['Net Gross Income'] = '$' + d['World Sales (in $)'];
                }
            });

            
            hold.data.toolTip.draw(e.x, e.y);

            if (d3.selectAll('#selected').nodes().length > 0){ 
                let holder = d3.selectAll('#selected').nodes()[0];
                if (this !== holder){
                    circles.attr('id', 'unselected')
                    .style('fill', 'white');
                    d3.select(holder).attr('id', 'selected')
                    .style('fill', function(d) {
                        let temp = (hold.data.combined.filter(function(a){return a['Title'] === d['Title']}))
                        return colormap(temp[0]['genre']);
                    });
                    d3.select(this)
                        .attr('id', 'hover');
                }
            }
            else { // If no movie is selected all circles indicate mouseover
            circles.attr('id', 'unselected')
                .style('fill', 'white');
            d3.select(this)
                .attr('id', 'hover');
            }
        })
        .on('mouseout', function() {
            if (d3.selectAll('#selected').nodes().length > 0){

                let holder = d3.selectAll('#selected').nodes()[0];

                circles.attr('id', 'unselected')
                .style('fill', 'white');

                d3.select(holder).attr('id', 'selected')
                .style('fill', function(d) {
                    let temp = (hold.data.combined.filter(function(a){return a['Title'] === d['Title']}))
                    return colormap(temp[0]['genre']);
                });
            } else {
                circles.attr('id', 'unselected')
                .style('fill', 'white');
            }
            hold.data.toolTip.destroy();
        })
        .on('click' , function(d) {
            // Movie gets selected
            let title = d.path[0].__data__.Title.replaceAll(' ','')
                .replaceAll(':','')
                .replaceAll('-','')
                .replaceAll('(','')
                .replaceAll(')','')
                .replaceAll('\'','')
                .replaceAll('!','')
                .replaceAll(',','');
                
            d3.select('#circles')
            .selectAll('circle')
            .attr('id', 'unselected')
            .attr('r', 5)
            .style('fill', 'white');

            svg.select(`.${title}`)
                .attr('id', 'selected')
                .attr('r', 8)
                .style('fill', function(d) {
                    let temp = (hold.data.combined.filter(function(a){return a['Title'] === d['Title']}))
                    return colormap(temp[0]['genre']);
                })
                .raise();

            hold.data.selectedMovie = d.path[0].__data__.Title;
            let t1=hold.data.combined.filter(function(a){return a['Title'] === hold.data.selectedMovie})
            hold.data.Genre=t1[0].genre;
            hold.redrawOthers(hold);
            
        });
    svg.select('.cover').raise();
    svg.select('text').raise();
    // svg.select('#x-axis').raise();
}

draw(){
    // Distributor is selected
    if (this.data.selectedDistributor) {
        this.data.tooltipValues.Movie = this.data.selectedDistributor;

        // Reset Movie selector
        d3.select('#circles')
            .selectAll('circle')
            .attr('id', 'unselected')
            .attr('r', 5)
            .style('fill', 'white');
        
        let selected = this.data.selectedDistributor;
        d3.selectAll('path')
            .attr('id', 'hover');
        d3.select(`.${selected.replaceAll(' ', '')
                .replaceAll('.','')
                .replaceAll('-','')
                .replaceAll('(','')
                .replaceAll(')','')
                .replaceAll('!','')}`)
            .attr('id', 'click')
            .raise();
        
        this.drawCircles(this.xScale, this.yScale, this.data.grossing);
    }
    // Movie is selected
    if (this.data.selectedMovie) {
        
        let genre=['Action', 'Drama', 'Animation',  'Adventure',
        'Crime', 'Horror', 'Comedy', 'Biography' ,'Mystery', 'Fantasy'];
        let colormap=d3.scaleOrdinal().domain(genre).range(d3.schemeCategory10)  
        let hold = this;

        let movie = this.data.selectedMovie.replaceAll(' ','')
            .replaceAll(':','')
            .replaceAll('-','')
            .replaceAll('(','')
            .replaceAll(')','')
            .replaceAll('\'','')
            .replaceAll(',','');

        d3.select('#circles')
            .selectAll('circle')
            .attr('id', 'unselected')
            .attr('r', 5)
            .style('fill', 'white');
        
        d3.select('#circles')
            .select(`.${movie}`)
            .attr('id', 'selected')
            .style('fill', function(d) {
                let temp = (hold.data.combined.filter(function(a){return a['Title'] === d['Title']}))
                return colormap(temp[0]['genre']);
            })
            .attr('r', 8)
            .raise();
    }
}
}
    