class StreamChart{

    constructor(globalFlags, redrawOthers, data = globalFlags.data){
        this.globalFlags = globalFlags;
        this.redrawOthers = redrawOthers;
        this.data = data;
    }

    //draw function for this chart. do not call drawAll from here.
    draw(){
        let streamChartSVG = d3.select(".streamChart");
        // streamChartSVG.append("circle").attr("cx", 100).attr("cy", 100).attr("r", 10);

        this.drawStreamChart();
        // streamChartSVG.selectAll("path").data(this.globalFlags).join("path").attr("fill", "steelblue").attr("d", 100).attr("r", 10);

        // console.log("drawing streamchart");

        this.globalFlags.test = "true";
        // this.redrawOthers(this)
    }

    drawStreamChart(){
        console.log(this.globalFlags);
       // set the dimensions and margins of the graph
        const margin = {top: 20, right: 30, bottom: 30, left: 60},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select(".streamChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);

        // Parse the Data
        d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv").then( function(data) {

        // List of groups = header of the csv files
        const keys = data.columns.slice(1)

        // Add X axis
        const x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, width ]);
        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5));

        // Add Y axis
        const y = d3.scaleLinear()
        .domain([-100000, 100000])
        .range([ height, 0 ]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // color palette
        const color = d3.scaleOrdinal()
        .domain(keys)
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf'])

        //stack the data?
        const stackedData = d3.stack()
        .offset(d3.stackOffsetSilhouette)
        .keys(keys)
        (data)

        // Show the areas
        svg
        .selectAll("mylayers")
        .data(stackedData)
        .join("path")
        .style("fill", function(d) { return color(d.key); })
        .attr("d", d3.area()
            .x(function(d, i) { return x(d.data.year); })
            .y0(function(d) { return y(d[0]); })
            .y1(function(d) { return y(d[1]); })
        )

        })
    }
}