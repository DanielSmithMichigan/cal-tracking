import { retrieveDiaryEntries } from './diaryEntries/api';
import { getMeals } from './meals/api';
import { retrieveOrmEntries } from './ormEntries/api';
import { queryWeightGainModel } from './weightGainModel/api';
import { retrieveGoals } from './goals/api';
import { retrieveWeights } from './weights/api';

import { dispatchIsLoading } from './webData/actions';

import store from './RootStore';

export const userInitialization = () => {
    dispatchIsLoading(true);
    return Promise.all([
        store.dispatch(retrieveDiaryEntries()),
        store.dispatch(getMeals()),
        store.dispatch(retrieveOrmEntries()),
        store.dispatch(queryWeightGainModel()),
        store.dispatch(retrieveGoals()),
        store.dispatch(retrieveWeights()),
    ]).then(() => dispatchIsLoading(false));
};