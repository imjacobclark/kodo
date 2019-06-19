const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = event => {
    const decodedEvents = event
        .Records
        .map(record => JSON.parse(new Buffer(record.body, 'base64').toString('ascii')).event);

    const uniqueUserIdsFromBatch = [...new Set(decodedEvents.map(event => event.userId))];
    
    uniqueUserIdsFromBatch.map(userId => {
        const uniqueUsersEvents = decodedEvents
            .filter(event => event.userId === userId)
            .reduce((previous, current) => [...current.events, ...previous], []);

        dynamodb.update({
            TableName: 'OdoStatTable',
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