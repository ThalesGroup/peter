import { aStandardProduct } from '../../../products/core/utils/ProductBuilder';
import {
  categorizeImpacts,
  evaluationForProductComputed,
} from '../../../../../src/module/evaluations/core/domain/evaluationVersions.slice';
import { EvaluatedProduct } from '../../../../../src/module/evaluations/core/domain/entity/EvaluatedProduct';
import { mapFromProduct } from '../../../../../src/module/evaluations/core/domain/mappers/EvaluatedProductMapper';
import {
  EvaluationImpact,
  EvaluationResult,
  EvaluationType,
} from '../../../../../src/module/evaluations/core/domain/entity/EvaluationVersions';
import { Category } from '../../../../../src/module/evaluations/core/domain/entity/Category';
import { InUseMobilityType } from '../../../../../src/module/products/core/domain/entity/InUseMobilityType';
import {
  createFakeLoadEvaluationVersionList,
  FakeEvaluationVersionApi,
  STANDARD_EVALUATION_VERSION,
} from '../infrastructure/evaluation-versions.fake';
import { storeBuilder } from '../../../../builders/store.builder';
import { EvaluationVersionList } from '../../../../../src/module/evaluations/core/domain/entity/EvaluationVersionList';
import { loadEvaluationVersionList } from '../../../../../src/module/evaluations/core/usecases/evaluation-version-list.query';
import { AppStore } from '../../../../../src/module/shared/core/domain/store';

const createSut = () => {
  const evaluationVersionApi = new FakeEvaluationVersionApi();
  let store: AppStore;

  return {
    givenFollowingEvaluationVersionsExist: async (
      evaluationVersionList: {
        id: string;
        version: string;
        types: EvaluationType[];
      }[]
    ) => {
      evaluationVersionApi.initWith(evaluationVersionList);
      store = storeBuilder()
        .withLoadEvaluationVersionList(
          createFakeLoadEvaluationVersionList(
            new EvaluationVersionList(evaluationVersionList)
          )
        )
        .build();
      await store.dispatch(loadEvaluationVersionList());
    },
    whenComputingEvaluationForProduct(inputs: {
      versionId: string;
      product: EvaluatedProduct;
    }) {
      store.dispatch(
        evaluationForProductComputed({
          versionId: inputs.versionId,
          product: inputs.product,
        })
      );
    },
    shouldReturnError(expectedError: string) {
      expect(store.getState().evaluationVersions.result.error).toEqual(
        expectedError
      );
    },
    computedResultShouldBe(param: any) {
      expect(store.getState().evaluationVersions.result.values).toEqual(
        expect.arrayContaining<EvaluationResult>([
          expect.objectContaining(param),
        ])
      );
    },
  };
};
type Sut = ReturnType<typeof createSut>;

