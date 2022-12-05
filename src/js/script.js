//attributes
let globalFlags = {
    tooltipValues: {}
};

let movieCSVPath = "./data/movies(1986-2016).csv";
let grossingCSVPath = "./data/Highest Holywood Grossing Movies.csv";
let combinedCSVPath = "./data/combined.csv";
//Wait for promise to resolve with data and then call draw functions
async function loadData() {
    const movieData = await d3.csv("./data/movies(1986-2016).csv");
    const grossData = await d3.csv("./data/Highest Holywood Grossing Movies.csv");
    const combined = await d3.csv("./data/combined.csv")
    return {movieData, grossData, combined};
}
// loadData().then((data)=> console.log(data[0]));
loadData().then((data)=>{
    console.log('movie data')
    console.log(data.movieData);
})

Promise.all([d3.csv(movieCSVPath), d3.csv(grossingCSVPath), d3.csv(combinedCSVPath)]).then(data => {
    console.log(data);
    //Load in movies csv
    console.log('data loaded');
    globalFlags.movies = data[0];
    globalFlags.grossing = data[1];
    globalFlags.combined=data[2];
    let barChart = new BarChart(globalFlags, redrawOthers);
    let bubbleChart = new BubbleChart(globalFlags, redrawOthers);
    let lineChart = new LineChart(globalFlags, redrawOthers);
    let streamChart = new StreamChart(globalFlags, redrawOthers);
    let table = new Table(globalFlags, redrawOthers);
    let infoTable = new Info(globalFlags, redrawOthers);
    let toolTip = new Tooltip(globalFlags);

    globalFlags.barChart = barChart;
    globalFlags.bubbleChart = bubbleChart;
    globalFlags.lineChart = lineChart;
    globalFlags.streamChart = streamChart;
    globalFlags.table = table;
    globalFlags.infoTable = infoTable;
    globalFlags.toolTip = toolTip;

    globalFlags.selectedMovie = null;
    globalFlags.selectedDistributor = null;

    // console.log(streamChart instanceof StreamChart);
    drawAll(barChart, bubbleChart, lineChart, streamChart, table, infoTable);
});


//Run draw functions for every Vis
function drawAll(barChart, bubbleChart, lineChart, streamChart, table,infoTable){
    // console.log("drawing All");

    barChart.draw();
    if(d3.select('#type').property('value')==="scatter"){
        bubbleChart.drawScatter();
    }
    else{ bubbleChart.draw(); }
    
    lineChart.draw();
    streamChart.draw();
    table.draw();
    infoTable.drawTable();
}

function redrawOthers(objectCalledFrom){
    if(objectCalledFrom instanceof BarChart) {
        globalFlags.lineChart.draw();
        globalFlags.streamChart.draw();
        globalFlags.table.draw();
        if(d3.select('#type').property('value')==="scatter"){
            globalFlags.bubbleChart.drawScatter();
    
        }
        else{ globalFlags.bubbleChart.draw(); }
        //globalFlags.bubbleChart.draw();
        globalFlags.infoTable.drawTable();
    }

    if(objectCalledFrom instanceof BubbleChart) {
        globalFlags.lineChart.draw();
        globalFlags.streamChart.draw();
        globalFlags.table.draw();
        globalFlags.barChart.draw();
        globalFlags.infoTable.drawTable();
    }

    if(objectCalledFrom instanceof LineChart){
        globalFlags.streamChart.draw();
        globalFlags.table.draw();
        globalFlags.barChart.draw();
        globalFlags.infoTable.drawTable();
        if(d3.select('#type').property('value')==="scatter"){
            globalFlags.bubbleChart.removeScatter()
            globalFlags.bubbleChart.drawScatter();
    
        }
        else{ globalFlags.bubbleChart.draw(); }
        
    }

    if(objectCalledFrom instanceof StreamChart){
        //console.log("called from StreamChart");
        globalFlags.lineChart.draw();
        globalFlags.table.draw();
        globalFlags.barChart.draw();
        if(d3.select('#type').property('value')==="scatter"){
            globalFlags.bubbleChart.removeScatter()
            globalFlags.bubbleChart.drawScatter();
    
        }
        else{ globalFlags.bubbleChart.draw(); }
        globalFlags.infoTable.drawTable();
        //globalFlags.infoTable.drawTable();
    }

    if(objectCalledFrom instanceof Table){
        globalFlags.lineChart.draw();
        globalFlags.streamChart.draw();
        globalFlags.barChart.draw();
        if(d3.select('#type').property('value')==="scatter"){
            globalFlags.bubbleChart.removeScatter()
            globalFlags.bubbleChart.drawScatter();
    
        }
        else{ globalFlags.bubbleChart.draw(); }
        globalFlags.infoTable.drawTable();
        //globalFlags.infoTable.drawTable();
    }

    if(objectCalledFrom instanceof Info){
        globalFlags.lineChart.draw();
        globalFlags.streamChart.draw();
        globalFlags.table.draw();
        globalFlags.barChart.draw();
        if(d3.select('#type').property('value')==="scatter"){
            globalFlags.bubbleChart.removeScatter()
            globalFlags.bubbleChart.drawScatter();
    
        }
        else{ globalFlags.bubbleChart.draw(); }
        globalFlags.infoTable.drawTable();
    }
}

// async function loadData() {
//     const movies = await d3.csv('../../data/movies(1986-2016).csv');
//     console.log(movies);
//     const grossing = await d3.csv('../../data/Highest Holywood Grossing Movies.csv');
//     console.log(grossing);
//     return {movies: movies, grossing: grossing};
// }