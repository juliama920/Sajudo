class LineChart{

    constructor(globalFlags, redrawOthers) {
        this.data = globalFlags;
        this.redrawOthers = redrawOthers;
        
        let svg = d3.select('.lineChart');
        const MARGIN = {left: 80, right: 50, bottom: 50, top: 50};
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
            .domain([0, 82372098598]) //63597493931  
            .range([CHART_HEIGHT -MARGIN.bottom - MARGIN.top, 10 - MARGIN.top])
            .nice();

        svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(${MARGIN.left},${CHART_HEIGHT - MARGIN.bottom})`)
            .call(d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat('%Y')));
            // .ticks(['1937','1958','1979','2000','2021']));

        svg.append('g')
            .attr('id', 'y-axis')
            .call(d3.axisLeft(yScale)
            .tickFormat((d)=> d/1000000000 + ' B'))
            .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

        this.drawLines(xScale,yScale);
    }

    drawLines(xScale, yScale) {
        let svg = d3.select('.lineChart');
        let distributors = d3.group(this.data.grossing, (d)=> d['Distributor']);
        //console.log(distributors)

        distributors.forEach(function(d) {
            // console.log(d)
            d.sort((a,b) => (a['Title'].slice(-6) > b['Title'].slice(-6))? 1:-1);
            let hold = 0;
            for (let i = 0; i < d.length; i++) {
                hold = hold +  parseFloat(d[i]['World Sales (in $)']);
                d[i]['salesAccum'] = hold;
            }
        });
        // console.log(distributors)
        // for (let i = 0; i < distributors.size; i ++) {
        //     for (let j = 0; j < distributors[i].length; j++) {
        //         console.log(distributors[i])
        //     }
        // }
        // let distrWorldSales = [
        //     {}
        // ]

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
                    // console.log(d)
                    let date = d['Title'].substr(-5).slice(0,-1);
                    // console.log(date);
                    return xScale(new Date(date))
                })
                .y(function(d) {
                    // console.log(d['salesAccum'])
                    // console.log(d)
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

    // constructor(globalFlags, redrawOthers, data = globalFlags.data){
    //     this.globalFlags = globalFlags;
    //     this.redrawOthers = redrawOthers;
    //     this.data = data;
    //     // console.log(Math.max(this.data['Release Date']));
    //     console.log(this.data);
    //     console.log(this);
    //     //  console.log(d3.max(this.data.map((row) => parseFloat(row.year))))
    // }

    //draw function for this chart. do not call drawAll from here.
    draw(){
    }
}