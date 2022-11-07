//attributes
let globalData = {};

Promise.all([d3.csv("../../data/movies(1986-2016).csv"), d3.csv("../../data/Highest Holywood Grossing Movies.csv")]).then(data => {
    //Load in movies csv
    globalData.movies = data[0];
    globalData.grossing = data[1];

    console.log(globalData);

    let grossingMovieNames = Array.from(d3.group(globalData.grossing, d => d["Title"]).keys());

    console.log(globalData.movies.filter(movie => grossingMovieNames.find(d => d == movie.name)));
    console.log(grossingMovieNames);
});

