//attributes
let globalFlags = {};

let movieCSVPath = "../../data/movies(1986-2016).csv";
let grossingCSVPath = "../../data/Highest Holywood Grossing Movies.csv";

parseCSVs();

let barChart = new BarChart(globalFlags, redrawOthers);
let bubbleChart = new BubbleChart(globalFlags, redrawOthers);
let lineChart = new LineChart(globalFlags, redrawOthers);
let streamChart = new StreamChart(globalFlags, redrawOthers);
let table = new Table(globalFlags, redrawOthers);

console.log(streamChart instanceof StreamChart);

drawAll();

//Run draw functions for every Vis
function drawAll(){
    console.log("drawing All");

    barChart.draw();
    bubbleChart.draw();
    lineChart.draw();
    streamChart.draw();
    table.draw();
}

function redrawOthers(objectCalledFrom){
    console.log("calling redrawOthers");
    if(objectCalledFrom instanceof BarChart) {
        bubbleChart.draw();
        lineChart.draw();
        streamChart.draw();
        table.draw();
    }

    if(objectCalledFrom instanceof BubbleChart) {
        barChart.draw();
        lineChart.draw();
        streamChart.draw();
        table.draw();
    }

    if(objectCalledFrom instanceof LineChart){
        streamChart.draw();
        table.draw();
        barChart.draw();
        bubbleChart.draw();
    }

    if(objectCalledFrom instanceof StreamChart){
        console.log("called from StreamChart");
        table.draw();
        barChart.draw();
        bubbleChart.draw();
        lineChart.draw();
    }

    if(objectCalledFrom instanceof Table){
        barChart.draw();
        bubbleChart.draw();
        lineChart.draw();
        streamChart.draw();
    }
}

function parseCSVs(){
    Promise.all([d3.csv(movieCSVPath), d3.csv(grossingCSVPath)]).then(data => {
        //Load in movies csv
        globalFlags.movies = data[0];
        globalFlags.grossing = data[1];
    
        console.log(globalFlags);
    
        let grossingMovieNames = Array.from(d3.group(globalFlags.grossing, d => d["Title"]).keys());
        // returns array of movie data entres that are in the grossing set 
        console.log(globalFlags.movies.filter(movie => {
            return grossingMovieNames.find(key => {
                return key.toLowerCase().replace(" ", "").includes(movie.name.toLowerCase().replace(" ", ""));
            });    
        }));
    
        // console.log(grossingMovieNames);
    });
}

