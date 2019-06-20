export default class Odo {
    initialStatEvent: number;
    lastStatEvent: number;

    constructor(){
        this.initialStatEvent = 0;
        this.lastStatEvent = 0;
    }

    public fire(time: number){
        if(this.initialStatEvent){
            this.lastStatEvent = time;
            return;
        }

        this.initialStatEvent = time;
        this.lastStatEvent = time;
    }

    public getElapsedTime(){
        return this.lastStatEvent - this.initialStatEvent;
    }

    public reset(){
        this.initialStatEvent = 0;
        this.lastStatEvent = 0;
    }
}