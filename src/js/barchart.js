class BarChart{

    constructor(globalFlags, redrawOthers, data = globalFlags.data){
        this.globalFlags = globalFlags;
        this.redrawOthers = redrawOthers;
        this.data = data;
        this.globalFlags.Genre = "Action";
        this.genre=['Action', 'Drama', 'Animation',  'Adventure',
        'Crime', 'Horror', 'Comedy', 'Biography' ,'Mystery', 'Fantasy']
    }
    
    //draw function for this chart. do not call drawAll from here.
    draw(){
        this.genreRevenueMap = this.getGenreMap();
        this.createBarChart();
        this.drawAxis();
        if(d3.select("#genreDropdown").empty()) this.createDropdown();
        this.drawRects();
        this.registerListeners();
    }

    drawRects(){
        d3.select(".barChart").select("#rects").remove();

        let rects = d3.select(".barChart").append("g").attr("id", "rects");
        let topThirty = this.genreRevenueMap.get(this.globalFlags.Genre).sort((a,b) => a["International Sales (in $)"] > b["International Sales (in $)"]).slice(0,20);

        const margin = {top: 20, right: 30, bottom: 30, left: 90},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
        //console.log(this.globalFlags.combined);
        
        rects.selectAll("rect").data(topThirty).join("rect").transition().attr("id", d => d["Title"]).attr("fill", "steelblue")
        .attr("x", (d, i) => {
            let date = d["Release Date"];
            let parse = d3.timeParse("%B %d, %Y");

            if(!parse(date)) {
                parse = d3.timeParse("%Y");
                date = parseInt(d["Title"].match(/\s[(][0-9]*[)]/)[0].replace("(", "").replace(")", ""));
            }
            
            let x = this.xScale(parse(date));
            return x + 90 ;
        })
        .attr("y", (d, i) => {
            return height + 20 - this.yScale(d["International Sales (in $)"]);
            return this.yScale(d["International Sales (in $)"]) + this.yScale(d["International Sales (in $)"]);
        })
        .attr("width", (d, i) => {
            return 8;
        })
        .attr("height", (d, i) => {
            return  this.yScale(d["International Sales (in $)"]);
        })
        .style('stroke', 'black');
    }

    createBarChart(){
        const margin = {top: 20, right: 30, bottom: 30, left: 90},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select(".barChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
        // .append("g")
        // .attr("transform",
            // `translate(${margin.left}, ${margin.top})`); 

            
        svg
        .append('text')
        // .attr('id', 'testText')
        .text('Net Gross Income in Billions of Dollars')
        .attr('transform', 'rotate(-90)')
        .attr('x', -340)
        .attr('y', 40)
        .attr('fill', 'black')
        .attr('font-size', '16px')
        .attr('font-weight','bold');

        svg.append('text')
            .text('Time in Years')
            .attr('transform', `translate(400,505)`)
            .attr('fill', 'black')
            .attr('font-size', '16px')
            .attr('font-weight','bold');
    }

            
    drawAxis(){    
        const margin = {top: 20, right: 30, bottom: 30, left: 90},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        
        d3.select('.barChart').select('#axis').remove();

        const svg = d3.select(".barChart")
        .append("g")
        .attr('id', 'axis')
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
        let topTwenty = this.genreRevenueMap.get(this.globalFlags.Genre).sort((a,b) => a["International Sales (in $)"] > b["International Sales (in $)"]).slice(0,20);
// console.log(topTwenty);
        const keys = this.globalFlags.grossing.columns.slice(1);

        var parseTime = d3.timeParse("%B %d, %Y");

        // Add X axis
        this.xScale = d3.scaleTime()
        .domain(d3.extent(topTwenty, function(d) { 
            return parseTime(d["Release Date"]);
        }))
        .range([ 0, width ])
        .nice();

        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(this.xScale)
        .tickFormat(d3.timeFormat('%Y')));


        let max = (d3.max(topTwenty, function(d) { return +d["World Sales (in $)"];} ))
        
        // Add Y axis
        this.yScale = d3.scaleLinear()
        .domain([0, max])
        // .domain(d3.extent(this.globalFlags.grossing, function(d) { 
        //     return parseInt(d["World Sales (in $)"]);
        // }))
        .range([ height, 0 ])
        .nice();

        svg.append("g")
        .call(d3.axisLeft(this.yScale)
        .tickFormat((d)=> d/1000000000 + ' B'));

    }

    registerListeners(){
        let hold = this;
        d3.select("#genreDropdown").on("click", e => {
            this.globalFlags.Genre = e.target.value;
            this.drawAxis();
            this.drawRects();
            this.registerListeners();
        });

        let bars = d3.select(".barChart").select("#rects")
        .on("mouseover", (e,d) => {
            // d3.select('#toolTip').attr('hidden', null);
            if(e != this.e) {
                this.globalFlags.tooltipValues.Genre = this.globalFlags.Genre;
                this.globalFlags.tooltipValues.Movie = e.target.id;
            
            }
            this.e = e;
            

            if(d3.selectAll('.barClick').nodes().length > 0) {
                let holder = d3.selectAll('.barClick').nodes()[0];
                if (e.path[0] !== holder) {
                    bars.selectAll('rect').attr('class', 'barHover');
                    d3.select(holder).attr('class', 'barClick');
                    d3.select(e.path[0]).attr('class', '');
                }
            }
            else { 
            bars.selectAll('rect').attr('class', 'barHover');
            d3.select(e.path[0])
                .attr('class', '');
            }
        })
        .on('mouseout', function(e) {
            // d3.select('#toolTip').attr('hidden', 'hidden');
            // hold.globalFlags.tooltipValues.Movie = null;

            if (d3.selectAll('.barClick').nodes().length > 0) {
                let holder = d3.selectAll('.barClick').nodes()[0];
                bars.selectAll('rect').attr('class', 'barHover');
                d3.select(holder).attr('class', 'barClick')
            } else {
                bars.selectAll('rect').attr('class', '');
            }
        })
        .on('click', function(e) {
            bars.selectAll('rect').attr('class', 'barHover');
            d3.select(e.path[0]).attr('class', 'barClick');
        });


        // this.globalFlags.tooltipValues.Genre = this.genreSelected;

        let barchart = d3.select(".barChart");

        barchart.on("mousemove", e => {
            this.globalFlags.toolTip.draw(e.x, e.pageY);
        });
    }

    createDropdown(){
        let barChartDiv = d3.select("#barChart");
        let dropDown = barChartDiv.append("select").attr("name", "genres").attr("id", "genreDropdown");

        for(let genre of this.genreRevenueMap.keys()){
            // console.log(genre);
            dropDown.append("option").attr("value", genre).text(genre);
        }
    }

    getGenreMap(){
        let genreRevenueMap = new Map();

        let movieGenres = this.genre//this.getAllGrossingGenres();

        for(let genre of movieGenres){
            genreRevenueMap.set(genre, [])
        }

        for(let row of this.globalFlags.grossing){
            for(let genre of movieGenres){
                let rowGenres = row["Genre"].replaceAll("[", "").replaceAll("]", "").replaceAll("'","").replaceAll(" ", "").split(",");
                if(rowGenres.includes(genre)) genreRevenueMap.get(genre).push(row);
            }
        }
        
        return genreRevenueMap;
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
}