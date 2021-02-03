import json
from scipy.optimize import minimize
import boto3
import os
from datetime import datetime
import time
import dateutil.parser
import numpy as np
import decimal

min_days_requirement = 7.0
weeks_per_anchor = 3.0
seconds_per_day = 60 * 60 * 24
seconds_per_week = seconds_per_day * 7
    
dynamodb = boto3.resource('dynamodb')

def from_iso(iso):
    return dateutil.parser.isoparse(iso)

def unix_time_sec(dt):
    return dt.timestamp()

def days_fraction(days):
    return min(
        max(
            (min_days_requirement - days) / min_days_requirement,
            0.0
        ),
        1.0
    )

def custom_regression(anchor_point_weights, weights, weight_timestamps, anchor_point_timestamps):
    weights_errors = []
    for timestamp_idx in range(len(weight_timestamps)):
        timestamp = weight_timestamps[timestamp_idx]
        weight = weights[timestamp_idx]
        anchor_idx_before, anchor_idx_after = find_idx(timestamp, anchor_point_timestamps)
        pct_along_timeline = (timestamp - anchor_point_timestamps[anchor_idx_before]) / ( anchor_point_timestamps[anchor_idx_after] - anchor_point_timestamps[anchor_idx_before] )
        proposed_y = pct_along_timeline * anchor_point_weights[anchor_idx_after] + (1.0 - pct_along_timeline) * anchor_point_weights[anchor_idx_before]
        weights_errors.append( ( float(weight) - proposed_y ) ** 2 )

    slopes_errors = []
    for anchor_point_idx in range(1, len(anchor_point_weights)):
        anchor_point_timestamp_before = anchor_point_timestamps[anchor_point_idx - 1]
        anchor_point_timestamp_after = anchor_point_timestamps[anchor_point_idx]
        anchor_point_weight_before = anchor_point_weights[anchor_point_idx - 1]
        anchor_point_weight_after = anchor_point_weights[anchor_point_idx]
        weight_gained = anchor_point_weight_after - anchor_point_weight_before
        seconds_passed = anchor_point_timestamp_after - anchor_point_timestamp_before
        days_passed = seconds_passed * seconds_per_day
        weeks_passed = days_passed * 7
        lb_per_week = weight_gained / weeks_passed
        slopes_errors.append(abs(lb_per_week * 1.4) ** 3 * days_fraction(days_passed))

    slopes_errors_2 = []
    for anchor_point_idx in range(1, len(anchor_point_weights)):
        slopes_errors_2.append(
            (float (anchor_point_weights[anchor_point_idx - 1]) - float (anchor_point_weights[anchor_point_idx])) ** 2
        )
    return np.sum(weights_errors) + np.sum(slopes_errors_2) * 0.05# + np.sum(slopes_errors)

def find_idx(timestamp, timestamps):
    for timestamp_idx in range(1, len(timestamps)):
        comparison_timestamp = timestamps[timestamp_idx]
        if timestamp < comparison_timestamp:
            return timestamp_idx - 1, timestamp_idx
    return len(timestamps) - 2, len(timestamps) - 1


def weights_query(user, LastEvaluatedKey=None):
    table = dynamodb.Table(os.environ['WEIGHTS_TABLE_NAME'])
    extraArgs = {}
    if LastEvaluatedKey:
        extraArgs['ExclusiveStartKey'] = LastEvaluatedKey
    response = table.query(
        KeyConditionExpression = '#user = :user',
        ExpressionAttributeValues = {
            ':user': user
        },
        ExpressionAttributeNames = {
            '#user': 'user'
        },
        **extraArgs
    )
    if 'LastEvaluatedKey' in response:
        return response['Items'] + weights_query(
            user=user,
            LastEvaluatedKey=response['LastEvaluatedKey']
        )
    return response['Items']
    
def get_timestamp(val): 
    return val['timestamp']

def main(event, context):
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Accept',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
            },
            'body': json.dumps({'success': True})
        }
    body = json.loads(event['body'])

    weights = weights_query(
        user=body['user']
    )
    weights.sort(key=get_timestamp)
    weight_timestamps = [ unix_time_sec(from_iso(item['timestamp'])) for item in weights ]
    weights = [ item['weight'] for item in weights ]

    if len(weights) < 2:
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Accept',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
            },
            'body': json.dumps({
                'spline_weights': [],
                'spline_timestamps': [],
                'spline_goals': [],
                'success': True
            })
        }

    curr_time = weight_timestamps[-1]

    anchor_points_timestamps = [
        curr_time
    ]

    while(curr_time > weight_timestamps[0]):
        next_time = max(curr_time - seconds_per_week * weeks_per_anchor, weight_timestamps[0])

        earlier_time = next_time
        later_time = curr_time
        found = False
        count_before = 0
        for weight_timestamp in weight_timestamps:
            if weight_timestamp < earlier_time:
                count_before += 1
            if weight_timestamp <= later_time and weight_timestamp >= earlier_time:
                found = True

        curr_time = next_time
        
        if (found and count_before >= 2) or curr_time <= weight_timestamps[0]:
            anchor_points_timestamps.append(curr_time)

    anchor_points_timestamps.reverse()

    anchor_point_weights = [ np.mean(weights) for anchor_point in anchor_points_timestamps ]

    res = minimize(
        custom_regression,
        anchor_point_weights,
        args=( weights, weight_timestamps, anchor_points_timestamps ),
        method='nelder-mead',
        options={'xatol': 1e-2, 'disp': False}
    )
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Accept',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
        },
        'body': json.dumps({
            'spline_weights': res.x.tolist(),
            'spline_timestamps': anchor_points_timestamps,
            'success': True
        })
    }
