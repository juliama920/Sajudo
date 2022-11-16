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
                let selected = d3.select(this).attr('class');

                d3.select('.movieTable')
                    .attr('hidden',null)
                    .select('th')
                    .text(selected);
                
                let movieRow = d3.select('.movieTable')
                    .select('#movieBody')
                    .selectAll('tr')
                    .data(distributors.get(selected))
                    .join('tr')
                    .attr('class', (dat) => dat['Title'])
                    .join('td')
                    .text(dat => dat['Title']);

                // movieRow.selectAll('td')
                //     // .data((dat)=> dat)
                //     .join('td')
                //     .text(function(dat){
                //         console.log(dat)
                //         return dat['Title']
                //     })
                //     .attr('class', (dat) => dat);

                // console.log(distributors.get(selected))
                d3.select(this)
                    .attr('bgcolor', 'steelblue');
                // console.log(d3.select(this).attr('class'));
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