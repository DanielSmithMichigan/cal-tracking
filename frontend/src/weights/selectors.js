import _ from 'lodash';

export function selectWeights() {
    return state => _.get(state, 'weights.all', []);
}

export function selectNewestWeightTimestamp(state) {
    const weights = _.get(state, 'weights.all', []);
    const orderedWeights = _.orderBy(weights, ['timestamp'], ['desc']);
    return orderedWeights[0].timestamp;
}