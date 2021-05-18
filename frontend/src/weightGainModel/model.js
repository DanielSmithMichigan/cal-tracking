import * as tf from '@tensorflow/tfjs';
import _ from 'lodash';

import { subWeeks, isAfter } from 'date-fns';

const weeksPerAnchor = 3.0;
const schedule = [
    { learningRate: 1.0 , epochs: 50 },
    { learningRate: 0.1 , epochs: 50 },
    { learningRate: 0.01 , epochs: 50 }
];
const pct = tf.scalar(0.001);

export default async function minimize({ weights })
{
    weights = _.orderBy(weights, 'timestamp');
    const averageWeight = _.meanBy(weights, 'weight');
    const mostRecentRecording = _.maxBy(weights, 'timestamp').timestamp;
    const oldestRecording = new Date( _.minBy(weights, 'timestamp').timestamp );
    let currentIterationTime = new Date( mostRecentRecording );
    let splineTimestamps = [ ];
    while (isAfter(currentIterationTime, oldestRecording)) {
        splineTimestamps.push( currentIterationTime.getTime() );
        currentIterationTime = subWeeks( currentIterationTime, weeksPerAnchor);
    }
    splineTimestamps.pop();
    splineTimestamps.push( oldestRecording.getTime() );
    splineTimestamps.reverse();
    const augmentedWeights = weights.map((w, idx) => {
        const weightTime = new Date(w.timestamp).getTime();
        let variableBeforeIdx = _.findLastIndex( splineTimestamps, v => v <= weightTime );
        if (variableBeforeIdx === -1 ) {
            variableBeforeIdx = splineTimestamps.length - 2;
        }
        variableBeforeIdx = Math.min( variableBeforeIdx, splineTimestamps.length - 2 );
        const variableAfterIdx = variableBeforeIdx + 1;
        const variableBefore = splineTimestamps[ variableBeforeIdx ];
        const variableAfter = splineTimestamps[ variableAfterIdx ];
        const pctAlongTimeline = (weightTime - variableBefore) / (variableAfter - variableBefore);
        const pctAlongTimelineScalar = tf.scalar(pctAlongTimeline);
        const pctAlongTimelineInverseScalar = tf.scalar(1 - pctAlongTimeline);
        return { variableBeforeIdx, variableAfterIdx, pctAlongTimeline, pctAlongTimelineScalar, pctAlongTimelineInverseScalar, weight: tf.scalar( w.weight ), weightVal: w.weight };
    });
    const weightComposition = splineTimestamps.map((_, idx) => {
        let sumOfWeights = 0;
        const cumulativeWeight = augmentedWeights.reduce(
            (accumulator, w) => {
                let additional = 0;
                if ( w.variableBeforeIdx === idx ) {
                    additional = (1.0 - w.pctAlongTimeline);
                } else if ( w.variableAfterIdx === idx ) {
                    additional =  w.pctAlongTimeline;
                }
                sumOfWeights += additional;
                return accumulator + additional * w.weightVal;
            },
            0
        )
        return cumulativeWeight / sumOfWeights;
    });
    const pctTensor = tf.tensor1d( augmentedWeights.map( w => w.pctAlongTimeline ) );
    const pctInverseTensor = tf.tensor1d( augmentedWeights.map( w => 1 - w.pctAlongTimeline ) );
    const beforeTensor = tf.tensor1d( augmentedWeights.map( w => w.variableBeforeIdx ), 'int32' );
    const afterTensor = tf.tensor1d( augmentedWeights.map( w => w.variableAfterIdx ), 'int32' );
    const labelsTensor = tf.tensor1d( weights.map( w => w.weight ) );
    const learningRateTensor = tf.variable( tf.scalar( 0 ) );
    const optimizer = tf.train.adam( 0.1 );
    const variablesTensor = tf.variable( tf.tensor1d( weightComposition ) );
    const sliceAIdx = tf.tensor1d( _.range( splineTimestamps.length - 2 ), 'int32' );
    const sliceBIdx = tf.tensor1d( _.range( 1, splineTimestamps.length - 1 ), 'int32' );
    const t = new Date();
    for ( let currentTrainingRegimenIdx of _.range(schedule.length) ) {
        const currentTrainingRegimen = schedule[currentTrainingRegimenIdx];
        const optimizer = tf.train.adam( currentTrainingRegimen.learningRate );
        for ( let iteration of _.range( currentTrainingRegimen.epochs) ) {
            optimizer.minimize( () => {
                return(
                    pct.mul(
                        variablesTensor.gather(sliceAIdx)
                            .sub( variablesTensor.gather(sliceBIdx) )
                            .square()
                            .mean()
                    )
                ).add (
                    (
                        (
                            variablesTensor.gather(beforeTensor)
                                .mul( pctInverseTensor )
                        )
                    )
                    .add(
                        (
                            variablesTensor.gather(afterTensor)
                                .mul(pctTensor)
                        )
                    )
                    .sub( labelsTensor )
                    .square()
                    .mean()
                );
            });
            // await err.array()
            //     .then((val) => errs.push(val));
        }
    }
    const t2 = new Date();
    const splineWeights = await variablesTensor.array();
    return {
        splineWeights,
        splineTimes: splineTimestamps,
        t: t2 - t
    };
}