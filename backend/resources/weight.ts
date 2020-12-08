const AWS = require('aws-sdk');
const DocumentClient = AWS.DynamoDB.DocumentClient;
const documentClient = new DocumentClient();

exports.main = async function (event: any, context: any) {
    try {
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

        if (event.path === "/weight/record") {
            return await recordWeight(event);
        } else if (event.path === "/weight/get") {
            return await getWeights(event);
        } else if (event.path === "/weight/delete") {
            return await deleteWeight(event);
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

async function deleteWeight(event: any) {
    const eventBody = JSON.parse(event.body);
    const { user, timestamp } = eventBody;
    await new Promise((resolve, reject) => {
        documentClient.delete({
            TableName: process.env.WEIGHTS_TABLE_NAME,
            Key: {
                user,
                timestamp
            }
        }, function (err: any) {
            console.log(err);
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

async function recordWeight(event: any) {
    const eventBody = JSON.parse(event.body);
    const { user, weight } = eventBody;
    await new Promise((resolve, reject) => {
        documentClient.put({
            TableName: process.env.WEIGHTS_TABLE_NAME,
            Item: {
                user,
                timestamp: new Date().toISOString(),
                weight,
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

async function getWeights(event: any) {
    const { user } = JSON.parse(event.body);
    const { Items } = await queryWeightsIteration(user);
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

async function queryWeightsIteration ( user : any, ExclusiveStartKey = undefined ) : Promise<{ Items : [any], LastEvaluatedKey?: String }> {
    let { Items, LastEvaluatedKey } = await new Promise((resolve, reject) => {
        documentClient.query({
            TableName: process.env.WEIGHTS_TABLE_NAME,
            KeyConditionExpression: "#user = :user",
            ExpressionAttributeValues: {
                ':user': user
            },
            ExpressionAttributeNames: {
                '#user': 'user'
            },
            ExclusiveStartKey
        }, function (err: any, output: any) {
            console.log(err);
            if (err) return reject(err);
            return resolve({ Items: output.Items, LastEvaluatedKey: output.LastEvaluatedKey });
        });
    });
    while( LastEvaluatedKey ) {
        const { Items : MoreItems, LastEvaluatedKey: NextLastEvaluatedKey } = await queryWeightsIteration( user, LastEvaluatedKey );
        LastEvaluatedKey = NextLastEvaluatedKey;
        Items = Items.concat(MoreItems); 
    }
    return { Items };
}

export {};