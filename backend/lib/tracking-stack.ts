import * as core from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';

export class TrackingStack extends core.Construct {
    constructor(scope: core.Construct, id: string) {
        super(scope, id);

        const goalsTable = new dynamodb.Table(this, 'GoalsTable', {
            partitionKey: { name: 'goalId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
        });

        const diaryTable = new dynamodb.Table(this, 'DiaryTable', {
            partitionKey: { name: 'user', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
        });

        const mealsTable = new dynamodb.Table(this, 'MealsTable', {
            partitionKey: { name: 'user', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'mealName', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
        });

        const weightTable = new dynamodb.Table(this, 'WeightsTable', {
            partitionKey: { name: 'user', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
        });

        const ormTable = new dynamodb.Table(this, 'OrmTable', {
            partitionKey: { name: 'user', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'itemKey', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
        });

        const role = new iam.Role(this, 'Role', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });

        role.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            resources: [diaryTable.tableArn, goalsTable.tableArn, mealsTable.tableArn, weightTable.tableArn, ormTable.tableArn],
            actions: ['dynamodb:PutItem', 'dynamodb:Query', 'dynamodb:GetItem', 'dynamodb:DeleteItem']
        }));

        role.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            resources: ['arn:aws:logs:*:*:*'],
            actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents']
        }))

        const goalsService = new lambda.Function(this, "GoalsServiceHandler", {
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.asset("resources"),
            handler: "goals.main",
            environment: {
                GOALS_TABLE_NAME: goalsTable.tableName,
                DIARY_TABLE_NAME: diaryTable.tableName,
                MEALS_TABLE_NAME: mealsTable.tableName,
                WEIGHTS_TABLE_NAME: weightTable.tableName,
                ORM_TABLE_NAME: ormTable.tableName
            },
            role
        });

        const mealsService = new lambda.Function(this, "MealsServiceHandler", {
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.asset("resources"),
            handler: "meals.main",
            environment: {
                GOALS_TABLE_NAME: goalsTable.tableName,
                DIARY_TABLE_NAME: diaryTable.tableName,
                MEALS_TABLE_NAME: mealsTable.tableName,
                WEIGHTS_TABLE_NAME: weightTable.tableName,
                ORM_TABLE_NAME: ormTable.tableName
            },
            role
        });

        const diaryService = new lambda.Function(this, "DiaryServiceHandler", {
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.asset("resources"),
            handler: "diary.main",
            environment: {
                GOALS_TABLE_NAME: goalsTable.tableName,
                DIARY_TABLE_NAME: diaryTable.tableName,
                MEALS_TABLE_NAME: mealsTable.tableName,
                WEIGHTS_TABLE_NAME: weightTable.tableName,
                ORM_TABLE_NAME: ormTable.tableName
            },
            role,
            timeout: core.Duration.seconds(25)
        });

        const weightService = new lambda.Function(this, "WeightServiceHandler", {
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.asset("resources"),
            handler: "weight.main",
            environment: {
                GOALS_TABLE_NAME: goalsTable.tableName,
                DIARY_TABLE_NAME: diaryTable.tableName,
                MEALS_TABLE_NAME: mealsTable.tableName,
                WEIGHTS_TABLE_NAME: weightTable.tableName,
                ORM_TABLE_NAME: ormTable.tableName
            },
            role,
            timeout: core.Duration.seconds(25)
        });

        const ormService = new lambda.Function(this, "OrmServiceHandler", {
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.asset("resources"),
            handler: "ormEntries.main",
            environment: {
                GOALS_TABLE_NAME: goalsTable.tableName,
                DIARY_TABLE_NAME: diaryTable.tableName,
                MEALS_TABLE_NAME: mealsTable.tableName,
                WEIGHTS_TABLE_NAME: weightTable.tableName,
                ORM_TABLE_NAME: ormTable.tableName
            },
            role
        });
        
        // const modelsLayer = new lambda.LayerVersion(this, 'models-layer', {
        //     code: lambda.Code.fromAsset('modeling/data-science-layer'),
        //     compatibleRuntimes: [lambda.Runtime.PYTHON_3_8],
        //     description: 'A layer with scipy, numpy, basic data science tools',
        // });

        const modelsLayer = lambda.LayerVersion.fromLayerVersionArn(this, 'layerversion', 'arn:aws:lambda:us-west-2:420165488524:layer:AWSLambda-Python38-SciPy1x:2');


        const weightGainModelService = new lambda.Function(this, "WeightGainModelHandler", {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.asset("modeling/code"),
            handler: "weight-gain-model.main",
            layers: [
                modelsLayer
            ],
            environment: {
                GOALS_TABLE_NAME: goalsTable.tableName,
                DIARY_TABLE_NAME: diaryTable.tableName,
                MEALS_TABLE_NAME: mealsTable.tableName,
                WEIGHTS_TABLE_NAME: weightTable.tableName,
                ORM_TABLE_NAME: ormTable.tableName
            },
            role,
            timeout: core.Duration.seconds(25)
        });

        const goalsApi = new apigateway.LambdaRestApi(this, "goals-api", {
            handler: goalsService,
            proxy: false,
            restApiName: "Goals Service",
            description: "This service is responsible for recording and retrieving goals"
        });

        const getGoals = goalsApi.root.addResource('get-goals');
        getGoals.addMethod('POST');
        getGoals.addMethod('OPTIONS');

        const setGoal = goalsApi.root.addResource('set-goal');
        setGoal.addMethod('POST');
        setGoal.addMethod('OPTIONS');

        const checkGoalsExist = goalsApi.root.addResource('check-goals-exist');
        checkGoalsExist.addMethod('POST');
        checkGoalsExist.addMethod('OPTIONS');

        const mealsApi = new apigateway.LambdaRestApi(this, "meals-api", {
            handler: mealsService,
            proxy: false,
            restApiName: "Meals Service",
            description: "This service is responsible for recording and retrieving meals"
        });

        const meals = mealsApi.root.addResource('meals');
        
        const addMeal = meals.addResource('add');
        addMeal.addMethod('POST');
        addMeal.addMethod('OPTIONS');
        
        const getMeals = meals.addResource('get');
        getMeals.addMethod('POST');
        getMeals.addMethod('OPTIONS');
        
        const deleteMeal = meals.addResource('delete');
        deleteMeal.addMethod('POST');
        deleteMeal.addMethod('OPTIONS');

        const diaryApi = new apigateway.LambdaRestApi(this, "diary-api", {
            handler: diaryService,
            proxy: false,
            restApiName: "Diary Service",
            description: "This service is responsible for recording and retrieving diary entries"
        });

        const diary = diaryApi.root.addResource('diary');
        
        const addDiaryEntry = diary.addResource('add-entry');
        addDiaryEntry.addMethod('POST');
        addDiaryEntry.addMethod('OPTIONS');
        
        const getDiaryEntries = diary.addResource('get-entries');
        getDiaryEntries.addMethod('POST');
        getDiaryEntries.addMethod('OPTIONS');

        const recordOneTimeDiaryEntry = diary.addResource('record-one-time-diary-entry');
        recordOneTimeDiaryEntry.addMethod('POST');
        recordOneTimeDiaryEntry.addMethod('OPTIONS');

        const deleteEntry = diary.addResource('delete-entry');
        deleteEntry.addMethod('POST');
        deleteEntry.addMethod('OPTIONS');

        const weightApi = new apigateway.LambdaRestApi(this, "weight-api", {
            handler: weightService,
            proxy: false,
            restApiName: "Weight Service",
            description: "This service is responsible for recording and retrieving weight"
        });

        const weight = weightApi.root.addResource('weight');
        
        const recordWeight = weight.addResource('record');
        recordWeight.addMethod('POST');
        recordWeight.addMethod('OPTIONS');
        
        const getWeights = weight.addResource('get');
        getWeights.addMethod('POST');
        getWeights.addMethod('OPTIONS');
        
        const deleteWeight = weight.addResource('delete');
        deleteWeight.addMethod('POST');
        deleteWeight.addMethod('OPTIONS');

        const ormApi = new apigateway.LambdaRestApi(this, "orm-api", {
            handler: ormService,
            proxy: false,
            restApiName: "ORM Service",
            description: "This service is responsible for recording and retrieving one-rep max"
        });

        const orm = ormApi.root.addResource('orm');
        
        const recordOrm = orm.addResource('record-entry');
        recordOrm.addMethod('POST');
        recordOrm.addMethod('OPTIONS');
        
        const getOrm = orm.addResource('get-entries');
        getOrm.addMethod('POST');
        getOrm.addMethod('OPTIONS');
        
        const deleteOrm = orm.addResource('delete-entry');
        deleteOrm.addMethod('POST');
        deleteOrm.addMethod('OPTIONS');

        const weightGainModelApi = new apigateway.LambdaRestApi(this, "weight-gain-model-api", {
            handler: weightGainModelService,
            proxy: false,
            restApiName: "Weight Gain Model Service",
            description: "This service is responsible for building and retrieving weight gain model"
        });

        const model = weightGainModelApi.root.addResource('model');
        model.addMethod('POST');
        model.addMethod('OPTIONS');
    }
}