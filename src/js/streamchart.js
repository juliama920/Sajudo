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
        // console.log(this.globalFlags);
       // set the dimensions and margins of the graph
        const margin = {top: 20, right: 30, bottom: 30, left: 90},
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

        // List of groups = header of the csv files
        //TODO: this needs to be genres
        console.log(this.getAllGrossingGenres());

        let grossingGenres = this.getAllGrossingGenres();
        
        console.log(this.getAllMovieGenres());
    
        const keys = this.globalFlags.grossing.columns.slice(1);

        var parseTime = d3.timeParse("%B %d, %Y");

        // Add X axis
        const x = d3.scaleTime()
        .domain(d3.extent(this.globalFlags.grossing, function(d) { 
            return parseTime(d["Release Date"]);
        }))
        .range([ 0, width ]);
        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5));

        // Add Y axis
        const y = d3.scaleLinear()
        .domain(d3.extent(this.globalFlags.grossing, function(d) { 
            return parseInt(d["World Sales (in $)"]);
        }))
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
        (this.globalFlags.grossing)

        console.log(stackedData);

        // Show the areas
        // svg
        // .selectAll("mylayers")
        // .data(stackedData)
        // .join("path")
        // .style("fill", function(d) { return color(d.key); })
        // .attr("d", function(d) {
        //     return d3.area()
        //     .x(function(d, i) { return x(parseTime(d.data["Release Date"])); })
        //     .y0(function(d) { return y(d[0]); })
        //     .y1(function(d) { return y(d[1]); });
        // })
    }

    //Return Array containing all Genres that appear in grossing
    getAllGrossingGenres(){
        let genres = [];
        
        for(let row of this.globalFlags.grossing){
            let movieGenres = row["Genre"].replaceAll("[", "").replaceAll("]", "").replaceAll("'","").replaceAll(" ", "").split(",");

            for(let genre of movieGenres){
                if(!(genres.includes(genre))){
                    genres.push(genre);
                }
            }
        }

        return genres.sort();
    }

    //Return Array containing all Genres that appear in movies
    getAllMovieGenres(){
        let genres = [];
        for(let row of this.globalFlags.movies){
            if(!genres.includes(row.genre)){
                genres.push(row.genre);
            }
        }

        return genres.sort();
    }

    convertGenreValueToArray(){
    }
}