import {
  evaluationVersionAdapter,
  evaluationVersionSlice2,
} from './evaluation-version.slice';
import { EvaluationVersionList } from '../domain/entity/EvaluationVersionList';
// TODO: Fix later
// eslint-disable-next-line import/no-cycle
import { RootStateWithDI } from '../../../shared/core/domain/store';

const createSelector =
  <T>(
    selector: (
      sliceState: RootStateWithDI[typeof evaluationVersionSlice2['name']]
    ) => T
  ) =>
  (state: RootStateWithDI) =>
    selector(state[evaluationVersionSlice2.name]);
export const selectEvaluationVersionList = createSelector(
  (sliceState) =>
    new EvaluationVersionList(
      evaluationVersionAdapter.getSelectors().selectAll(sliceState)
    )
);
