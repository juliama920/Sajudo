class Tooltip{

    constructor(globalFlags){
        this.globalFlags = globalFlags;
    }

    draw(xCoord = 0, yCoord = 0){
        this.lastX = xCoord;
        this.lastY = yCoord;

        d3.select("#toolTip").select("svg").remove();
        d3.select("#toolTip").append("svg").attr("width", "300").attr("height", "170")
        // .attr("x",xCoord).attr("y", yCoord)
        .attr("transform",`translate(${xCoord - 1000 }, ${yCoord - 930})`)
        .append("path")
        .attr("d", "M 0, 82.5 C 0, 0 0, 0 82.5, 0 S 300, 0 300, 82.5 165, 165 82.5, 165 0, 165 0, 82.5")
        .attr("x", "10").attr("y", "10").attr("opacity", ".5").attr("width", "100").attr("height", "100").attr("fill", "lightblue");
        this.fillTooltip();
    }
    
    fillTooltip(){
        let tooltipSVG = d3.select("#toolTip").select("svg");
        let i = 0;
        for(let key of Array.from(Object.keys(this.globalFlags.tooltipValues))){
            //console.log(key);
            tooltipSVG.append("text").text(key + " : " + this.globalFlags.tooltipValues[key])
            .attr("transform",`translate(20, ${25*i + 25})`);
            i++;
        }
    }

    clearData() {
        for (const key in this.globalFlags.tooltipValues) {
            delete this.globalFlags.tooltipValues[key];
          }
    }  

    destroy(){
        let tooltipSVG = d3.select("#toolTip").select("svg");
        tooltipSVG.remove();
    }
}