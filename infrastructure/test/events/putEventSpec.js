const should = require('should');
const Event = require('../../src/handlers/events/putEvent').Event;
const SQSPayload = require('../../src/handlers/events/putEvent').SQSPayload;
const HeartbeatCollection = require('../../src/handlers/events/putEvent').HeartbeatCollection;

class MockDynamo {
    constructor(shouldThrowExceptionOnOperation){
        this.lastUpdateOperation = {};
        this.calls = 0;
        this.shouldThrowExceptionOnOperation = shouldThrowExceptionOnOperation;
    }

    update(payload, cb){
        this.lastUpdateOperation = payload;
        this.calls++;

        this.shouldThrowExceptionOnOperation ? cb("Mock DynamoDB error!") : cb(null);
    }

    reset(){
        this.calls = 0;
        this.lastUpdateOperation = {};
    }
}

const MOCK_HEARTBEAT = { heartbeat: 
    {
        userId: "imjacobclark",
        events: [
            {
                "identifier": "hello_world"
            }
        ]
}
};

MOCK_SQS_HEARTBEAT_AS_BASE64 = new Buffer(JSON.stringify(MOCK_HEARTBEAT)).toString('base64')

const MOCK_SQS_EVENT = {
    Records: [
        {
            body: MOCK_SQS_HEARTBEAT_AS_BASE64
        }
    ]
}

describe('SQS Payload', () => {
    describe('constructor', () => {
        it('constructs with expected payload', () => {
            const actualPayload = new SQSPayload(MOCK_SQS_EVENT).payload;
            const expectedPayload = MOCK_SQS_EVENT;

            should.deepEqual(actualPayload, expectedPayload);
        });

        it('when Records property is missing, a "No records found" exception is thrown', () => {
            should(() => new SQSPayload({})).throw('No records found')
        });

        it('when Records property is an empty array, a "No records found" exception is thrown', () => {
            should(() => new SQSPayload({
                Records: []
            })).throw('No records found')
        });
    });

    describe('getRecordsAsAscii', () => {
        it('when a record has no body, it is not parsed into ASCII', () => {
            const actualDecodedRecords = new SQSPayload({
                Records: [
                    {
                        noop: "noop"
                    }
                ]
            }).getRecordsAsAscii();

            const expectedDecodedRecords = [];

            should.deepEqual(actualDecodedRecords, expectedDecodedRecords);
        });

        it('when body is not valid JSON, an exception is thrown', () => {
            should(() => new SQSPayload({
                Records: [
                    {
                        body: "not JSON"
                    }
                ]
            }).getRecordsAsAscii()).throw()
        });

        it('decodes payload into an array of objects', () => {
            const actualDecodedRecords = new SQSPayload(MOCK_SQS_EVENT).getRecordsAsAscii();
            const expectedDecodedRecords = [
                MOCK_HEARTBEAT
            ];

            should.deepEqual(actualDecodedRecords, expectedDecodedRecords);
        });
    });
});

describe('HeartbeatCollection', () => {
    describe('normalizedHeartbeats', () => {
        it('when constructed with a single userId and an empty events property, an "No events found" exception is thrown', () => {
            should(() => new HeartbeatCollection([{ userId: "imjacobclark", events: [] }]).normalizedHeartbeats()).throw('No events found')
        });

        it('when constructed with one heartbeat from a single user, an array is returned containing an object for the user with their event', () => {
            const actualHeartbeats = new HeartbeatCollection([
                {
                    userId: "imjacobclark",
                    events: [
                        {
                            "name": "event 1"
                        }
                    ]
                }
            ]).normalizedHeartbeats();

            const expectedHeartbeats = [{
                events: [
                    {
                        name: "event 1",
                    }
                ],
                userId: "imjacobclark"
            }];

            should.deepEqual(actualHeartbeats, expectedHeartbeats);
        });

        it('when constructed with two heartbeats from a single user, an array is returned containing an object for the user with their respective events', () => {
            const actualHeartbeats = new HeartbeatCollection([
                {
                    userId: "imjacobclark",
                    events: [
                        {
                            "name": "event 1"
                        }
                    ]
                },
                {
                    userId: "imjacobclark",
                    events: [
                        {
                            "name": "event 2"
                        }
                    ]
                }
            ]).normalizedHeartbeats();

            const expectedHeartbeats = [{
                events: [
                    {
                        name: "event 2",
                    },
                    {
                        name: "event 1",
                    }
                ],
                userId: "imjacobclark"
            }];

            should.deepEqual(actualHeartbeats, expectedHeartbeats);
        });

        it('when constructed with three heartbeats, two from a single user and one from a unique user, an array is returned containing an object for each user with their respective events', () => {
            const actualHeartbeats = new HeartbeatCollection([
                {
                    userId: "imjacobclark",
                    events: [
                        {
                            "name": "event 1"
                        }
                    ]
                },
                {
                    userId: "imjacobclark",
                    events: [
                        {
                            "name": "event 2"
                        }
                    ]
                },
                {
                    userId: "imnotjacobclark",
                    events: [
                        {
                            "name": "event 3"
                        }
                    ]
                }
            ]).normalizedHeartbeats();

            const expectedHeartbeats = [{
                events: [
                    {
                        name: "event 2",
                    },
                    {
                        name: "event 1",
                    }
                ],
                userId: "imjacobclark"
            },
                {
                    events: [
                        {
                            name: "event 3",
                        }
                    ],
                    userId: "imnotjacobclark"
                }];

            should.deepEqual(actualHeartbeats, expectedHeartbeats);
        });
    });
});

describe('Event', () => {
    describe('constructor', () => {
        it('should construct with expected records', () => {
            const actualRecords = new Event(MOCK_SQS_EVENT, new MockDynamo()).records;
            const expectedRecords = [
                MOCK_HEARTBEAT
            ];

            should.deepEqual(actualRecords, expectedRecords);
        });
    });

    describe('handle', () => {
        it('calls DynamoDB with expected update schema', () => {
            const mockDynamo = new MockDynamo();
            const expectedUpdateOperation = {
                "TableName": "KodoEventStore",
                "Key": {
                    "userId": "imjacobclark"
                },
                "UpdateExpression": "set events = list_append(if_not_exists(events, :empty_list), :value)",
                "ExpressionAttributeValues": {
                    ":value": [
                        {
                            "identifier": "hello_world"
                        }
                    ], ":empty_list": []
                }
            }


            const event = new Event(MOCK_SQS_EVENT, mockDynamo);

            event.handle();

            should.deepEqual(mockDynamo.lastUpdateOperation, expectedUpdateOperation);
            should.equal(mockDynamo.calls, 1);
        });

        it('returns 200 on successful update', () => {
            const mockDynamo = new MockDynamo();
            
            const event = new Event(MOCK_SQS_EVENT, mockDynamo);

            const result = event.handle();

            should.deepEqual(result, {
                statusCode: 200,
                response: "OK"
            });
        });

        it('returns 500 on unsuccessful update', () => {
            const mockDynamo = new MockDynamo(true);

            const event = new Event(MOCK_SQS_EVENT, mockDynamo);

            const result = event.handle();

            should.deepEqual(result, {
                statusCode: 500,
                response: "Mock DynamoDB error!"
            });
        });
    });
});