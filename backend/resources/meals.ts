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

        if (event.path === "/meals/add") {
            return await addMeal(event);
        } else if (event.path === "/meals/get") {
            return await getMeals(event);
        } else if (event.path === "/meals/delete") {
            return await deleteMeal(event);
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

async function addMeal(event: any) {
    const eventBody = JSON.parse(event.body);
    await new Promise((resolve, reject) => {
        documentClient.put({
            TableName: process.env.MEALS_TABLE_NAME,
            Item: eventBody
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

async function deleteMeal(event: any) {
    const eventBody = JSON.parse(event.body);
    const { user, mealName } = eventBody;
    await new Promise((resolve, reject) => {
        documentClient.delete({
            TableName: process.env.MEALS_TABLE_NAME,
            Key: {
                user,
                mealName
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

async function getMeals(event: any) {
    const { user } = JSON.parse(event.body);
    const { Items } = await queryMealsIteration(user);
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

async function queryMealsIteration ( user : any, ExclusiveStartKey = undefined ) : Promise<{ Items : [any], LastEvaluatedKey?: String }> {
    let { Items, LastEvaluatedKey } = await new Promise((resolve, reject) => {
        documentClient.query({
            TableName: process.env.MEALS_TABLE_NAME,
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
        const { Items : MoreItems, LastEvaluatedKey: NextLastEvaluatedKey } = await queryMealsIteration( user, LastEvaluatedKey );
        LastEvaluatedKey = NextLastEvaluatedKey;
        Items = Items.concat(MoreItems); 
    }
    return { Items };
}

export {};
