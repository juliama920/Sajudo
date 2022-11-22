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
            .join('tr')
            // .attr('class', (d) => d);
            .attr('class', (d)=> d.replaceAll(' ', '').substring(0,5));


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

                d3.select('#tableBody')
                    .select('#highlight')
                    .attr('id', '');

                d3.select(this.parentElement)
                    .attr('id','highlight');

                thisH.data.selectedDistributor = this.className;
                thisH.data.lineChart.draw();
            });
    }

    //draw function for this chart. do not call drawAll from here.
    draw(){
        // console.log(this.data.selectedDistributor)
        if (this.data.selectedDistributor) {
            let selected = this.data.selectedDistributor;
            let distributors = d3.group(this.data.grossing, (d)=> d['Distributor']);
        // console.log((selected).replaceAll(' ', '').substring(0,5));

            d3.select('#tableBody')
                .select('#highlight')
                .attr('id', '');
                // .attr('highlight', null);

            d3.select('#tableBody')
                .select(`.${selected.replaceAll(' ', '').substring(0,5)}`)
                .attr('id','highlight');


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
        } else {
            d3.select('.movieTable')
                    .attr('hidden','hidden');

            d3.select('#tableBody')
                .select('#highlight')
                .attr('id', '');
        }
    }
}