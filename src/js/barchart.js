class BarChart{

    constructor(globalFlags, redrawOthers, data = globalFlags.data){
        this.globalFlags = globalFlags;
        this.redrawOthers = redrawOthers;
        this.data = data;
    }
    
    //draw function for this chart. do not call drawAll from here.
    draw(){
        // console.log("drawing barChart");
        // this.redrawOthers(this);
    }
}