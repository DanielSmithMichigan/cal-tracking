const AWS = require('aws-sdk');
const DocumentClient = AWS.DynamoDB.DocumentClient;
const documentClient = new DocumentClient();

const allGoalKeys = [
    "firstMealTime",
    "lastMealTime",
    "caloriesPerDay",
    "proteinPerDay"
];

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
        if (event.path === "/get-goals") {
            return await getGoals(event);
        } else if (event.path === "/set-goal") {
            return await setGoal(event);
        } else if (event.path === "/check-goals-exist") {
            return await checkGoalsExist(event);
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

async function getGoals(event: any) {
    const eventBody = JSON.parse(event.body);
    const { user } = eventBody;
    const items = await Promise.all(
        allGoalKeys.map(
            goalKey => new Promise((resolve, reject) => {
                documentClient.query({
                    TableName: process.env.GOALS_TABLE_NAME,
                    ScanIndexForward: false,
                    Limit: 1,
                    KeyConditionExpression: "goalId = :goalId",
                    ExpressionAttributeValues: {
                        ':goalId': `${user}/${goalKey}`
                    }
                }, function (err: any, data: any) {
                    if (err) return reject(err);
                    return resolve(data.Items[0]);
                });
            })
        )
    );
    const filteredItems = items.filter(Boolean);
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Accept",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
        },
        body: JSON.stringify(filteredItems)
    };
}

async function setGoal(event: any) {
    const eventBody = JSON.parse(event.body);
    const { user } = eventBody;
    await Promise.all(
        allGoalKeys.map(key => new Promise((resolve, reject) => {
            documentClient.put({
                TableName: process.env.GOALS_TABLE_NAME,
                Item: {
                    goalId: `${user}/${key}`,
                    timestamp: new Date().toISOString(),
                    value: eventBody[key]
                }
            }, function (err: any) {
                if (err) return reject(err);
                return resolve();
            });
        }))
    );
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

async function checkGoalsExist(event: any) {
    const eventBody = JSON.parse(event.body);
    const { user } = eventBody;
    let missing : Array<String> = [];
    const out = await Promise.all(
        allGoalKeys.map(key => new Promise((resolve, reject) => {
            documentClient.query({
                TableName: process.env.GOALS_TABLE_NAME,
                ScanIndexForward: false,
                Limit: 1,
                KeyConditionExpression: "goalId = :goalId",
                ExpressionAttributeValues: {
                    ':goalId': `${user}/${key}`
                }
            }, function (err: any, data: any) {
                if (err) return reject(err);
                if (!data.Items.length) {
                    missing.push(key);
                }
                return resolve();
            });
        }))
    );
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Accept",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
        },
        body: JSON.stringify({
            success: true,
            userExists: missing.length === 0,
            missing
        })
    };
}

export {};