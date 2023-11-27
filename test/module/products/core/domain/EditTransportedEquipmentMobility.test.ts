import productReducer, {
  transportedEquipmentPayloadAdded,
  emptyTransportedPlatformPayload,
  loadMobilityEquipmentConfiguration,
  productSlice,
  transportedPlatformPayloadBuilder,
} from '../../../../../src/module/products/core/domain/product.slice';
import {
  newProduct,
  productWithLoadedTransportedPlatformModels,
  productWithPlatformModelPayload,
} from '../utils/ProductBuilder';
import {
  PlatformModelPayload,
  ProductState,
} from '../../../../../src/module/products/core/domain/entity/Product';
import {
  DefaultSectorId,
  DefaultTransportedPlatformModelId,
  TransportedPlatformModel,
} from '../../../../../src/module/products/core/domain/entity/PlatformModel';
import { getPartialStoreWithState } from '../utils/StoreInitializer';

const RAIL_PLATFORM_MODELS = [
  {
    id: '16',
    sector: 'RAIL',
    name: 'test1',
    description: 'Average of several models',
    defaultValue: {
      description: '100km rolling',
      value: 100,
    },
  },
];
const NAVAL_PLATFORM_MODELS = [
  {
    id: '20',
    sector: 'NAVAL',
    name: 'test2',
    description: 'Average 4000-6000t class representatives',
    defaultValue: {
      description: '24h boating',
      value: 24,
    },
  },
  {
    id: '21',
    sector: 'NAVAL',
    name: 'test3',
    description: 'Average 2000t class representatives',
    defaultValue: {
      description: '12h boating',
      value: 12,
    },
  },
  {
    id: '22',
    sector: 'NAVAL',
    name: 'test4',
    description: 'Average 500t class representatives',
    defaultValue: {
      description: '24h boating',
      value: 24,
    },
  },
];

const defaultPlatformModels: TransportedPlatformModel[] =
  RAIL_PLATFORM_MODELS.concat(NAVAL_PLATFORM_MODELS);

