class BubbleChart{

    constructor(globalFlags, redrawOthers){//globalFlags, redrawOthers, data = globalFlags.data){
        this.redrawOthers = redrawOthers;
        this.gross=globalFlags.grossing
        this.globalFlags = globalFlags;
        this.combined=globalFlags.combined; 
        this.setup()                                                    //1236005118
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
        
       //let min= this.filteredData.filter(d=>parseInt(d["score"])<8?parseInt(d["score"]):parseInt(d["score"])+5 )
       //console.log(min) 
       this.size=  d3.scaleLinear()
        .domain([d3.min(this.filteredData.map(d=>parseInt(d["score"]))),8.5,d3.max(this.filteredData.map(d=>parseInt(d["score"])))]).range([1,8.5,15])
        let numNodes = this.gross.length;
        let genre=['Action', 'Drama', 'Animation',  'Adventure',
        'Crime', 'Horror', 'Comedy', 'Biography'] // removed the family because it had only 1, 'Mystery', 'Fantasy','Romance'
        this.colormap=d3.scaleOrdinal().domain(genre).range(d3.schemeCategory10)  
    
    }
    setup () {
        // adding Event listeners
        let that=this
          let activities = document.getElementById("type");
          activities.addEventListener("change", (e,d)=>{
            if (d3.select('#type').property('value')==="scatter"){
                that.removeBeeswarm();
                that.drawScatter();
            }
            else{
                d3.selectAll(".scatterclass").remove()
                d3.selectAll(".xScatter").remove()
                d3.selectAll(".yScatter").remove()
                that.draw()

            }

          });

          
        
        }


    removeBeeswarm(){
        d3.selectAll(".bubble").remove()
        d3.selectAll(".axes").remove()
        d3.selectAll(".beeslabels").remove()
        d3.selectAll(".beeslegend").remove()
    }
    
    //draw function for this chart. do not call drawAll from here.
    draw(){
        let margin = {top: 10, right: 50, bottom: 30, left: 50},
        width = 1500 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;
        
        this.addLegend()
        let minimum=(d3.min(this.filteredData.map(d=>parseInt(d["World Sales (in $)"]))))/10**6
        let maximum=(d3.max(this.filteredData.map(d=>parseInt(d["World Sales (in $)"]))))/10**6
                             //+1.55*10**2
        let xScale = d3.scaleLinear().domain([0, maximum]).range([margin.left,width]).nice()
        let xAxis = d3.axisBottom().scale(xScale);

        let bubbleSvg=d3.select(".bubbleChart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        
        bubbleSvg
            .append("g")
            .attr("class","axes")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        
        
        let nodeData=this.filteredData
        let simulation = d3.forceSimulation(nodeData)
            .force('charge', d3.forceManyBody().strength(1))
            .force('x', d3.forceX().x(function(d) {
                return (xScale(parseInt(d["World Sales (in $)"])/10**6));
            }))
            .force('y', d3.forceY(450 / 2))
            .force('collision', d3.forceCollide().radius(function(d) {
                return parseFloat(d.score);
            }));

        let node=d3.select(".bubbleChart")
            .selectAll(".bubble")
            .data(nodeData)
            .join("circle")
            .attr("class","bubble")
            .attr("transform", `translate(${2*margin.left},0)`)
            .attr("r",d=>(d.score) > 0 ? this.size (d.score):0)//???????????????? for now replaced the nan with 0
            .attr("cx",d=>(parseInt(d["World Sales (in $)"])/10**6))
            .attr("cy",500/2)
            .attr("fill",d=> this.colormap (d.genre)).attr("opacity",1)
            .on('tick', ticked);
           
        function ticked(){
            node.attr("cx", function(d){ return d.x;})
                .attr("cy", function(d){ return d.y;})
        }
        //console.log(globalFlags.combined)
        let that=this
        simulation.on("tick",ticked)

        d3.selectAll(".bubble").on("mousemove", (e,d) => {
            //console.log(d)
            if(e != that.e) {
                that.globalFlags.tooltipValues.Movie = d.Title;
                that.globalFlags.tooltipValues.Genre = d.genre;
                that.globalFlags.tooltipValues.IMDbScore = d.score;

            }
            that.e = e;
            that.globalFlags.toolTip.draw(e.x, e.y);
        });
        
    }
    
    addLegend(){
        let genre=['Horror', 'Drama', 'Animation',  'Adventure',
        'Crime', 'Action', 'Comedy', 'Biography']// 'Mystery', 'Fantasy','Romance'
        let size=10
        d3.select(".bubbleChart").selectAll(".beeslegend")
            .data(genre)
            .join("rect")
            .attr("class","beeslegend")
            .attr("x", 20)
            .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", d=>  this.colormap(d))

// Add one dot in the legend for each name.
        d3.select(".bubbleChart").selectAll(".beeslabels")
            .data(genre)
            .join("text")
            .attr("class","beeslabels")
            .attr("x", 20 + size*1.2)
            .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", d =>  this.colormap(d))
            .text(d =>  d)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
        }

        
        


    drawScatter(xFeature="World Sales (in $)", yFeature="score") {
        let margin = {top: 20, right: 40, bottom: 20, left: 50},
        width = 1200 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
        let svg = d3.select(".bubbleChart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
  // Add X axis
        let x = d3.scaleLinear()
            .domain([d3.min(this.combined, d=>parseFloat(d[xFeature])), d3.max(this.combined, d=>parseFloat(d[xFeature]))])
            .range([ 0, width ]).nice();
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class","xScatter")
            .call(d3.axisBottom(x));

  // Add Y axis
        let y = d3.scaleLinear()
            .domain([d3.min(this.combined, d=>parseFloat(d[yFeature])), d3.max(this.combined, d=>parseFloat(d[yFeature]))])
            .range([ height, 0]).nice();
        svg.append("g")
            .attr("class","yScatter")
            .call(d3.axisLeft(y));
        let z = d3.scaleLinear()
            .domain([d3.min(this.combined, d=>parseFloat(d[yFeature])), d3.max(this.combined, d=>parseFloat(d[yFeature]))])
            .range([ 1, 5])
  // Add dots
        svg.append('g')
            .selectAll(".scatterclass")
            .data(this.combined)
            .join("circle")
            .attr("class","scatterclass")
            .attr("cx", function (d) { return x(d[xFeature]); } )
            .attr("cy", function (d) { return y(d[yFeature]); } )
            .attr("r",function (d) { return z(d[yFeature])})
            //.attr("transform", `translate(0, ${- margin.top - margin.bottom})`)
            .style("fill", d => this.colormap(d.genre)).attr("opacity",0.8)

    }
       
            
            

}
