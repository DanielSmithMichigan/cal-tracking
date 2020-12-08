import _ from 'lodash';

export function selectWeights() {
    return state => _.get(state, 'weights.all', []);
}