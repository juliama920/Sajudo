/** Class implementing the table. */
class Info{

    constructor(globalFlags, redrawOthers){//globalFlags, redrawOthers, data = globalFlags.data){
        this.redrawOthers = redrawOthers;
        this.gross=globalFlags.grossing
        this.combined=globalFlags.combined;
        //console.log(this.combined)
        this.headerData = [
            {
                sorted: false,
                ascending: false,
                key: 'title3'
            },
            {
                sorted: false,
                ascending: false,
                key: 'writer'
            },
            
            { // for frequency
                sorted: false,
                ascending: false,
                key: 'score',
                alterFunc: d => parseFloat(+d)
            },
            
            
            {
                sorted: false,
                ascending: false,
                key: 'RunTime2',
                alterFunc: d => parseInt(+d)
            },
            {
                sorted: false,
                ascending: false,
                key: 'budget',
                alterFunc: d=> parseInt(+d)
            },
            {
                sorted: false,
                ascending: false,
                key: 'World Sales (in $)',
                alterFunc: d => parseInt(+d)
            },
            {
                sorted: false,
                ascending: false,
                key: 'director'
            },
        ]
        
        this.margin={"top":0, "left":10,"right":15,"buttom":0}
        this.bigVizWidth=350;
        this.vizWidth = 207;
        this.vizHeight = 50;
        this.smallVizHeight = 20;
        this.smallVizWidth=160;

        this.scaleX2 = d3.scaleLinear()
            .domain([0, 10])
            .range([0+this.margin.left, this.vizWidth-this.margin.right-6]);
        /*this.scaleX3 = d3.scaleLinear()
            .domain([1, 7])
            .range([0+this.margin.left, this.vizWidth-this.margin.right-6]);*/
        
        /*let categories=new Set();
        this.words.forEach(element => {
            categories.add(element.category)
        });*/
        let categories=['Action', 'Drama', 'Animation',  'Adventure',
        'Crime', 'Horror', 'Comedy', 'Biography','Mystery', 'Fantasy','Romance','Family']
        
        /*this.filteredData=this.combined.filter(d=>d["Distributor"]===globalFlags.selectedDistributor)
        if (isNaN(globalFlags.selectedDistributor)){
            console.log("true")
            this.filteredData=this.combined
        }*/
        
        this.colormap=d3.scaleSequential(d3.interpolateRdBu).domain([d3.min(this.combined.map(d=>parseFloat(d["score"])))/10,d3.max(this.combined.map(d=>parseFloat(d["score"])))/10])//.range(['red','white','blue']);
        this.attachSortHandlers();
        this.drawLegend();
        

    }

    drawLegend() {
        
        let svgArray=["#margin2Axis","#margin3Axis","#margin4Axis","#margin5Axis","#margin6Axis","#margin7Axis"];
        let counter=0;
        
        d3.select("#margin1Axis")
        .attr("width",this.bigVizWidth)
        .attr("height", this.vizHeight)
        .style("background", 'lightblue')
        .attr("opacity", 0.8)
        .append('text')
        .attr('x',this.bigVizWidth/2-30)
        .attr('y',15)
        .text("Title")
        let textArray=["Writer","IMDbScore","Runtime(min)","Budget(M$)","WorldSales(M$)","Director"]
        svgArray.forEach(element => { 
            d3.select(element)
            .attr("width",this.vizWidth)
            .attr("height", this.vizHeight)
            .style("background", 'lightblue')
            .attr("opacity", 0.8)
            .append('text')
            .attr('x',this.vizWidth/2-40)
            .attr('y',15)
            .text(textArray[counter])
            counter+=1
            
        });
        let axis2=d3.axisTop().scale(this.scaleX2);
        //let axis3=d3.axisTop().scale(this.scaleX3);
        d3.select("#margin3Axis").append('g').selectAll('text')
            .data([0,2,4,6,8,10])
            .join('text')
            .attr("transform",  d=>  `translate(${this.scaleX2(d)},40)`)
        d3.select("#margin3Axis").select('g').attr("transform","translate(5,52)").call(axis2.ticks(6))
        /*d3.select("#margin4Axis").append('g').selectAll('text')
            .data([-100, -50, 0, 50, 100])
            .join("text")
            .attr("transform",  d=>  `translate(${this.scaleX3(d)},40)`)
        d3.select("#margin4Axis").select('g').attr("transform","translate(5,52)").call(axis3.ticks(5))*/

    }

