exports.handler = async event => {
    event.Records.forEach(record => {
        console.log(new Buffer(record.body, 'base64').toString('ascii'));
    });

    return {
        statusCode: 200,
    };
};