describe('Transported mobility description', () => {
  describe('Transported mobility configuration', () => {
    test('Default mobility transportation state', () => {
      const productState = newProduct();
      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      const transportedMobility =
        customProductSlice.getState().inUseMobility.transported;

      expect(transportedMobility).toEqual({
        loading: 'idle',
        platformModels: [],
        payloads: [],
      });
    });

    test('Load transported mobility configuration', async () => {
      const productState = newProduct();
      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(loadMobilityEquipmentConfiguration());

      const transportedMobility =
        customProductSlice.getState().inUseMobility.transported;

      expect(transportedMobility.platformModels.length).toEqual(22);
    });

    test('Add a platform model payload', async () => {
      const productState: ProductState = newProduct();

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(transportedEquipmentPayloadAdded());

      const transportedMobility =
        customProductSlice.getState().inUseMobility.transported;

      expect(transportedMobility.payloads.length).toEqual(1);

      const platformModelPayload = transportedMobility.payloads[0];
      expect(platformModelPayload.id).toBeDefined();

      expect(platformModelPayload).toEqual(
        expect.objectContaining({
          sectorId: DefaultSectorId,
          platformModelId: DefaultTransportedPlatformModelId,
          payload: 0,
        })
      );
    });

    test('Select a sector and filter platform models', async () => {
      const platformModelPayload = emptyTransportedPlatformPayload();

      const loadedProduct: ProductState =
        productWithLoadedTransportedPlatformModels(
          newProduct(),
          defaultPlatformModels
        );

      const productState: ProductState = productWithPlatformModelPayload(
        loadedProduct,
        true,
        platformModelPayload
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.platformModelPayloadSectorSelected({
          sectorId: 'NAVAL',
          platformModelPayloadId: platformModelPayload.id,
        })
      );

      const transportedMobility =
        customProductSlice.getState().inUseMobility.transported;

      const newPlatformModelPayload = transportedMobility.payloads[0];

      expect(newPlatformModelPayload.filteredPlatformModels).toEqual(
        expect.arrayContaining<TransportedPlatformModel>([
          expect.objectContaining({ name: 'test3' }),
          expect.objectContaining({ name: 'test2' }),
          expect.objectContaining({ name: 'test4' }),
        ])
      );
    });

    test('Apply default value when selecting a platform model payload', async () => {
      const loadedProduct: ProductState =
        productWithLoadedTransportedPlatformModels(
          newProduct(),
          defaultPlatformModels
        );

      const platformModelPayload = transportedPlatformPayloadBuilder({
        sectorId: 'NAVAL',
        platformModelId: '20',
        payload: 24,
        filteredPlatformModels: NAVAL_PLATFORM_MODELS,
      });

      const productState: ProductState = productWithPlatformModelPayload(
        loadedProduct,
        true,
        platformModelPayload
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.platformModelForPayloadSelected({
          platformModelPayloadId: platformModelPayload.id,
          platformModelId: '21',
        })
      );

      const transportedMobility =
        customProductSlice.getState().inUseMobility.transported;

      const updatedPlatformModelPayload = transportedMobility.payloads[0];

      expect(updatedPlatformModelPayload.platformModelId).toEqual('21');
      expect(updatedPlatformModelPayload.payload).toEqual(12);
    });

    test('Reset payload when selecting sector', async () => {
      const loadedProduct: ProductState =
        productWithLoadedTransportedPlatformModels(
          newProduct(),
          defaultPlatformModels
        );

      const platformModelPayload = transportedPlatformPayloadBuilder({
        sectorId: 'NAVAL',
        platformModelId: '20',
        payload: 24,
        filteredPlatformModels: NAVAL_PLATFORM_MODELS,
      });

      const productState: ProductState = productWithPlatformModelPayload(
        loadedProduct,
        true,
        platformModelPayload
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.platformModelPayloadSectorSelected({
          platformModelPayloadId: platformModelPayload.id,
          sectorId: 'RAIL',
        })
      );

      const transportedMobility =
        customProductSlice.getState().inUseMobility.transported;

      const updatedPlatformModelPayload = transportedMobility.payloads[0];

      expect(updatedPlatformModelPayload.sectorId).toEqual('RAIL');
      expect(updatedPlatformModelPayload.platformModelId).toEqual(
        DefaultTransportedPlatformModelId
      );
      expect(updatedPlatformModelPayload.payload).toEqual(0);
      expect(updatedPlatformModelPayload.filteredPlatformModels).toEqual(
        expect.arrayContaining<TransportedPlatformModel>([
          expect.objectContaining({ name: 'test1' }),
        ])
      );
    });

    test('Reset payload when selecting no platform model', async () => {
      const loadedProduct: ProductState =
        productWithLoadedTransportedPlatformModels(
          newProduct(),
          defaultPlatformModels
        );

      const platformModelPayload = transportedPlatformPayloadBuilder({
        sectorId: 'NAVAL',
        platformModelId: '20',
        payload: 24,
        filteredPlatformModels: NAVAL_PLATFORM_MODELS,
      });

      const productState: ProductState = productWithPlatformModelPayload(
        loadedProduct,
        true,
        platformModelPayload
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.platformModelForPayloadSelected({
          platformModelPayloadId: platformModelPayload.id,
          platformModelId: DefaultTransportedPlatformModelId,
        })
      );

      const transportedMobility =
        customProductSlice.getState().inUseMobility.transported;

      const updatedPlatformModelPayload = transportedMobility.payloads[0];

      expect(updatedPlatformModelPayload.sectorId).toEqual('NAVAL');
      expect(updatedPlatformModelPayload.platformModelId).toEqual(
        DefaultTransportedPlatformModelId
      );
      expect(updatedPlatformModelPayload.payload).toEqual(0);
    });

    test('Manual payload override', async () => {
      const loadedProduct: ProductState =
        productWithLoadedTransportedPlatformModels(
          newProduct(),
          defaultPlatformModels
        );

      const platformModelPayload = transportedPlatformPayloadBuilder({
        sectorId: 'NAVAL',
        platformModelId: '20',
        payload: 24,
        filteredPlatformModels: NAVAL_PLATFORM_MODELS,
      });

      const productState: ProductState = productWithPlatformModelPayload(
        loadedProduct,
        true,
        platformModelPayload
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.platformModelPayloadOverridden({
          platformModelPayloadId: platformModelPayload.id,
          payload: 48,
        })
      );

      const transportedMobility =
        customProductSlice.getState().inUseMobility.transported;

      const updatedPlatformModelPayload = transportedMobility.payloads[0];
      expect(updatedPlatformModelPayload.payload).toEqual(48);
    });

    test('Remove platform model payload', async () => {
      const loadedProduct: ProductState =
        productWithLoadedTransportedPlatformModels(
          newProduct(),
          defaultPlatformModels
        );

      const platformModelPayload = transportedPlatformPayloadBuilder({
        sectorId: 'NAVAL',
        platformModelId: '20',
        payload: 24,
        filteredPlatformModels: NAVAL_PLATFORM_MODELS,
      });

      const platformModelPayload2 = transportedPlatformPayloadBuilder({
        sectorId: 'RAIL',
        platformModelId: '16',
        payload: 100,
        filteredPlatformModels: RAIL_PLATFORM_MODELS,
      });

      const productState: ProductState = productWithPlatformModelPayload(
        loadedProduct,
        true,
        platformModelPayload,
        platformModelPayload2
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.platformModelPayloadRemoved(
          platformModelPayload.id
        )
      );

      const transportedMobility =
        customProductSlice.getState().inUseMobility.transported;

      expect(transportedMobility.payloads.length).toEqual(1);
      expect(transportedMobility.payloads).toEqual(
        expect.arrayContaining<PlatformModelPayload>([
          expect.objectContaining({ sectorId: 'RAIL' }),
        ])
      );
    });
  });
});
