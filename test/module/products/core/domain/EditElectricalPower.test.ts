import {
  givenANewProduct,
  newProduct,
  productWithPowerLevel,
} from '../utils/ProductBuilder';
import productReducer, {
  inUsePowerConsumptionToggled,
  inUsePowerConsumptionUpdated,
  powerLevelAdded,
  powerLevelBuilder,
  powerLevelRemoved,
  powerLevelShareTotalComputed,
  powerLevelUpdated,
} from '../../../../../src/module/products/core/domain/product.slice';
import { DefaultPowerSourceId } from '../../../../../src/module/products/core/domain/entity/PowerSource';
import { getPartialStoreWithStateWithReducerMapObjects } from '../utils/StoreInitializer';

describe('In-use power consumption', () => {
  describe('In use power consumption section enablement', () => {
    test('In-use power consumption secion disabled by default', () => {
      const context = givenANewProduct();

      expect(context.getState().product.inUsePowerConsumption.enabled).toBe(
        false
      );
    });
    test('Enable in-use power consumption section', async () => {
      const context = givenANewProduct();

      await context.dispatch(inUsePowerConsumptionToggled());

      expect(context.getState().product.inUsePowerConsumption.enabled).toBe(
        true
      );
    });
  });
  describe('General aspects', () => {
    describe('Lifetime', () => {
      test('Default lifetime', () => {
        const context = givenANewProduct();

        expect(
          context.getState().product.inUsePowerConsumption.lifetime
        ).toEqual(175200);
      });

      test('Update lifetime', () => {
        const context = givenANewProduct();

        context.dispatch(
          inUsePowerConsumptionUpdated({
            lifetime: 87600,
            powerSource:
              context.getState().product.inUsePowerConsumption.powerSource,
          })
        );

        expect(
          context.getState().product.inUsePowerConsumption.lifetime
        ).toEqual(87600);
      });
    });
    describe('Power source', () => {
      test('Default power source in state', () => {
        const context = givenANewProduct();

        expect(
          context.getState().product.inUsePowerConsumption.powerSource
        ).toEqual(DefaultPowerSourceId);
      });
      test('Update power source', () => {
        const context = givenANewProduct();

        context.dispatch(
          inUsePowerConsumptionUpdated({
            lifetime: context.getState().product.inUsePowerConsumption.lifetime,
            powerSource: '1',
          })
        );

        expect(
          context.getState().product.inUsePowerConsumption.powerSource
        ).toEqual('1');
      });
    });
  });

  describe('Power consumption breakdown', () => {
    test('Default power levels share state', () => {
      const context = givenANewProduct();

      const { powerConsumptionBreakdown } =
        context.getState().product.inUsePowerConsumption;

      expect(powerConsumptionBreakdown.powerLevels).toHaveLength(0);
      expect(powerConsumptionBreakdown.shareTotal).toEqual(0);
      expect(powerConsumptionBreakdown.meanPower).toEqual(0);
    });

    test('Add a default power level when section enabled if empty', async () => {
      const context = givenANewProduct();

      await context.dispatch(inUsePowerConsumptionToggled());

      const { powerConsumptionBreakdown } =
        context.getState().product.inUsePowerConsumption;

      expect(powerConsumptionBreakdown.powerLevels).toHaveLength(1);
    });

    test('Add a power mode', () => {
      const context = givenANewProduct();

      context.dispatch(powerLevelAdded());

      const { powerConsumptionBreakdown } =
        context.getState().product.inUsePowerConsumption;

      expect(powerConsumptionBreakdown.powerLevels).toHaveLength(1);
      expect(powerConsumptionBreakdown.powerLevels[0].id).toBeDefined();
      expect(powerConsumptionBreakdown.powerLevels[0].power).toEqual(0);
      expect(powerConsumptionBreakdown.powerLevels[0].share).toEqual(0);
    });

    test('Remove a power level', () => {
      const powerLevel1 = powerLevelBuilder({ power: 20, share: 50 });
      const powerLevel2 = powerLevelBuilder({ power: 60, share: 50 });
      const product = productWithPowerLevel(
        newProduct(),
        powerLevel1,
        powerLevel2
      );

      const customProductSlice = getPartialStoreWithStateWithReducerMapObjects(
        { product: productReducer },
        { product }
      );

      customProductSlice.dispatch(powerLevelRemoved(powerLevel1.id));

      const { powerConsumptionBreakdown } =
        customProductSlice.getState().product.inUsePowerConsumption;

      expect(powerConsumptionBreakdown.powerLevels).toHaveLength(1);
      expect(powerConsumptionBreakdown.powerLevels[0].id).toEqual(
        powerLevel2.id
      );
    });

    test('Update a power mode', () => {
      const powerLevel1 = powerLevelBuilder({ power: 20, share: 50 });
      const powerLevel2 = powerLevelBuilder({ power: 60, share: 50 });
      const product = productWithPowerLevel(
        newProduct(),
        powerLevel1,
        powerLevel2
      );

      const customProductSlice = getPartialStoreWithStateWithReducerMapObjects(
        { product: productReducer },
        { product }
      );

      customProductSlice.dispatch(
        powerLevelUpdated({
          id: powerLevel1.id,
          power: 30,
          share: 60,
        })
      );

      const { powerConsumptionBreakdown } =
        customProductSlice.getState().product.inUsePowerConsumption;

      expect(powerConsumptionBreakdown.powerLevels).toHaveLength(2);

      expect(powerConsumptionBreakdown.powerLevels[0].id).toEqual(
        powerLevel1.id
      );

      expect(powerConsumptionBreakdown.powerLevels[0].power).toEqual(30);
      expect(powerConsumptionBreakdown.powerLevels[0].share).toEqual(60);

      expect(powerConsumptionBreakdown.powerLevels[1].power).toEqual(60);
      expect(powerConsumptionBreakdown.powerLevels[1].share).toEqual(50);
    });

    test('Compute total share', () => {
      const powerLevel1 = powerLevelBuilder({ power: 20, share: 50 });
      const powerLevel2 = powerLevelBuilder({ power: 60, share: 50 });
      const product = productWithPowerLevel(
        newProduct(),
        powerLevel1,
        powerLevel2
      );

      const customProductSlice = getPartialStoreWithStateWithReducerMapObjects(
        { product: productReducer },
        { product }
      );

      customProductSlice.dispatch(powerLevelShareTotalComputed());

      const { powerConsumptionBreakdown } =
        customProductSlice.getState().product.inUsePowerConsumption;

      expect(powerConsumptionBreakdown.shareTotal).toEqual(100);
    });

    test('Compute total share when power level updated', () => {
      const powerLevel1 = powerLevelBuilder({ power: 20, share: 40 });
      const powerLevel2 = powerLevelBuilder({ power: 60, share: 60 });
      const product = productWithPowerLevel(
        newProduct(),
        powerLevel1,
        powerLevel2
      );

      const customProductSlice = getPartialStoreWithStateWithReducerMapObjects(
        { product: productReducer },
        { product }
      );

      customProductSlice.dispatch(
        powerLevelUpdated({
          id: powerLevel1.id,
          power: 20,
          share: 60,
        })
      );

      const { powerConsumptionBreakdown } =
        customProductSlice.getState().product.inUsePowerConsumption;

      expect(powerConsumptionBreakdown.shareTotal).toEqual(120);
    });

    test('Compute total share when power level removed', () => {
      const powerLevel1 = powerLevelBuilder({ power: 20, share: 70 });
      const powerLevel2 = powerLevelBuilder({ power: 60, share: 30 });
      const product = productWithPowerLevel(
        newProduct(),
        powerLevel1,
        powerLevel2
      );

      const customProductSlice = getPartialStoreWithStateWithReducerMapObjects(
        { product: productReducer },
        { product }
      );

      customProductSlice.dispatch(powerLevelRemoved(powerLevel1.id));

      const { powerConsumptionBreakdown } =
        customProductSlice.getState().product.inUsePowerConsumption;

      expect(powerConsumptionBreakdown.shareTotal).toEqual(30);
    });
    test('Compute mean power', () => {
      const powerLevel1 = powerLevelBuilder({ power: 20, share: 50 });
      const powerLevel2 = powerLevelBuilder({ power: 60, share: 50 });
      const product = productWithPowerLevel(
        newProduct(),
        powerLevel1,
        powerLevel2
      );

      const customProductSlice = getPartialStoreWithStateWithReducerMapObjects(
        { product: productReducer },
        { product }
      );

      customProductSlice.dispatch(powerLevelShareTotalComputed());

      const { powerConsumptionBreakdown } =
        customProductSlice.getState().product.inUsePowerConsumption;

      expect(powerConsumptionBreakdown.meanPower).toEqual(40);
    });

    test('Compute mean power when power level updated', () => {
      const powerLevel1 = powerLevelBuilder({ power: 20, share: 40 });
      const powerLevel2 = powerLevelBuilder({ power: 60, share: 60 });
      const product = productWithPowerLevel(
        newProduct(),
        powerLevel1,
        powerLevel2
      );

      const customProductSlice = getPartialStoreWithStateWithReducerMapObjects(
        { product: productReducer },
        { product }
      );

      customProductSlice.dispatch(
        powerLevelUpdated({
          id: powerLevel1.id,
          power: 40,
          share: 40,
        })
      );

      const { powerConsumptionBreakdown } =
        customProductSlice.getState().product.inUsePowerConsumption;

      expect(powerConsumptionBreakdown.meanPower).toEqual(52);
    });

    test('Compute mean power when power level removed', () => {
      const powerLevel1 = powerLevelBuilder({ power: 20, share: 70 });
      const powerLevel2 = powerLevelBuilder({ power: 60, share: 30 });
      const product = productWithPowerLevel(
        newProduct(),
        powerLevel1,
        powerLevel2
      );

      const customProductSlice = getPartialStoreWithStateWithReducerMapObjects(
        { product: productReducer },
        { product }
      );

      customProductSlice.dispatch(powerLevelRemoved(powerLevel1.id));

      const { powerConsumptionBreakdown } =
        customProductSlice.getState().product.inUsePowerConsumption;

      expect(powerConsumptionBreakdown.meanPower).toEqual(60);
    });
  });
});
