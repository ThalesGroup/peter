import { configureStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit';
import { productListenerMiddleware } from '../../../../../src/module/products/core/domain/product.slice';
import { evaluationVersionListenerMiddleware } from '../../../../../src/module/evaluations/core/domain/evaluationVersions.slice';

function getPartialStoreWithState(
  partialReducer: Reducer,
  preloadedState?: any
) {
  return configureStore({
    reducer: partialReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({}).prepend(
        productListenerMiddleware.middleware,
        evaluationVersionListenerMiddleware.middleware
      ),
  });
}

function getPartialStoreWithStateWithReducerMapObjects(
  partialReducer: ReducersMapObject,
  preloadedState?: any
) {
  return configureStore({
    reducer: partialReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({}).prepend(
        productListenerMiddleware.middleware,
        evaluationVersionListenerMiddleware.middleware
      ),
  });
}

export {
  getPartialStoreWithState,
  getPartialStoreWithStateWithReducerMapObjects,
};
