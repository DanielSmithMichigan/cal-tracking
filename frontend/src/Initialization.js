import { retrieveDiaryEntries } from './diaryEntries/api';
import { getMeals } from './meals/api';
import { retrieveOrmEntries } from './ormEntries/api';
import { queryWeightGainModel } from './weightGainModel/api';
import { dispatchRetrieveGoals } from './goals/actions';
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
        dispatchRetrieveGoals(),
        store.dispatch(retrieveWeights()),
    ]).then(() => dispatchIsLoading(false));
};