import { RootStateWithDI } from '../../../shared/core/domain/store';

export const selectEvaluationImpactsResult = (state: RootStateWithDI) =>
  state.evaluationVersions.result;
