class Table{

    constructor(globalFlags, redrawOthers, data = globalFlags.grossing){
        this.globalFlags = globalFlags;
        this.redrawOthers = redrawOthers;
        this.data = data;
    }

    //draw function for this chart. do not call drawAll from here.
    draw(){
        console.log("drawing table");

        console.log(this.globalFlags);
        if(this.globalFlags.test){
            console.log("test is true!");
        }
        // this.redrawOthers(this);
    }
}