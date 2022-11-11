class BarChart{

    constructor(globalFlags, redrawOthers, data = globalFlags.data){
        this.globalFlags = globalFlags;
        this.redrawOthers = redrawOthers;
        this.data = data;
        this.genreSelected = "Action";
    }
    
    //draw function for this chart. do not call drawAll from here.
    draw(){
        this.genreRevenueMap = this.getGenreMap();

        this.createBarChart();
        this.createDropdown();
        this.registerListeners();
        this.drawRects();
    }

    drawRects(){
        d3.select(".barChart").select("#rects").remove();

        let rects = d3.select(".barChart").append("g").attr("id", "rects");

        let topThirty = this.genreRevenueMap.get(this.genreSelected).sort((a,b) => a["International Sales (in $)"] > b["International Sales (in $)"]).slice(0,40);

        const margin = {top: 20, right: 30, bottom: 30, left: 90},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
        console.log(this.globalFlags.combined);
        
        rects.selectAll("rect").data(topThirty).join("rect").transition().attr("id", d => d["Title"]).attr("fill", "steelblue")
        .attr("x", (d, i) => {
            let date = d["Release Date"];
            let parse = d3.timeParse("%B %d, %Y");

            if(!parse(date)) {
                parse = d3.timeParse("%Y");
                date = parseInt(d["Title"].match(/\s[(][0-9]*[)]/)[0].replace("(", "").replace(")", ""));
            }
            
            let x = this.xScale(parse(date));
            return x + 80;
        })
        .attr("y", (d, i) => {
            return this.yScale(d["International Sales (in $)"]) - 30;
        })
        .attr("width", (d, i) => {
            return 5;
        })
        .attr("height", (d, i) => {
            return 500 - this.yScale(d["International Sales (in $)"]);
        });
    }

    createBarChart(){
        const margin = {top: 20, right: 30, bottom: 30, left: 90},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select(".barChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);
            
        const keys = this.globalFlags.grossing.columns.slice(1);

        var parseTime = d3.timeParse("%B %d, %Y");

        // Add X axis
        this.xScale = d3.scaleTime()
        .domain(d3.extent(this.globalFlags.grossing, function(d) { 
            return parseTime(d["Release Date"]);
        }))
        .range([ 0, width ]);

        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(this.xScale).ticks(5));

        // Add Y axis
        this.yScale = d3.scaleLinear()
        .domain(d3.extent(this.globalFlags.grossing, function(d) { 
            return parseInt(d["World Sales (in $)"]);
        }))
        .range([ height, 0 ]);

        svg.append("g")
        .call(d3.axisLeft(this.yScale));
    }

    registerListeners(){
        d3.select("#genreDropdown").on("click", e => {
            this.genreSelected = e.target.value;
            console.log(e.target.value);
            this.drawRects();
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

        let movieGenres = this.getAllGrossingGenres();

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