import { productBuilder } from './builders/product.builder';
import { getPartialStoreWithStateWithReducerMapObjects } from '../utils/StoreInitializer';
import productReducer, {
  inUseMobilityToggled,
  productSlice,
} from '../../../../../src/module/products/core/domain/product.slice';
import { InUseMobilityType } from '../../../../../src/module/products/core/domain/entity/InUseMobilityType';
import {
  DefaultEmbeddedPlatformModelId,
  DefaultSectorId,
} from '../../../../../src/module/products/core/domain/entity/PlatformModel';

describe('Equipment mobility description', () => {
  describe('In-use mobility section enablement', () => {
    test('In-use mobility section is disabled by default', () => {
      const productState = productBuilder().build();
      const customProductSlice = getPartialStoreWithStateWithReducerMapObjects(
        { product: productReducer },
        {
          product: productState,
        }
      );

      expect(customProductSlice.getState().product.inUseMobility.enabled).toBe(
        false
      );
      expect(customProductSlice.getState().product.inUseMobility.type).toEqual(
        InUseMobilityType.NONE
      );
    });
    test('Enable In-use mobility section', async () => {
      const productState = productBuilder().build();
      const customProductSlice = getPartialStoreWithStateWithReducerMapObjects(
        { product: productReducer },
        {
          product: productState,
        }
      );

      await customProductSlice.dispatch(inUseMobilityToggled());

      expect(customProductSlice.getState().product.inUseMobility.enabled).toBe(
        true
      );
    });
    test('Embedded mobility is selected by default when section is enabled', async () => {
      const productState = productBuilder().build();
      const customProductSlice = getPartialStoreWithStateWithReducerMapObjects(
        { product: productReducer },
        {
          product: productState,
        }
      );

      await customProductSlice.dispatch(inUseMobilityToggled());

      expect(customProductSlice.getState().product.inUseMobility.type).toEqual(
        InUseMobilityType.EMBEDDED
      );
    });
  });
  describe('Mobility type selection', () => {
    test('Default in-use mobility state', () => {
      const productState = productBuilder().build();
      const customProductSlice = getPartialStoreWithStateWithReducerMapObjects(
        { product: productReducer },
        {
          product: productState,
        }
      );

      expect(customProductSlice.getState().product.inUseMobility.type).toEqual(
        InUseMobilityType.NONE
      );

      const embeddedPlatformModel =
        customProductSlice.getState().product.inUseMobility.embedded;
      expect(embeddedPlatformModel).toEqual(
        expect.objectContaining({
          loading: 'idle',
          platformModels: [],
          usage: {
            sectorId: DefaultSectorId,
            filteredPlatformModels: [],
            platformModelId: DefaultEmbeddedPlatformModelId,
            usage: 0,
          },
        })
      );

      const onboardedPlatformModel =
        customProductSlice.getState().product.inUseMobility.transported;
      expect(onboardedPlatformModel).toEqual(
        expect.objectContaining({
          loading: 'idle',
          platformModels: [],
          payloads: [],
        })
      );
    });

    test.each([
      InUseMobilityType.NONE,
      InUseMobilityType.EMBEDDED,
      InUseMobilityType.TRANSPORTED,
    ])('Embedded equipment selection %s', async (type: InUseMobilityType) => {
      const productState = productBuilder().build();
      const customProductSlice = getPartialStoreWithStateWithReducerMapObjects(
        { product: productReducer },
        {
          product: productState,
        }
      );

      await customProductSlice.dispatch(
        productSlice.actions.inUseMobilityTypeUpdated(type)
      );

      expect(customProductSlice.getState().product.inUseMobility.type).toEqual(
        type
      );
    });

    test('Add default onboarded platform model when selecting onboarded mobility mode', async () => {
      const productState = productBuilder().build();
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

      expect(customProductSlice.getState().product.inUseMobility.type).toEqual(
        InUseMobilityType.TRANSPORTED
      );
      const onBoardedMobilityState =
        customProductSlice.getState().product.inUseMobility.transported;

      expect(onBoardedMobilityState.payloads.length).toEqual(1);
    });
  });
});
