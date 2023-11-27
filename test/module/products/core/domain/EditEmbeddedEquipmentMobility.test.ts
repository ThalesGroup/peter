import { productBuilder } from './builders/product.builder';
import {
  getPartialStoreWithState,
  getPartialStoreWithStateWithReducerMapObjects,
} from '../utils/StoreInitializer';
import productReducer, {
  loadMobilityEquipmentConfiguration,
  productSlice,
  usageOfEmbeddedPlatformModelBuilder,
} from '../../../../../src/module/products/core/domain/product.slice';
import { InUseMobilityType } from '../../../../../src/module/products/core/domain/entity/InUseMobilityType';
import {
  DefaultEmbeddedPlatformModelId,
  DefaultSectorId,
  EmbeddedPlatformModel,
  TransportedPlatformModel,
} from '../../../../../src/module/products/core/domain/entity/PlatformModel';
import {
  newProduct,
  productWithEmbeddedMobility,
  productWithLoadedEmbeddedPlatformModels,
} from '../utils/ProductBuilder';
import { ProductState } from '../../../../../src/module/products/core/domain/entity/Product';

const RAIL_PLATFORM_MODELS = [
  {
    id: '14',
    sectorId: 'RAIL',
    name: 'test1',
    description: 'Average of several models',
    defaultValue: {
      description: '2M km / 30 years',
      value: 2000000,
    },
  },
];
const NAVAL_PLATFORM_MODELS = [
  {
    id: '18',
    sectorId: 'NAVAL',
    name: 'test2',
    description: 'Average 2000-6000t class representatives',
    defaultValue: {
      description: '30 years',
      value: 30,
    },
  },
  {
    id: '19',
    sectorId: 'NAVAL',
    name: 'test3',
    description: 'Average 500t class representatives',
    defaultValue: {
      description: '30 years',
      value: 30,
    },
  },
  {
    id: '20',
    sectorId: 'NAVAL',
    name: 'test4',
    description: 'confidential',
    defaultValue: {
      description: '35 years',
      value: 35,
    },
  },
];

const defaultPlatformModels: EmbeddedPlatformModel[] =
  RAIL_PLATFORM_MODELS.concat(NAVAL_PLATFORM_MODELS);

