class BarChart{

    constructor(globalFlags, redrawOthers, data = globalFlags.data){
        this.globalFlags = globalFlags;
        this.redrawOthers = redrawOthers;
        this.data = data;
    }
    
    //draw function for this chart. do not call drawAll from here.
    draw(){
        console.log("drawing barChart");
        this.createBarChart();
        this.createDropdown();


        // this.redrawOthers(this);
    }

    createBarChart(){
        const margin = {top: 20, right: 30, bottom: 30, left: 90},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select(".barChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);

        // Parse the Data

        // List of groups = header of the csv files
        //TODO: this needs to be genres
        // console.log(this.getAllGrossingGenres());

        let grossingGenres = this.getAllGrossingGenres();
        
        // console.log(this.getAllMovieGenres());
    
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
    }

    createDropdown(){
        let barChartDiv = d3.select("#barChart");
        let dropDown = barChartDiv.append("select").attr("name", "genres").attr("id", "genreDropdown");

        let genreRevenueMap = this.getGenreMap();

        for(let genre of genreRevenueMap.keys()){
            console.log(genre);
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