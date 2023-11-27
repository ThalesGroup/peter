import { EvaluationVersion } from '../entity/EvaluationVersions';

export interface EvaluationVersionApi {
  load: () => Promise<EvaluationVersion[]>;
}
