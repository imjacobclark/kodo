import StatEvent from '../models/StatEvent';

export default class EventBuffer {
    eventBuffer: Array<StatEvent>;

    constructor(){
        this.eventBuffer = [];
    }
    
    public add(event: StatEvent){
        this.eventBuffer.push(event);
    }

    public get(){
        return this.eventBuffer;
    }

    public length(){
        return this.eventBuffer.length;
    }
}