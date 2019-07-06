const AWS = require('aws-sdk');

class KodoEventStoreDAO {
    constructor(dynamodb) {
        this.dynamodb = dynamodb;
    }

    put(userId, events) {
        this.dynamodb.update({
            TableName: 'KodoEventStore',
            Key: { userId },
            UpdateExpression: 'set events = list_append(if_not_exists(events, :empty_list), :value)',
            ExpressionAttributeValues: {
                ':value': events,
                ':empty_list': []
            }
        }, err => {
            if(err) throw new Error(err);
        });
    }
}

class HeartbeatCollection {
    constructor(heartbeats){
        this.heartbeats = heartbeats;
    }

    normalizedHeartbeats() {
        return this._getUniqueUserIdsFromHeartbeats().map(userId => {
            const userEvents = this._getAllEventsByUserId(userId);
            
            const noEventsExist = !userEvents.length;
            if (noEventsExist) throw new Error("No events found");

            return {
                userId,
                "events": userEvents
            }
        });
    }

    _getUniqueUserIdsFromHeartbeats(){
        return [
            ...new Set(this.heartbeats.map(heartbeat => heartbeat.userId))
        ]
    }

    _getAllEventsByUserId(userId) {
        return this.heartbeats
            .filter(heartbeat => heartbeat.userId === userId)
            .reduce((previous, current) => [...current.events, ...previous], [])
    }
}

class SQSPayload {
    constructor(payload){        
        this.payload = payload;

        if (!this.payload.Records || this.payload.Records.length === 0) throw new Error("No records found");
    }

    getRecordsAsAscii(){
        return this.payload.Records
            .filter(record => record.body)
            .map(record => JSON.parse(
                new Buffer(record.body, 'base64').toString('ascii')
            ));
    }
}

class Event {
    constructor(payload, dynamodb){
        this.records = new SQSPayload(payload).getRecordsAsAscii();
        this.dynamodb = dynamodb ? dynamodb : new AWS.DynamoDB.DocumentClient();;
    }

    handle(){
        const heartbeats = this.records.map(record => record.heartbeat);
        const heartbeatCollection = new HeartbeatCollection(heartbeats);

        try {
            const response = heartbeatCollection
                .normalizedHeartbeats()
                .forEach(event => {
                    new KodoEventStoreDAO(this.dynamodb).put(event.userId, event.events);
                });
            
            return {
                statusCode: 200,
                response: "OK"
            }
        }catch(e){
            console.error("There was an error whilst handling the request:", e);
            
            return {
                statusCode: 500,
                response: e.message
            }
        }
    }
}

exports.HeartbeatCollection = HeartbeatCollection;
exports.SQSPayload = SQSPayload;
exports.Event = Event;

exports.handler = payload => new Event(payload).handle();
