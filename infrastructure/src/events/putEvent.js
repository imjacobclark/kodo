const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const getHeartbeatFromPayload = payload => payload.Records
    .map(record =>
        JSON.parse(
            new Buffer(record.body, 'base64').toString('ascii')
        ).heartbeat
    );

const getUserEventsByUserId = (userId, heartbeat) => heartbeat
    .filter(event => event.userId === userId)
    .reduce((previous, current) => [...current.events, ...previous], []);

const getUserIdsFromHeartbeat = heartbeat => [...new Set(heartbeat.map(event => event.userId))];

exports.handler = payload => {
    const heartbeat = getHeartbeatFromPayload(payload);
    const uniqueUserIds = getUserIdsFromHeartbeat(heartbeat);

    uniqueUserIds.map(userId => {
        const userEvents = getUserEventsByUserId(userId, heartbeat);

        dynamodb.update({
            TableName: 'KodoEventStore',
            Key: { userId: userId },
            UpdateExpression: 'set events = list_append(if_not_exists(events, :empty_list), :value)',
            ExpressionAttributeValues: {
                ':value': userEvents,
                ':empty_list': []
            }
        }, (err, data) => err ? console.error('ERROR: ' + err) : console.info('OK: ' + JSON.stringify(data, null, '  ')));
    });

    return {
        statusCode: 200
    }
};