describe('Evaluate product impacts', () => {
  let sut: Sut;

  beforeEach(() => {
    sut = createSut();
  });

  describe('Compute CO₂ emissions', () => {
    test("Throw an error when version doesn't exist", async () => {
      const product = aStandardProduct();

      await sut.givenFollowingEvaluationVersionsExist([
        STANDARD_EVALUATION_VERSION,
      ]);

      const productForEvaluation: EvaluatedProduct = mapFromProduct(product);

      await sut.whenComputingEvaluationForProduct({
        versionId: '0',
        product: productForEvaluation,
      });

      sut.shouldReturnError('Version "0" doesn\'t exist');
    });

    test('Reset error state when computation succeed', async () => {
      const product = aStandardProduct();

      await sut.givenFollowingEvaluationVersionsExist([
        STANDARD_EVALUATION_VERSION,
      ]);

      const productForEvaluation: EvaluatedProduct = mapFromProduct(product);

      await sut.whenComputingEvaluationForProduct({
        versionId: '0',
        product: productForEvaluation,
      });

      await sut.whenComputingEvaluationForProduct({
        versionId: '1.0.0',
        product: productForEvaluation,
      });

      sut.shouldReturnError('');
    });

    test('Compute results (embedded)', async () => {
      const product = aStandardProduct();

      await sut.givenFollowingEvaluationVersionsExist([
        STANDARD_EVALUATION_VERSION,
      ]);

      const productForEvaluation: EvaluatedProduct = mapFromProduct(product);

      await sut.whenComputingEvaluationForProduct({
        versionId: '1.0.0',
        product: productForEvaluation,
      });

      sut.shouldReturnError('');
      sut.computedResultShouldBe({
        impacts: [
          {
            name: 'Hardware mechanics',
            total: 22,
            details: [
              {
                impact: {
                  unit: 'kg',
                  value: 12,
                },
                labelId: '1',
                factor: 3,
                quantity: {
                  unit: 'kg',
                  value: 4,
                },
              },
              {
                impact: {
                  unit: 'kg',
                  value: 10,
                },
                labelId: '3',
                factor: 5,
                quantity: {
                  unit: 'kg',
                  value: 2,
                },
              },
            ],
          },
          {
            name: 'Hardware electronics',
            total: 620,
            details: [
              {
                impact: {
                  unit: 'kg',
                  value: 120,
                },
                factor: 30,
                labelId: '1',
                quantity: {
                  unit: 'kg',
                  value: 4,
                },
              },
              {
                impact: {
                  unit: 'kg',
                  value: 500,
                },
                factor: 250,
                labelId: '2',
                quantity: {
                  unit: 'kg',
                  value: 2,
                },
              },
            ],
          },
          {
            name: 'In-use mobility',
            total: 252000,
            details: [
              {
                impact: {
                  unit: 'kg',
                  value: 252000,
                },
                factor: 21000,
                labelId: '1',
                quantity: {
                  unit: '',
                  value: 100000,
                },
              },
            ],
          },
          {
            name: 'In-use power consumption',
            total: 703.1,
            details: [
              {
                impact: {
                  unit: '',
                  value: 0,
                },
                labelId: 'In-use lifetime',
                quantity: {
                  unit: 'h',
                  value: 175200,
                },
              },
              {
                impact: {
                  unit: '',
                  value: 0,
                },
                labelId: 'Mean power',
                quantity: {
                  unit: 'W',
                  value: 9.1,
                },
              },
              {
                impact: {
                  unit: '',
                  value: 0,
                },
                factor: 0.441,
                labelId: 'e0e40dd9-f999-47e4-942f-9f9760ce7c89',
                quantity: {
                  unit: '',
                  value: 1,
                },
              },
            ],
          },
          {
            name: 'Recycling',
            total: 14.4,
            details: [
              {
                impact: {
                  unit: 'kg',
                  value: 14.4,
                },
                factor: 1.2,
                labelId: 'TYPE_2',
                quantity: {
                  unit: '',
                  value: 1,
                },
              },
            ],
          },
        ],
        impactsSpread: {
          'Hardware mechanics': 0.0,
          'Hardware electronics': 0.2,
          'In-use mobility': 99.5,
          'In-use power consumption': 0.3,
          Recycling: 0.0,
        },
        total: 253359.5,
        category: 'EM',
        name: 'Lifecycle CO₂ emissions',
      });
    });

    test('Compute results for test & qualifications', async () => {
      const product = aStandardProduct();

      await sut.givenFollowingEvaluationVersionsExist([
        STANDARD_EVALUATION_VERSION,
      ]);

      const productForEvaluation: EvaluatedProduct = mapFromProduct({
        ...product,
        energyUsedAtTestLocations: {
          enabled: true,
          testLocations: [
            {
              id: '1',
              testLocationId: 'bc763be3-e0f7-4152-938b-5a47b13c7342',
              energy: 50,
            },
            {
              id: '2',
              testLocationId: '668a37ef-f615-47da-9b49-2072d4c59cae',
              energy: 100,
            },
          ],
        },
      });

      sut.whenComputingEvaluationForProduct({
        versionId: '1.0.0',
        product: productForEvaluation,
      });

      // Then result should be
      sut.computedResultShouldBe({
        impacts: [
          {
            name: 'Hardware mechanics',
            total: 22,
            details: [
              {
                labelId: '1',
                factor: 3,
                quantity: {
                  value: 4,
                  unit: 'kg',
                },
                impact: {
                  value: 12,
                  unit: 'kg',
                },
              },
              {
                labelId: '3',
                factor: 5,
                quantity: {
                  value: 2,
                  unit: 'kg',
                },
                impact: {
                  value: 10,
                  unit: 'kg',
                },
              },
            ],
          },
          {
            name: 'Hardware electronics',
            total: 620,
            details: [
              {
                impact: {
                  unit: 'kg',
                  value: 120,
                },
                factor: 30,
                labelId: '1',
                quantity: {
                  unit: 'kg',
                  value: 4,
                },
              },
              {
                impact: {
                  unit: 'kg',
                  value: 500,
                },
                factor: 250,
                labelId: '2',
                quantity: {
                  unit: 'kg',
                  value: 2,
                },
              },
            ],
          },
          {
            name: 'Tests & Qualification',
            total: 20.8,
            details: [
              {
                impact: {
                  unit: 'kg',
                  value: 3,
                },
                factor: 0.06,
                labelId: 'bc763be3-e0f7-4152-938b-5a47b13c7342',
                quantity: {
                  unit: 'kW',
                  value: 50,
                },
              },
              {
                impact: {
                  unit: 'kg',
                  value: 17.8,
                },
                labelId: '668a37ef-f615-47da-9b49-2072d4c59cae',
                factor: 0.178,
                quantity: {
                  unit: 'kW',
                  value: 100,
                },
              },
            ],
          },
          {
            name: 'In-use mobility',
            total: 252000,
            details: [
              {
                impact: {
                  unit: 'kg',
                  value: 252000,
                },
                factor: 21000,
                labelId: '1',
                quantity: {
                  unit: '',
                  value: 100000,
                },
              },
            ],
          },
          {
            name: 'In-use power consumption',
            total: 703.1,
            details: [
              {
                impact: {
                  unit: '',
                  value: 0,
                },
                labelId: 'In-use lifetime',
                quantity: {
                  unit: 'h',
                  value: 175200,
                },
              },
              {
                impact: {
                  unit: '',
                  value: 0,
                },
                labelId: 'Mean power',
                quantity: {
                  unit: 'W',
                  value: 9.1,
                },
              },
              {
                impact: {
                  unit: '',
                  value: 0,
                },
                labelId: 'e0e40dd9-f999-47e4-942f-9f9760ce7c89',
                factor: 0.441,
                quantity: {
                  unit: '',
                  value: 1,
                },
              },
            ],
          },
          {
            name: 'Recycling',
            total: 14.4,
            details: [
              {
                impact: {
                  unit: 'kg',
                  value: 14.4,
                },
                labelId: 'TYPE_2',
                factor: 1.2,
                quantity: {
                  unit: '',
                  value: 1,
                },
              },
            ],
          },
        ],
        impactsSpread: {
          'Hardware mechanics': 0.0,
          'Hardware electronics': 0.2,
          'In-use mobility': 99.5,
          'In-use power consumption': 0.3,
          'Tests & Qualification': 0.0,
          Recycling: 0.0,
        },
        total: 253380.3,
        category: 'EM',
        name: 'Lifecycle CO₂ emissions',
      });
    });

    test('Compute results (transported)', async () => {
      const product = aStandardProduct(InUseMobilityType.TRANSPORTED);

      await sut.givenFollowingEvaluationVersionsExist([
        STANDARD_EVALUATION_VERSION,
      ]);

      const productForEvaluation: EvaluatedProduct = mapFromProduct(product);

      sut.whenComputingEvaluationForProduct({
        versionId: '1.0.0',
        product: productForEvaluation,
      });

      // Then result should be
      sut.computedResultShouldBe({
        impacts: [
          {
            name: 'Hardware mechanics',
            total: 22,
            details: [
              {
                impact: {
                  unit: 'kg',
                  value: 12,
                },
                labelId: '1',
                factor: 3,
                quantity: {
                  unit: 'kg',
                  value: 4,
                },
              },
              {
                impact: {
                  unit: 'kg',
                  value: 10,
                },
                labelId: '3',
                factor: 5,
                quantity: {
                  unit: 'kg',
                  value: 2,
                },
              },
            ],
          },
          {
            name: 'Hardware electronics',
            total: 620,
            details: [
              {
                factor: 30,
                impact: {
                  unit: 'kg',
                  value: 120,
                },
                labelId: '1',
                quantity: {
                  unit: 'kg',
                  value: 4,
                },
              },
              {
                impact: {
                  unit: 'kg',
                  value: 500,
                },
                factor: 250,
                labelId: '2',
                quantity: {
                  unit: 'kg',
                  value: 2,
                },
              },
            ],
          },
          {
            name: 'In-use mobility',
            total: 360,
            details: [
              {
                impact: {
                  unit: 'kg',
                  value: 120,
                },
                factor: 0.1,
                labelId: 'tpm-20',
                quantity: {
                  unit: '',
                  value: 100,
                },
              },
              {
                impact: {
                  unit: 'kg',
                  value: 240,
                },
                factor: 0.02,
                labelId: 'tpm-16',
                quantity: {
                  unit: '',
                  value: 1000,
                },
              },
            ],
          },
          {
            name: 'In-use power consumption',
            total: 703.1,
            details: [
              {
                impact: {
                  unit: '',
                  value: 0,
                },
                labelId: 'In-use lifetime',
                quantity: {
                  unit: 'h',
                  value: 175200,
                },
              },
              {
                impact: {
                  unit: '',
                  value: 0,
                },
                labelId: 'Mean power',
                quantity: {
                  unit: 'W',
                  value: 9.1,
                },
              },
              {
                impact: {
                  unit: '',
                  value: 0,
                },
                factor: 0.441,
                labelId: 'e0e40dd9-f999-47e4-942f-9f9760ce7c89',
                quantity: {
                  unit: '',
                  value: 1,
                },
              },
            ],
          },
          {
            name: 'Recycling',
            total: 14.4,
            details: [
              {
                impact: {
                  unit: 'kg',
                  value: 14.4,
                },
                labelId: 'TYPE_2',
                factor: 1.2,
                quantity: {
                  unit: '',
                  value: 1,
                },
              },
            ],
          },
        ],
        impactsSpread: {
          'Hardware mechanics': 1.3,
          'Hardware electronics': 36.1,
          'In-use mobility': 20.9,
          'In-use power consumption': 40.9,
          Recycling: 0.8,
        },
        total: 1719.5,
        category: 'E',
        name: 'Lifecycle CO₂ emissions',
      });
    });

    test('Exclude impact with no value', async () => {
      const product = aStandardProduct();

      await sut.givenFollowingEvaluationVersionsExist([
        STANDARD_EVALUATION_VERSION,
      ]);

      const productForEvaluation: EvaluatedProduct = mapFromProduct({
        ...product,
        totalHardwareMass: 0,
      });

      sut.whenComputingEvaluationForProduct({
        versionId: '1.0.0',
        product: productForEvaluation,
      });

      // Then result should be
      sut.computedResultShouldBe({
        category: 'E',
        impacts: [
          {
            name: 'Hardware mechanics',
            total: 22,
            details: [
              {
                impact: {
                  unit: 'kg',
                  value: 12,
                },
                factor: 3,
                labelId: '1',
                quantity: {
                  unit: 'kg',
                  value: 4,
                },
              },
              {
                impact: {
                  unit: 'kg',
                  value: 10,
                },
                factor: 5,
                labelId: '3',
                quantity: {
                  unit: 'kg',
                  value: 2,
                },
              },
            ],
          },
          {
            name: 'Hardware electronics',
            total: 620,
            details: [
              {
                impact: {
                  unit: 'kg',
                  value: 120,
                },
                factor: 30,
                labelId: '1',
                quantity: {
                  unit: 'kg',
                  value: 4,
                },
              },
              {
                impact: {
                  unit: 'kg',
                  value: 500,
                },
                labelId: '2',
                factor: 250,
                quantity: {
                  unit: 'kg',
                  value: 2,
                },
              },
            ],
          },
          {
            name: 'In-use power consumption',
            total: 703.1,
            details: [
              {
                impact: {
                  unit: '',
                  value: 0,
                },
                labelId: 'In-use lifetime',
                quantity: {
                  unit: 'h',
                  value: 175200,
                },
              },
              {
                impact: {
                  unit: '',
                  value: 0,
                },
                labelId: 'Mean power',
                quantity: {
                  unit: 'W',
                  value: 9.1,
                },
              },
              {
                impact: {
                  unit: '',
                  value: 0,
                },
                factor: 0.441,
                labelId: 'e0e40dd9-f999-47e4-942f-9f9760ce7c89',
                quantity: {
                  unit: '',
                  value: 1,
                },
              },
            ],
          },
        ],
        impactsSpread: {
          'Hardware electronics': 46.1,
          'Hardware mechanics': 1.6,
          'In-use power consumption': 52.3,
        },
        name: 'Lifecycle CO₂ emissions',
        total: 1345.1,
      });
    });
  });

  describe('Product categorization', () => {
    test('Cannot categorize when no impacts', () => {
      const impacts: EvaluationImpact[] = [];

      const categorization = categorizeImpacts(impacts);

      expect(categorization).toEqual(Category.NONE);
    });

    test('Product categorized X when Hardware manufacturing have the highest CO₂ impact', () => {
      const impacts: EvaluationImpact[] = [
        { name: 'Hardware mechanics', total: 30, details: [] },
        { name: 'Hardware electronics', total: 20, details: [] },
        { name: 'In-use power consumption', total: 40, details: [] },
        { name: 'In-use mobility', total: 10, details: [] },
      ];

      const categorization = categorizeImpacts(impacts);

      expect(categorization).toEqual(Category.X);
    });

    test('Product categorized E when Power In Use have the highest CO₂ impact', () => {
      const impacts: EvaluationImpact[] = [
        { name: 'Hardware mechanics', total: 15, details: [] },
        { name: 'Hardware electronics', total: 15, details: [] },
        { name: 'In-use power consumption', total: 50, details: [] },
        { name: 'In-use mobility', total: 20, details: [] },
      ];

      const categorization = categorizeImpacts(impacts);

      expect(categorization).toEqual(Category.E);
    });

    test('Product categorized M when Mobility has the highest CO₂ impact', () => {
      const impacts: EvaluationImpact[] = [
        { name: 'Hardware mechanics', total: 20, details: [] },
        { name: 'Hardware electronics', total: 20, details: [] },
        { name: 'In-use power consumption', total: 20, details: [] },
        { name: 'In-use mobility', total: 40, details: [] },
      ];

      const categorization = categorizeImpacts(impacts);

      expect(categorization).toEqual(Category.M);
    });

    test('Product categorized EM when Power In Use & Mobility have the highest CO₂ impact', () => {
      const impacts: EvaluationImpact[] = [
        { name: 'Hardware mechanics', total: 15, details: [] },
        { name: 'Hardware electronics', total: 15, details: [] },
        { name: 'In-use power consumption', total: 37, details: [] },
        { name: 'In-use mobility', total: 33, details: [] },
      ];

      const categorization = categorizeImpacts(impacts);

      expect(categorization).toEqual(Category.EM);
    });
  });
});
