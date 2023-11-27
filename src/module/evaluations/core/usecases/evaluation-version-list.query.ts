import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkExtraArg } from '../../../shared/core/domain/dependencies';
import { EvaluationVersionList } from '../domain/entity/EvaluationVersionList';

export const loadEvaluationVersionList = createAsyncThunk<
  EvaluationVersionList['state'],
  void,
  { extra: ThunkExtraArg }
>('evaluationVersions/loadEvaluationVersionList', async (_, { extra }) => {
  const evaluationVersionList = await extra.loadEvaluationVersionList();
  return evaluationVersionList.state;
});
