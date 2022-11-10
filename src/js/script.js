//attributes
let globalFlags = {};

let movieCSVPath = "../../data/movies(1986-2016).csv";
let grossingCSVPath = "../../data/Highest Holywood Grossing Movies.csv";
let combinedCSVPath = "../../data/combined.csv";
//Wait for promise to resolve with data and then call draw functions
Promise.all([d3.csv(movieCSVPath), d3.csv(grossingCSVPath), d3.csv(combinedCSVPath)]).then(data => {
    //Load in movies csv
    globalFlags.movies = data[0];
    globalFlags.grossing = data[1];
    globalFlags.combined=data[2];

    let barChart = new BarChart(globalFlags, redrawOthers);
    let bubbleChart = new BubbleChart(globalFlags, redrawOthers);
    let lineChart = new LineChart(globalFlags, redrawOthers);
    let streamChart = new StreamChart(globalFlags, redrawOthers);
    let table = new Table(globalFlags, redrawOthers);

    // console.log(streamChart instanceof StreamChart);

    drawAll(barChart, bubbleChart, lineChart, streamChart, table);
});


//Run draw functions for every Vis
function drawAll(barChart, bubbleChart, lineChart, streamChart, table){
    // console.log("drawing All");

    barChart.draw();
    bubbleChart.draw();
    lineChart.draw();
    streamChart.draw();
    table.draw();
}

function redrawOthers(objectCalledFrom){
    // console.log("calling redrawOthers");
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
        // console.log("called from StreamChart");
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

// async function loadData() {
//     const movies = await d3.csv('../../data/movies(1986-2016).csv');
//     console.log(movies);
//     const grossing = await d3.csv('../../data/Highest Holywood Grossing Movies.csv');
//     console.log(grossing);
//     return {movies: movies, grossing: grossing};
// }


