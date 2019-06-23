const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = event => {
    const decodedHeartbeat = event
        .Records
        .map(record => JSON.parse(new Buffer(record.body, 'base64').toString('ascii')).heartbeat);

    const uniqueUserIds = [...new Set(decodedHeartbeat.map(event => event.userId))];

    uniqueUserIds.map(userId => {
        const uniqueUsersEvents = decodedHeartbeat
            .filter(event => event.userId === userId)
            .reduce((previous, current) => [...current.events, ...previous], []);

        dynamodb.update({
            TableName: 'KodoStatTable',
            Key: { userId: userId },
            UpdateExpression: 'set events = list_append(if_not_exists(events, :empty_list), :value)',
            ExpressionAttributeValues: {
                ':value': uniqueUsersEvents,
                ':empty_list': []
            }
        }, (err, data) => err ? console.error('ERROR: ' + err) : console.info('OK: ' + JSON.stringify(data, null, '  ')));
    });

    return {
        statusCode: 200
    }
};