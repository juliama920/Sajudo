class BubbleChart{

    constructor(globalFlags, redrawOthers){//globalFlags, redrawOthers, data = globalFlags.data){
        //this.globalFlags = globalFlags;
        this.redrawOthers = redrawOthers;
        //this.data = data;
        this.gross=globalFlags.grossing
        //this.movies=movies;
        this.combined=globalFlags.combined; 
                                                            //1236005118
        this.filteredData=this.combined.filter(d=>parseFloat(d["World Sales (in $)"])<1650000000)
        let that=this
        document.getElementById("start").addEventListener('change', (e,d)=>{
            //console.log(e.targer.value)
            d3.selectAll(".bubble").remove()
            d3.selectAll(".axes").remove()
            let x=document.getElementById("start").value
            that.filteredData=that.combined.filter(d=>parseFloat(d["World Sales (in $)"])<parseInt(x)*10**6)
            that.draw()
        });

        document.getElementById("companey").addEventListener('change', (e,d)=>{
            //console.log(e.targer.value)
            d3.selectAll(".bubble").remove()
            d3.selectAll(".axes").remove()
            let x=document.getElementById("companey").value
            that.filteredData=that.combined.filter(d=>d["Distributor"]===x)
            that.draw()
        });
        
       
        this.size=d3.scaleLinear().domain([d3.min(this.filteredData.map(d=>parseInt(d["score"]))), d3.max(this.filteredData.map(d=>parseInt(d["score"])))]).range([2,10])
        let numNodes = this.gross.length;
        let genre=['Action', 'Drama', 'Animation',  'Adventure',
        'Crime', 'Horror', 'Comedy', 'Biography', 'Mystery', 'Fantasy',
        'Romance'] // removed the family because it had only 1
        this.colormap=d3.scaleOrdinal().domain(genre).range(d3.schemeCategory10)  
    
    }
    

    //draw function for this chart. do not call drawAll from here.
    draw(){

       this.addLegend()
       let minimum=(d3.min(this.filteredData.map(d=>parseInt(d["World Sales (in $)"]))))/10**6
       let maximum=(d3.max(this.filteredData.map(d=>parseInt(d["World Sales (in $)"]))))/10**6
        //console.log(minimum) 
        //console.log(maximum)                              //+1.55*10**2
        let xScale = d3.scaleLinear().domain([minimum, maximum]).range([150,2000])
        let xAxis = d3.axisBottom().scale(xScale);
        let bubbleSvg= d3.select(".bubbleChart")
            .attr ("width", 2500)
            .attr ("height",500)
        bubbleSvg.append("g")
            .attr("class","axes")
            .attr("transform",  `translate(0,450)`).call(xAxis)
        
      let nodeData=this.filteredData
        var simulation = d3.forceSimulation(nodeData)
            .force('charge', d3.forceManyBody().strength(1))
            .force('x', d3.forceX().x(function(d) {
                return (xScale(parseInt(d["World Sales (in $)"])/10**6));
            }))
            .force('y', d3.forceY(400 / 2))
            .force('collision', d3.forceCollide().radius(function(d) {
                return parseFloat(d.score);
            }));

    let node=d3.select(".bubbleChart")
            .selectAll(".bubble")
            .data(nodeData)
            .join("circle")
            .attr("class","bubble")
            .attr("r",d=> d.score)
            .attr("cx",d=>(parseInt(d["World Sales (in $)"])/10**6))
            .attr("cy",500/2)
            .attr("fill",d=> this.colormap (d.genre)).attr("opacity",0.9)
            .on('tick', ticked);
            //.call(d3.drag()
            //.on("start",dragstarted)
            //.on("drag",dragged)
            //.on("end",dragended));
 
 /*function dragstarted(d)
 { 
    simulation.restart();
    simulation.alpha(1.0);
    d.fx = d.x;
    d.fy = d.y;
 }

 function dragged(d)
 {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
 }

 function dragended(d)
 {
    d.fx = null;
    d.fy = null;
    simulation.alphaTarget(0.1);
 }*/

    function ticked(){
        node.attr("cx", function(d){ return d.x;})
            .attr("cy", function(d){ return d.y;})
    }

    simulation.on("tick",ticked)

        
        }
    
    addLegend(){
        let genre=['Action', 'Drama', 'Animation',  'Adventure',
        'Crime', 'Horror', 'Comedy', 'Biography', 'Mystery', 'Fantasy',
        'Romance']
        let size=10
        d3.select(".bubbleChart").selectAll("mydots")
            .data(genre)
            .enter()
            .append("rect")
            .attr("x", 30)
            .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", d=>  this.colormap(d))

// Add one dot in the legend for each name.
        d3.select(".bubbleChart").selectAll("mylabels")
            .data(genre)
            .enter()
            .append("text")
            .attr("x", 30 + size*1.2)
            .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", d =>  this.colormap(d))
            .text(d =>  d)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")



        }
    }
