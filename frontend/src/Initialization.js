import { retrieveDiaryEntries } from './diaryEntries/api';
import { retrieveDiaryEntriesByDays } from './diaryEntries/actions';
import { getMeals } from './meals/api';
import { retrieveOrmEntries } from './ormEntries/api';
import { queryWeightGainModel } from './weightGainModel/api';
import { dispatchRetrieveGoals } from './goals/actions';
import { retrieveWeights } from './weights/api';

import { dispatchIsLoading } from './webData/actions';

import store from './RootStore';

export const userInitialization = ({ retrieveHistoricalDiaryEntries = true } = {}) => {
    dispatchIsLoading(true);
    store.dispatch(retrieveWeights());
    store.dispatch(getMeals());
    store.dispatch(retrieveOrmEntries());
    retrieveHistoricalDiaryEntries ? store.dispatch(retrieveDiaryEntries()) : retrieveDiaryEntriesByDays({ days: 14 });
    return Promise.all([
        dispatchRetrieveGoals()
    ]).then(() => dispatchIsLoading(false));
};