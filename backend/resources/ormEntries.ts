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

        if (event.path === "/orm/record-entry") {
            return await recordOrmEntry(event);
        } else if (event.path === "/orm/get-entries") {
            return await getOrmEntries(event);
        } else if (event.path === "/orm/delete-entry") {
            return await deleteOrmEntry(event);
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

async function deleteOrmEntry(event: any) {
    const eventBody = JSON.parse(event.body);
    const {
        user,
        timestamp,
        liftName
    } = eventBody;
    const itemKey = `${liftName}/${timestamp}`;
    await new Promise((resolve, reject) => {
        documentClient.delete({
            TableName: process.env.ORM_TABLE_NAME,
            Key: {
                user,
                itemKey
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

async function recordOrmEntry(event: any) {
    const eventBody = JSON.parse(event.body);
    const { user, liftName, weight, repetitions } = eventBody;
    const timestamp = new Date().toISOString();
    await new Promise((resolve, reject) => {
        documentClient.put({
            TableName: process.env.ORM_TABLE_NAME,
            Item: {
                user,
                timestamp,
                liftName,
                itemKey: `${liftName}/${timestamp}`,
                weight,
                repetitions
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

async function getOrmEntries(event: any) {
    const { user } = JSON.parse(event.body);
    const { Items } = await queryOrmIteration(user);
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

async function queryOrmIteration ( user : any, ExclusiveStartKey = undefined ) : Promise<{ Items : [any], LastEvaluatedKey?: String }> {
    let { Items, LastEvaluatedKey } = await new Promise((resolve, reject) => {
        documentClient.query({
            TableName: process.env.ORM_TABLE_NAME,
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
        const { Items : MoreItems, LastEvaluatedKey: NextLastEvaluatedKey } = await queryOrmIteration( user, LastEvaluatedKey );
        LastEvaluatedKey = NextLastEvaluatedKey;
        Items = Items.concat(MoreItems); 
    }
    return { Items };
}

export {};