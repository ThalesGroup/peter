import { EvaluationVersionList } from '../../../evaluations/core/domain/entity/EvaluationVersionList';

export type LoadEvaluationVersionList = {
  (): Promise<EvaluationVersionList>;
};

export type ThunkExtraArg = {
  loadEvaluationVersionList: LoadEvaluationVersionList;
};
