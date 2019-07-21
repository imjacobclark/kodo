const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const stat = event => {
    return {
        identifier: event.identifier.S,
        language: event.language.S,
        elapsed: event.elapsed.N,
        application: event.application.S,
        type: event.type.S
    }
}

exports.handler = payload => {
    const stats = {};
    let userId = "";

    payload.Records.forEach(record => {
        const changedDynamoDBRecord = record.dynamodb.NewImage;
            
        if (!changedDynamoDBRecord) return;

        userId = changedDynamoDBRecord.userId.S

        return changedDynamoDBRecord.events.L.forEach(event => {
            event = event.M;
            const activityName = event.workspace.S
            const activityDate = new Date(new Number(event.epoch.N)).toISOString().split("T")[0];

            const noStatsForDateHaveBeenRecorded = !stats[activityDate];
            if (noStatsForDateHaveBeenRecorded) {
                stats[activityDate] = {}
            }

            const activities = stats[activityDate][activityName];

            const noStatsForActivityHaveBeenRecorded = !activities;
            if (noStatsForActivityHaveBeenRecorded){
                stats[activityDate][activityName] = [stat(event)];
            } else {
                const activity = activities.find(activity => event.identifier.S === activity.identifier);

                if (activity) {
                    activity.elapsed = new Number(activity.elapsed) + new Number(event.elapsed.N);
                } else {
                    activities.push(stat(event));
                }
            }
        });
    });

    Object.keys(stats).forEach(date => dynamodb.put({
            Item: {
                "userId": userId,
                "stats": stats[date],
                "date": date
            },
            TableName: "KodoDailyCalculationTable"
        }, (err, data) => err ? console.error('ERROR: ' + err) : console.info('OK: ' + JSON.stringify(data, null, '  '))))

    return {
        statusCode: 200
    }
};

