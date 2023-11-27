import {
  EvaluationType,
  EvaluationVersion,
} from '../../../../../src/module/evaluations/core/domain/entity/EvaluationVersions';
import {
  createFakeLoadEvaluationVersionList,
  STANDARD_EVALUATION_VERSION,
} from '../infrastructure/evaluation-versions.fake';
import { storeBuilder } from '../../../../builders/store.builder';
import { loadEvaluationVersionList } from '../../../../../src/module/evaluations/core/usecases/evaluation-version-list.query';
import { selectEvaluationVersionList } from '../../../../../src/module/evaluations/core/usecases/evaluation-version.selector';
import { EvaluationVersionList } from '../../../../../src/module/evaluations/core/domain/entity/EvaluationVersionList';
import { AppStore } from '../../../../../src/module/shared/core/domain/store';

const createContext = () => {
  let store: AppStore;

  return {
    givenNewStore: () => {
      store = storeBuilder().build();
    },
    givenFollowingEvaluationVersionsExist: (
      evaluationVersionList: {
        id: string;
        version: string;
        types: EvaluationType[];
      }[]
    ) => {
      const fakeLoadEvaluationVersionList = createFakeLoadEvaluationVersionList(
        new EvaluationVersionList(evaluationVersionList)
      );

      store = storeBuilder()
        .withLoadEvaluationVersionList(fakeLoadEvaluationVersionList)
        .build();
    },
    whenLoadingEvaluationVersions: async () => {
      await store.dispatch(loadEvaluationVersionList());
    },
    thenEvaluationVersionListShouldBe: (
      expectedEvaluations: EvaluationVersion[]
    ) => {
      const retrievedEvaluationVersionList = selectEvaluationVersionList(
        store.getState()
      );
      expect(retrievedEvaluationVersionList).toEqual(
        new EvaluationVersionList(expectedEvaluations)
      );
    },
    thenEvaluationVersionListShouldBeEmpty() {
      expect(
        selectEvaluationVersionList(store.getState()).state.evaluationVersions
      ).toHaveLength(0);
    },
  };
};
type Context = ReturnType<typeof createContext>;

describe('Feature: Load evaluation versions', () => {
  let context: Context;

  beforeEach(() => {
    context = createContext();
  });

  test('No evaluation defined by default', async () => {
    context.givenNewStore();
    context.thenEvaluationVersionListShouldBeEmpty();
  });

  test('Load evaluation versions', async () => {
    context.givenFollowingEvaluationVersionsExist([
      STANDARD_EVALUATION_VERSION,
    ]);

    await context.whenLoadingEvaluationVersions();

    context.thenEvaluationVersionListShouldBe([STANDARD_EVALUATION_VERSION]);
  });

  test('An evaluation version should', async () => {
    context.givenFollowingEvaluationVersionsExist([
      STANDARD_EVALUATION_VERSION,
    ]);

    await context.whenLoadingEvaluationVersions();

    context.thenEvaluationVersionListShouldBe([STANDARD_EVALUATION_VERSION]);
  });
});
