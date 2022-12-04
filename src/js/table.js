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

        // Create Distributor table rows
        let rowSelection = d3.select('#tableBody')
            .selectAll('tr')
            .data(distributors.keys())
            .join('tr')
            .attr('class', (d)=> d.replaceAll(' ', '').replaceAll('.','').replaceAll('-','')
                .replaceAll('(','')
                .replaceAll(')','')); // class name of distributors

        // Fill Distributor table
        let selection = rowSelection.selectAll('td')
            .data((d)=> [d]) 
            .join('td')
            .text((d)=>d)
            .attr('class',(d)=> d)
            .on('click', function(d){
                let selected = d3.select(this).attr('class');

                // reveal movie table
                d3.select('.movieTable')
                    .attr('hidden',null)
                    .select('th')
                    .text(selected);
                
                // reset movie body cell selector
                d3.select('#movieBody')
                    .select('#highlight')
                    .attr('id', '');

                // Fill Movie table
                let movieRow = d3.select('.movieTable')
                    .select('#movieBody')
                    .selectAll('tr')
                    .data(distributors.get(selected))
                    .join('tr')
                    .attr('class', (dat) => dat['Title'].replaceAll(' ','')
                    .replaceAll(':','')
                    .replaceAll('-','')
                    .replaceAll('(','')
                    .replaceAll(')','')
                    .replaceAll('\'',''))
                    .join('td')
                    .text(dat => dat.Title)
                    .on('click', function(event) {
                        // User selects movie
                        d3.select('#movieBody')
                            .select('#highlight')
                            .attr('id', '');

                        d3.select(this)
                            .attr('id','highlight');
                        thisH.data.selectedMovie = this.textContent;
                        let t1=thisH.data.combined.filter(function(a){return a['Title'] === thisH.data.selectedMovie})
                        thisH.data.Genre=t1[0].genre;
                        thisH.redrawOthers(thisH);
                    });
                
                // Reset Distributor table selector
                d3.select('#tableBody')
                    .select('#highlight')
                    .attr('id', '');

                d3.select(this.parentElement)
                    .attr('id','highlight');

                thisH.data.selectedDistributor = this.className;
                thisH.data.selectedMovie = null;
                thisH.redrawOthers(thisH)              
            });
    }

    //draw function for this chart. do not call drawAll from here.
    draw(){
        if (this.data.selectedDistributor) {
            let selected = this.data.selectedDistributor;
            let distributors = d3.group(this.data.grossing, (d)=> d['Distributor']);

            // Reset Distributor table selector
            d3.select('#tableBody')
                .select('#highlight')
                .attr('id', '');

            d3.select('#tableBody')
                .select(`.${selected.replaceAll(' ', '').replaceAll('.','').replaceAll('-','')
                    .replaceAll('(','')
                    .replaceAll(')','')}`)
                .attr('id','highlight');

            // Reveal Movie Table
            d3.select('.movieTable')
                    .attr('hidden',null)
                    .select('th')
                    .text(selected);
            
            // Fill movie table
            let movieRow = d3.select('.movieTable')
                .select('#movieBody')
                .selectAll('tr')
                .data(distributors.get(selected))
                .join('tr')
                .attr('class', (dat) => dat['Title'].replaceAll(' ','')
                .replaceAll(':','')
                .replaceAll('-','')
                .replaceAll('(','')
                .replaceAll(')','')
                .replaceAll('\'',''))
                .join('td')
                .text(dat => dat['Title']);
        } else {
            // Hide Movie table
            d3.select('.movieTable')
                    .attr('hidden','hidden');

            d3.select('#tableBody')
                .select('#highlight')
                .attr('id', '');
        }

        if (this.data.selectedMovie) {
            d3.select('#movieBody')
                            .select('#highlight')
                            .attr('id', '');
            let title = this.data.selectedMovie
                .replaceAll(' ','')
                .replaceAll(':','')
                .replaceAll('-','')
                .replaceAll('(','')
                .replaceAll(')','')
                .replaceAll('\'','');
            d3.select('.movieTable')
                .select('#movieBody')
                .select(`.${title}`)
                .attr('id','highlight');
        }
    }
}