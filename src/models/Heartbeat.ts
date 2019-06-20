import StatEvent from './StatEvent';

export default class Heartbeat {
    userId: string;
    events: Array<StatEvent>;

    constructor(userId: string, events: Array<StatEvent>) {
        this.userId = userId;
        this.events = events;
    }

    public toBase64(){
        return new Buffer(JSON.stringify({ 
            heartbeat: this 
        })).toString('base64');
    }
}