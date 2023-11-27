/* eslint-disable no-param-reassign */
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { loadEvaluationVersionList } from './evaluation-version-list.query';
import { EvaluationVersionState } from '../domain/entity/EvaluationVersionList';

export const evaluationVersionAdapter =
  createEntityAdapter<EvaluationVersionState>();

export const evaluationVersionSlice2 = createSlice({
  name: 'evaluationVersions2',
  initialState: evaluationVersionAdapter.getInitialState({
    loading: false,
  }),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(loadEvaluationVersionList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadEvaluationVersionList.fulfilled, (state, action) => {
      state.loading = false;
      evaluationVersionAdapter.addMany(
        state,
        action.payload.evaluationVersions
      );
    });
  },
});
