export default class Odo {
    initialStatEpoch: number;
    lastStatEpoch: number;

    constructor(){
        this.initialStatEpoch = 0;
        this.lastStatEpoch = 0;
    }

    public fire(epoch: number){
        if(this.initialStatEpoch){
            this.lastStatEpoch = epoch;
            return;
        }

        this.initialStatEpoch = epoch;
        this.lastStatEpoch = epoch;
    }

    public getElapsedTime(){
        const noLastStatEpocRecorded = !this.lastStatEpoch;

        if (noLastStatEpocRecorded){
            return 0;
        }

        return this.lastStatEpoch - this.initialStatEpoch;
    }

    public reset(){
        this.initialStatEpoch = 0;
        this.lastStatEpoch = 0;
    }
}