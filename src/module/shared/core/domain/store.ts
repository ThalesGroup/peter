import {
  combineReducers,
  configureStore,
  ConfigureStoreOptions,
} from '@reduxjs/toolkit';
import productReducer, {
  productListenerMiddleware,
} from '../../../products/core/domain/product.slice';
import configurationReducer from '../../../products/core/domain/configuration.slice';
// TODO: Fix later
// eslint-disable-next-line import/no-cycle
import {
  evaluationVersionListenerMiddleware,
  evaluationVersionsSlice,
} from '../../../evaluations/core/domain/evaluationVersions.slice';
import { ThunkExtraArg } from './dependencies';
import { evaluationVersionSlice2 } from '../../../evaluations/core/usecases/evaluation-version.slice';

export const rootReducer = combineReducers({
  configuration: configurationReducer,
  product: productReducer,
  evaluationVersions: evaluationVersionsSlice.reducer,
  [evaluationVersionSlice2.name]: evaluationVersionSlice2.reducer,
});

export const createStore = ({
  preloadedState,
  loadEvaluationVersionList,
}: {
  preloadedState?: ConfigureStoreOptions['preloadedState'];
} & ThunkExtraArg) => {
  return configureStore({
    reducer: rootReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: {
            loadEvaluationVersionList,
          },
        },
      }).prepend(
        productListenerMiddleware.middleware,
        evaluationVersionListenerMiddleware.middleware
      );
    },
    preloadedState,
  });
};

export type AppStore = ReturnType<typeof createStore>;
export type RootStateWithDI = ReturnType<AppStore['getState']>;
export type AppDispatchWithDI = AppStore['dispatch'];