    drawTable() {
        //console.log(globalFlags.selectedDistributor)
        this.filteredData=this.combined//.filter(d=>d["Distributor"]===globalFlags.selectedDistributor)
        //console.log(this.filteredData)
        
        /*if (globalFlags.selectedDistributor===null){
            this.filteredData=this.combined
        }*/
        let rowSelection = //d3.select(".grid-child purple").append('table').attr("id",'#predictionTableBody')
        d3.select('#predictionTableBody')    
        .selectAll('tr')
            .data(this.filteredData)
            .join('tr');
       
        let forecastSelection = rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td')
            
           // .style(d=> "text-align",'center')
            .attr('class', d => d.class)
            forecastSelection.filter(d => d.type ==="text").text(d => d.value).attr("transform",`translate(${50},0)`).attr("class","text")//.attr("text-ancher","start")
            forecastSelection.filter(d => d.type ==="number").text(d => d.value)
       
        
        let vizSelection = forecastSelection.filter(d => d.type === 'viz');
        let svgSelect = vizSelection.selectAll('svg')
            .data(d => [d])
            .join('svg')
            .attr('width', this.vizWidth)
            .attr('height',  this.smallVizHeight);
        


    
      this.addRectanglesFrequency(svgSelect.filter(d =>d.name==="score"));
       //this.addRectanglesPercentage(svgSelect.filter(d =>d.name==="runTime"));
    }

    rowToCellDataTransform(d) {
        const format=d3.format(".2f");
        let title = {
            type: 'text',
            name:'Title',
            value: d.title3
        };
        let writer = {
            type: 'text',
            name:'writer',
            value: d.writer
        };

        let score = {
            type: 'viz',
            name: 'score',
            value: d["score"],
            category: d["genre"]
                
        };
  
        let runtime = {
            type: 'number',
            name: 'runTime',
            value: parseInt(d["RunTime2"]),
            
        };
        let budget = {
            type: 'number',
            name:'budget',
            value: parseFloat(d.budget/10**6)
        };

        let sale = {
            type: 'number',
            name: 'sale',
            value: parseInt(d["World Sales (in $)"]/10**6)
                
            
        };
        let director = {
            type: 'text',
            name:'director',
            value: d.director
        };

        let dataList = [title, writer, score, runtime,budget,sale,director];
    
        return dataList;
    }
//part7
  /*  updateHeaders() {
      
}*/
    /*addGridlinesPercentage(containerSelect, ticks) {
        containerSelect.selectAll('line')
        .data(ticks)
        .join('line')
        .attr('x1',d =>this.scaleX3(d))
        .attr('x2',d => this.scaleX3(d))
        .attr('y1',this.scaleX3(0))
        .attr('y2',this.VizHeight)
        .attr('stroke','white')
        .attr("stroke-width","2")
    }*/
   
    addRectangles(containerSelect) {
        //console.log(containerSelect.data())
        
            containerSelect.selectAll('rect')
            
             .data(d=> { return[d.value]})   
             .join("rect")
             .attr("x", (d) => { 
                return this.scaleX2(0)})
    
             .attr("y", 0)
             .attr("height", 15)
             .attr("width",(d)=>d*100)
              
         }

   addRectanglesFrequency(containerSelect) {

      containerSelect.selectAll('rect')
         .data(d=> [d])   
         .join("rect")
         .attr("x", (d) =>  this.scaleX2(0))

         .attr("y", 0)
         .attr("height", 15)
         .attr("width",(d)=>this.scaleX2(d.value))
         .attr("transform",  `translate(0,2.5)`)
         .attr("opacity", 0.9)
         .attr("fill",d=>{return(this.colormap(parseFloat(d.value)/10));})
        
     }

   
    attachSortHandlers() 
    {
        d3.select('#columnHeaders')
            .selectAll('th')
            .data(this.headerData)
            .on('click', (event, d) => 
            {
                //this.collapseAll(); // Comment this line out for extra credit 2
                const sortAscending = d.sorted ? !d.ascending : true; // sort ascending by default, otherwise flip it.
                this.sortData(d.key, sortAscending, d.alterFunc);
                // reset state
                for (let header of this.headerData)
                {
                    header.sorted = false;
                }
                // set new state for this node
                d.sorted = true;
                d.ascending = sortAscending;
                this.drawTable();
            });
    }
    sortData(key, ascend, alterFunc)
    {
        // let tempLookup = d3.group(this.tableData.filter(d => d.isForecast), d => d.state); // for extra credit only
        this.combined.sort((a, b) =>
            {
                let sortKey = key;
                let x = a[sortKey];
                let y = b[sortKey];

                if (!ascend)
                {
                    [x, y] = [y, x] // swap variables
                }
                if (alterFunc)
                {
                    x = alterFunc(x);
                    y = alterFunc(y);
                }
                if (x < y)
                {
                    return -1
                }
                else if (x > y)
                {
                    return 1
                }
                return 0;
            }
        );
    }


  

        
   

}