describe('Equipment mobility description', () => {
  test('Default mobility embedded state', () => {
    const productState = productBuilder().build();
    const customProductSlice = getPartialStoreWithState(
      productReducer,
      productState
    );

    expect(customProductSlice.getState().inUseMobility.type).toEqual(
      InUseMobilityType.NONE
    );

    const embeddedPlatformModel =
      customProductSlice.getState().inUseMobility.embedded;
    expect(embeddedPlatformModel).toEqual(
      expect.objectContaining({
        loading: 'idle',
        platformModels: [],
        usage: {
          filteredPlatformModels: [],
          sectorId: DefaultSectorId,
          platformModelId: DefaultEmbeddedPlatformModelId,
          usage: 0,
        },
      })
    );
  });

  test('Load embedded mobility configuration', async () => {
    const productState = newProduct();
    const customProductSlice = getPartialStoreWithState(
      productReducer,
      productState
    );

    await customProductSlice.dispatch(loadMobilityEquipmentConfiguration());

    const embeddedMobility =
      customProductSlice.getState().inUseMobility.embedded;

    expect(embeddedMobility.platformModels.length).toEqual(20);
  });

  test('Select a sector and filter platform models', async () => {
    const loadedProduct: ProductState = productWithLoadedEmbeddedPlatformModels(
      productBuilder().build(),
      defaultPlatformModels
    );

    const customProductSlice = getPartialStoreWithState(
      productReducer,
      loadedProduct
    );

    await customProductSlice.dispatch(
      productSlice.actions.embeddedEquipmentMobilitySectorSelected('NAVAL')
    );

    const embeddedEquipmentMobilityUsage =
      customProductSlice.getState().inUseMobility.embedded.usage;

    expect(embeddedEquipmentMobilityUsage.filteredPlatformModels).toEqual(
      expect.arrayContaining<EmbeddedPlatformModel>([
        expect.objectContaining({ name: 'test2' }),
        expect.objectContaining({ name: 'test3' }),
        expect.objectContaining({ name: 'test4' }),
      ])
    );
  });

  test('Apply default value when selecting a platform model', async () => {
    const loadedProduct: ProductState = productWithLoadedEmbeddedPlatformModels(
      productBuilder().build(),
      defaultPlatformModels
    );

    const platformModelUsage = usageOfEmbeddedPlatformModelBuilder({
      sectorId: 'NAVAL',
      platformModelId: '20',
      usage: 24,
      filteredPlatformModels: NAVAL_PLATFORM_MODELS,
    });

    const productState: ProductState = productWithEmbeddedMobility(
      loadedProduct,
      true,
      platformModelUsage
    );

    const customProductSlice = getPartialStoreWithState(
      productReducer,
      productState
    );

    await customProductSlice.dispatch(
      productSlice.actions.embeddedEquipmentMobilityPlatformModelSelected(
        NAVAL_PLATFORM_MODELS[0].id
      )
    );

    const embeddedEquipmentMobilityUsage =
      customProductSlice.getState().inUseMobility.embedded.usage;

    expect(embeddedEquipmentMobilityUsage.platformModelId).toEqual('18');
    expect(embeddedEquipmentMobilityUsage.usage).toEqual(30);
  });

  test('Reset usage when selecting sector', async () => {
    const loadedProduct: ProductState = productWithLoadedEmbeddedPlatformModels(
      productBuilder().build(),
      defaultPlatformModels
    );

    const platformModelUsage = usageOfEmbeddedPlatformModelBuilder({
      sectorId: 'NAVAL',
      platformModelId: '20',
      usage: 24,
      filteredPlatformModels: NAVAL_PLATFORM_MODELS,
    });

    const productState: ProductState = productWithEmbeddedMobility(
      loadedProduct,
      true,
      platformModelUsage
    );

    const customProductSlice = getPartialStoreWithState(
      productReducer,
      productState
    );

    await customProductSlice.dispatch(
      productSlice.actions.embeddedEquipmentMobilitySectorSelected('RAIL')
    );

    const embeddedMobilityUsage =
      customProductSlice.getState().inUseMobility.embedded.usage;

    expect(embeddedMobilityUsage.sectorId).toEqual('RAIL');
    expect(embeddedMobilityUsage.platformModelId).toEqual(
      DefaultEmbeddedPlatformModelId
    );
    expect(embeddedMobilityUsage.usage).toEqual(0);
    expect(embeddedMobilityUsage.filteredPlatformModels).toEqual(
      expect.arrayContaining<TransportedPlatformModel>([
        expect.objectContaining({ name: 'test1' }),
      ])
    );
  });

  test('Reset usage when selecting no platform model', async () => {
    const loadedProduct: ProductState = productWithLoadedEmbeddedPlatformModels(
      productBuilder().build(),
      defaultPlatformModels
    );

    const platformModelUsage = usageOfEmbeddedPlatformModelBuilder({
      sectorId: 'NAVAL',
      platformModelId: '20',
      usage: 24,
      filteredPlatformModels: NAVAL_PLATFORM_MODELS,
    });

    const productState: ProductState = productWithEmbeddedMobility(
      loadedProduct,
      true,
      platformModelUsage
    );

    const customProductSlice = getPartialStoreWithState(
      productReducer,
      productState
    );

    await customProductSlice.dispatch(
      productSlice.actions.embeddedEquipmentMobilityPlatformModelSelected(
        DefaultEmbeddedPlatformModelId
      )
    );

    const embeddedMobilityUsage =
      customProductSlice.getState().inUseMobility.embedded.usage;

    expect(embeddedMobilityUsage.sectorId).toEqual('NAVAL');
    expect(embeddedMobilityUsage.platformModelId).toEqual(
      DefaultEmbeddedPlatformModelId
    );
    expect(embeddedMobilityUsage.usage).toEqual(0);
  });

  test('Manual usage override', async () => {
    const loadedProduct: ProductState = productWithLoadedEmbeddedPlatformModels(
      productBuilder().build(),
      defaultPlatformModels
    );

    const platformModelUsage = usageOfEmbeddedPlatformModelBuilder({
      sectorId: 'NAVAL',
      platformModelId: '20',
      usage: 24,
      filteredPlatformModels: NAVAL_PLATFORM_MODELS,
    });

    const productState: ProductState = productWithEmbeddedMobility(
      loadedProduct,
      true,
      platformModelUsage
    );

    const customProductSlice = getPartialStoreWithState(
      productReducer,
      productState
    );

    await customProductSlice.dispatch(
      productSlice.actions.embeddedEquipmentMobilityUsageOverridden(10)
    );

    const embeddedMobilityUsage =
      customProductSlice.getState().inUseMobility.embedded.usage;

    expect(embeddedMobilityUsage.sectorId).toEqual('NAVAL');
    expect(embeddedMobilityUsage.platformModelId).toEqual('20');
    expect(embeddedMobilityUsage.usage).toEqual(10);
  });

  test('Do not update Embedded equipment on mobility type update', async () => {
    const productState: ProductState = productWithEmbeddedMobility(
      productBuilder().build(),
      true,
      {
        filteredPlatformModels: [],
        sectorId: 'NAVAL',
        platformModelId: '1',
        usage: 10,
      }
    );

    const customProductSlice = getPartialStoreWithStateWithReducerMapObjects(
      { product: productReducer },
      {
        product: productState,
      }
    );

    await customProductSlice.dispatch(
      productSlice.actions.inUseMobilityTypeUpdated(
        InUseMobilityType.TRANSPORTED
      )
    );

    expect(
      customProductSlice.getState().product.inUseMobility.embedded.usage
    ).toEqual({
      sectorId: 'NAVAL',
      filteredPlatformModels: [],
      platformModelId: '1',
      usage: 10,
    });
  });
});
