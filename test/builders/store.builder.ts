import {
  createStore,
  rootReducer,
  RootStateWithDI,
} from '../../src/module/shared/core/domain/store';
import { createFakeLoadEvaluationVersionList } from '../module/evaluations/core/infrastructure/evaluation-versions.fake';
import {
  LoadEvaluationVersionList,
  ThunkExtraArg,
} from '../../src/module/shared/core/domain/dependencies';
import { EvaluationVersionList } from '../../src/module/evaluations/core/domain/entity/EvaluationVersionList';

export const storeBuilder = (
  state: RootStateWithDI = rootReducer(undefined, { type: '' }),
  {
    loadEvaluationVersionList = createFakeLoadEvaluationVersionList(
      new EvaluationVersionList([])
    ),
  }: Partial<ThunkExtraArg> = {}
) => {
  const storeDependencies = { loadEvaluationVersionList };

  return {
    withLoadEvaluationVersionList(
      _loadEvaluationVersionList: LoadEvaluationVersionList
    ) {
      return storeBuilder(state, {
        ...storeDependencies,
        loadEvaluationVersionList: _loadEvaluationVersionList,
      });
    },
    build() {
      return createStore({
        preloadedState: state,
        loadEvaluationVersionList,
      });
    },
  };
};
