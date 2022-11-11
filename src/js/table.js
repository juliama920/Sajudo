class Table{

    constructor(globalFlags, redrawOthers) {
        this.data = globalFlags;
        this.redrawOthers = redrawOthers;
        let table = d3.select('#table');
        

        this.drawTable();
    }

    drawTable() {
        let thisH = this;
        
        let distributors = d3.group(this.data.grossing, (d)=> d['Distributor']);
        // console.log(distributors.keys())

        let rowSelection = d3.select('#tableBody')
            .selectAll('tr')
            .data(distributors.keys())
            .join('tr');


        let selection = rowSelection.selectAll('td')
            .data((d)=> [d]) 
            .join('td')
            .text((d)=>d)
            .attr('class',(d)=> d)
            .on('click', function(d){
                d3.select(this)
                    .attr('background', 'steelblue');
                // console.log(this);
                // this.toggleClass('active')
            });
    }

    // constructor(globalFlags, redrawOthers, data = globalFlags.grossing){
    //     this.globalFlags = globalFlags;
    //     this.redrawOthers = redrawOthers;
    //     this.data = data;
    // }

    //draw function for this chart. do not call drawAll from here.
    draw(){
        // console.log("drawing table");

        // console.log(this.globalFlags);
        // if(this.globalFlags.test){
        //     console.log("test is true!");
        // }
        // this.redrawOthers(this);
    }
}