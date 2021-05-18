const AWS = require('aws-sdk');
const DocumentClient = AWS.DynamoDB.DocumentClient;
const documentClient = new DocumentClient();

exports.main = async function (event: any, context: any) {
    try {
        console.log(event.httpMethod);
        console.log(event.path);
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type, Accept",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
                },
                body: JSON.stringify({ success: true })
            };
        }

        if (event.path === "/diary/add-entry") {
            return await addDiaryEntry(event);
        } else if (event.path === "/diary/get-entries") {
            return await getDiaryEntries(event);
        } else if (event.path === "/diary/record-one-time-diary-entry") {
            return await recordSingleEntry(event);
        } else if (event.path === "/diary/delete-entry") {
            return await deleteEntry(event);
        }

        return {
            statusCode: 400,
            headers: {},
            body: "Unrecognized request type"
        };
    } catch (error) {
        var body = error.stack || JSON.stringify(error, null, 2);
        return {
            statusCode: 400,
            headers: {},
            body: JSON.stringify(body)
        }
    }
}

async function addDiaryEntry(event: any) {
    const eventBody = JSON.parse(event.body);
    const { user, mealName, timestamp = new Date().toISOString() } = eventBody;
    const meal = await new Promise((resolve, reject) => {
        documentClient.get({
            TableName: process.env.MEALS_TABLE_NAME,
            Key: {
                user,
                mealName
            }
        }, function (err: any, output: any) {
            if (err) return reject(err);
            return resolve(output.Item);
        });
    });
    await new Promise((resolve, reject) => {
        documentClient.put({
            TableName: process.env.DIARY_TABLE_NAME,
            Item: {
                user,
                timestamp,
                meal,
            }
        }, function (err: any) {
            if (err) return reject(err);
            return resolve();
        });
    });
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Accept",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
        },
        body: JSON.stringify({ success: true })
    };
}

async function deleteEntry(event: any) {
    const eventBody = JSON.parse(event.body);
    const { user, timestamp } = eventBody;
    await new Promise((resolve, reject) => {
        documentClient.delete({
            TableName: process.env.DIARY_TABLE_NAME,
            Key: {
                user,
                timestamp
            }
        }, function (err: any) {
            if (err) return reject(err);
            return resolve();
        });
    });
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Accept",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
        },
        body: JSON.stringify({ success: true })
    };
}

async function recordSingleEntry(event: any) {
    const eventBody = JSON.parse(event.body);
    const { user, meal, timestamp = new Date().toISOString() } = eventBody;
    await new Promise((resolve, reject) => {
        documentClient.put({
            TableName: process.env.DIARY_TABLE_NAME,
            Item: {
                user,
                timestamp,
                meal,
            }
        }, function (err: any) {
            if (err) return reject(err);
            return resolve();
        });
    });
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Accept",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
        },
        body: JSON.stringify({ success: true })
    };
}

async function getDiaryEntries(event: any) {
    const {
        user,
        startTimestamp = null,
        endTimestamp = null
    } = JSON.parse(event.body);
    const { Items } = await queryDiaryEntriesIteration( user, startTimestamp, endTimestamp );
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Accept",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
        },
        body: JSON.stringify(Items)
    };
}

async function queryDiaryEntriesIteration ( user : string, startTimestamp : string|null, endTimestamp : string|null, ExclusiveStartKey = undefined ) : Promise<{ Items : [any], LastEvaluatedKey?: String }> {
    const ExpressionAttributeValues : any = {
        ':user': user
    }
    const ExpressionAttributeNames : any = {
        '#user': 'user'
    };
    let KeyConditionExpression = "#user = :user";
    if (startTimestamp !== null
        && endTimestamp !== null) {
        KeyConditionExpression += " and #timestamp between :startTimestamp and :endTimestamp";
        ExpressionAttributeValues[':startTimestamp'] = startTimestamp;
        ExpressionAttributeValues[':endTimestamp'] = endTimestamp;
        ExpressionAttributeNames['#timestamp'] = 'timestamp';
    }

    let { Items, LastEvaluatedKey } = await new Promise((resolve, reject) => {
        documentClient.query({
            TableName: process.env.DIARY_TABLE_NAME,
            KeyConditionExpression,
            ExpressionAttributeValues,
            ExpressionAttributeNames,
            ExclusiveStartKey
        }, function (err: any, output: any) {
            console.log(err);
            if (err) return reject(err);
            return resolve({ Items: output.Items, LastEvaluatedKey: output.LastEvaluatedKey });
        });
    });
    while( LastEvaluatedKey ) {
        const { Items : MoreItems, LastEvaluatedKey: NextLastEvaluatedKey } = await queryDiaryEntriesIteration( user, startTimestamp, endTimestamp, LastEvaluatedKey );
        LastEvaluatedKey = NextLastEvaluatedKey;
        Items = Items.concat(MoreItems); 
    }
    return { Items };
}

export {};