const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = event => {
    const stats = {
        "projects": {},
    };
    
    let userId = "";

    event
        .Records
        .forEach(record => {
            const newImage = record
                .dynamodb
                .NewImage;
                
            if (!newImage) return;

            userId = newImage.userId.S

            // Need to add languages summary within projects {}
            return newImage.events.L.forEach(event => {
                let project = stats["projects"][event.M.project.S];

                if (project){
                    const file = project
                        .files
                        .find(file => {
                            return event.M.file.S === file.fileName
                        });

                    if (file) {
                        file.elapsed = new Number(file.elapsed) + new Number(event.M.elapsed.N);
                    } else {
                        project.files.push({
                            fileName: event.M.file.S,
                            language: event.M.language.S,
                            elapsed: event.M.elapsed.N
                        });
                    }
                }else{
                    stats["projects"][event.M.project.S] = {
                        files: [
                            {
                                fileName: event.M.file.S,
                                language: event.M.language.S,
                                elapsed: event.M.elapsed.N
                            }
                        ]
                    }
                };
            });
        });

    // We should convert the date to an epoch, have it as the sort key and put a new record per date
    dynamodb.put({
        Item: {
            "userId": userId,
            "stats": stats
        },
        TableName: "OdoCalculationTable"
    }, (err, data) => err ? console.error('ERROR: ' + err) : console.info('OK: ' + JSON.stringify(data, null, '  ')));

    return {
        statusCode: 200
    }
};

