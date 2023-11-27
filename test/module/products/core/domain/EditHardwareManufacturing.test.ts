import productReducer, {
  addMassOfElectronicComponent,
  addMassOfMaterial,
  energyUsedAtTestLocationAdded,
  productSlice,
  testsAndQualificationsToggled,
} from '../../../../../src/module/products/core/domain/product.slice';
import {
  EnergyUsedAtTestLocation,
  MassOfElectronicComponent,
  ProductState,
} from '../../../../../src/module/products/core/domain/entity/Product';
import { DefaultMaterialId } from '../../../../../src/module/products/core/domain/entity/Material';
import { DefaultElectronicComponentId } from '../../../../../src/module/products/core/domain/entity/ElectronicalComponent';
import {
  productWithElectronicComponent,
  productWithEnergyUsedAtTestLocation,
  productWithMaterial,
} from '../utils/ProductBuilder';
import { getPartialStoreWithState } from '../utils/StoreInitializer';
import { DefaultLocationId } from '../../../../../src/module/products/core/domain/entity/TestLocation';
import { productBuilder } from './builders/product.builder';
import { massOfMaterialBuilder } from './builders/massOfMaterial.builder';
import { MassOfMaterialState } from '../../../../../src/module/products/core/domain/entity/mass-of-material/MassOfMaterial';
import { massOfComponentBuilder } from './builders/massOfComponent.builder';
import { energyUsedAtTestLocationBuilder } from './builders/energyUsedAtTestLocation.builders';

describe('Hardware manufacturing description', () => {
  describe('Edit material mass breakdown of mechanical parts', () => {
    test('Add a material', async () => {
      const productState: ProductState = productBuilder().build();

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(addMassOfMaterial());

      expect(
        customProductSlice.getState().materialMassesBreakdownOfMechanicalParts
          .value.length
      ).toEqual(2);

      const newMassOfMaterial =
        customProductSlice.getState().materialMassesBreakdownOfMechanicalParts
          .value[0];
      expect(newMassOfMaterial.id).toBeDefined();

      expect(newMassOfMaterial).toEqual(
        expect.objectContaining({
          materialId: DefaultMaterialId,
          mass: 0,
        })
      );
    });

    test('Update the selected material breakdown', async () => {
      const productState: ProductState = productWithMaterial(
        productBuilder().build(),
        massOfMaterialBuilder()
          .withId('id1')
          .withMaterialId('1')
          .withMass(4)
          .build(),
        massOfMaterialBuilder()
          .withId('id2')
          .withMaterialId('3')
          .withMass(2)
          .build()
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.updateMassOfMaterial({
          id: 'id1',
          materialId: '1',
          mass: 1,
        })
      );

      expect(
        customProductSlice.getState().materialMassesBreakdownOfMechanicalParts
          .value
      ).toStrictEqual<MassOfMaterialState[]>([
        {
          id: 'id1',
          materialId: '1',
          mass: 1,
        },
        {
          id: 'id2',
          materialId: '3',
          mass: 2,
        },
      ]);
    });

    test('Remove a material', async () => {
      const productState: ProductState = productWithMaterial(
        productBuilder().build(),
        massOfMaterialBuilder()
          .withId('id1')
          .withMaterialId('1')
          .withMass(2)
          .build(),
        massOfMaterialBuilder()
          .withId('id2')
          .withMaterialId('2')
          .withMass(3)
          .build()
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.removeMassOfMaterial('id2')
      );

      expect(
        customProductSlice.getState().materialMassesBreakdownOfMechanicalParts
          .value.length
      ).toEqual(1);

      expect(
        customProductSlice.getState().materialMassesBreakdownOfMechanicalParts
          .value
      ).toContainEqual<MassOfMaterialState>({
        id: 'id1',
        materialId: '1',
        mass: 2,
      });
    });

    test('Do not include mass without defined material in total', async () => {
      const productState: ProductState = productWithMaterial(
        productBuilder().build(),
        massOfMaterialBuilder()
          .withId('id1')
          .withMaterialId('-1')
          .withMass(1)
          .build()
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.updateMassOfMaterial({
          id: 'id1',
          materialId: '-1',
          mass: 4,
        })
      );

      expect(
        customProductSlice.getState().materialMassesBreakdownOfMechanicalParts
          .total
      ).toEqual(0);
    });

    test('Compute the total mass of mechanical parts when updating a mechanical part', async () => {
      const productState: ProductState = productWithMaterial(
        productBuilder().build(),
        massOfMaterialBuilder()
          .withId('id1')
          .withMaterialId('-1')
          .withMass(1)
          .build()
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.updateMassOfMaterial({
          id: 'id1',
          materialId: '1',
          mass: 1,
        })
      );

      expect(
        customProductSlice.getState().materialMassesBreakdownOfMechanicalParts
          .total
      ).toEqual(1);
    });

    test('Compute total when removing a mechanical part', async () => {
      const productState: ProductState = productWithMaterial(
        productBuilder().build(),
        massOfMaterialBuilder()
          .withId('id1')
          .withMaterialId('1')
          .withMass(2)
          .build(),
        massOfMaterialBuilder()
          .withId('id2')
          .withMaterialId('2')
          .withMass(3)
          .build()
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.removeMassOfMaterial('id2')
      );

      expect(
        customProductSlice.getState().materialMassesBreakdownOfMechanicalParts
          .total
      ).toEqual(2);
    });
  });

  describe('Edit component mass breakdown of electronics', () => {
    test('Add a component', async () => {
      const productState: ProductState = productBuilder().build();

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(addMassOfElectronicComponent());

      expect(
        customProductSlice.getState().componentMassesBreakdownOfElectronics
          .value.length
      ).toEqual(2);

      const newMassOfComponent =
        customProductSlice.getState().componentMassesBreakdownOfElectronics
          .value[0];
      expect(newMassOfComponent.id).toBeDefined();

      expect(newMassOfComponent).toEqual(
        expect.objectContaining({
          componentId: DefaultElectronicComponentId,
          mass: 0,
        })
      );
    });

    test('Update the selected electronic component breakdown', async () => {
      const productState: ProductState = productWithElectronicComponent(
        productBuilder().build(),
        massOfComponentBuilder()
          .withId('id1')
          .withComponentId('1')
          .withMass(4)
          .build(),
        massOfComponentBuilder()
          .withId('id2')
          .withComponentId('3')
          .withMass(2)
          .build()
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.updateMassOfElectronicComponent({
          id: 'id1',
          componentId: '1',
          mass: 1,
        })
      );

      expect(
        customProductSlice.getState().componentMassesBreakdownOfElectronics
          .value
      ).toStrictEqual<MassOfElectronicComponent[]>([
        {
          id: 'id1',
          componentId: '1',
          mass: 1,
        },
        {
          id: massOfComponentBuilder()
            .withId('id2')
            .withComponentId('3')
            .withMass(2)
            .build().id,
          componentId: '3',
          mass: 2,
        },
      ]);
    });

    test('Remove an electronic component', async () => {
      const productState: ProductState = productWithElectronicComponent(
        productBuilder().build(),
        massOfComponentBuilder()
          .withId('id1')
          .withComponentId('1')
          .withMass(2)
          .build(),
        massOfComponentBuilder()
          .withId('id2')
          .withComponentId('2')
          .withMass(3)
          .build()
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.removeMassOfElectronicComponent('id2')
      );

      expect(
        customProductSlice.getState().componentMassesBreakdownOfElectronics
          .value.length
      ).toEqual(1);

      expect(
        customProductSlice.getState().componentMassesBreakdownOfElectronics
          .value
      ).toContainEqual<MassOfElectronicComponent>({
        id: 'id1',
        componentId: '1',
        mass: 2,
      });
    });

    test('Do not include mass without defined component in total', async () => {
      const productState: ProductState = productWithElectronicComponent(
        productBuilder().build(),
        massOfComponentBuilder()
          .withId('id1')
          .withComponentId(DefaultElectronicComponentId)
          .withMass(1)
          .build()
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.updateMassOfElectronicComponent({
          id: 'id1',
          componentId: DefaultElectronicComponentId,
          mass: 4,
        })
      );

      expect(
        customProductSlice.getState().materialMassesBreakdownOfMechanicalParts
          .total
      ).toEqual(0);
    });

    test('Compute the total mass of mechanical parts when updating a mechanical part', async () => {
      const productState: ProductState = productWithElectronicComponent(
        productBuilder().build(),
        massOfComponentBuilder()
          .withId('id1')
          .withComponentId(DefaultElectronicComponentId)
          .withMass(1)
          .build()
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.updateMassOfElectronicComponent({
          id: 'id1',
          componentId: '1',
          mass: 2,
        })
      );

      expect(
        customProductSlice.getState().componentMassesBreakdownOfElectronics
          .total
      ).toEqual(2);
    });

    test('Compute total when removing a mechanical part', async () => {
      const productState: ProductState = productWithElectronicComponent(
        productBuilder().build(),
        massOfComponentBuilder()
          .withId('id1')
          .withComponentId('1')
          .withMass(2)
          .build(),
        massOfComponentBuilder()
          .withId('id2')
          .withComponentId('2')
          .withMass(3)
          .build()
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.removeMassOfElectronicComponent('id2')
      );

      expect(
        customProductSlice.getState().componentMassesBreakdownOfElectronics
          .total
      ).toEqual(2);
    });
  });

  describe('Total mass of Hardware', () => {
    test('Compute hardware total mass', async () => {
      const productState = productBuilder().build();
      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.updateMassOfMaterial({
          id: productState.materialMassesBreakdownOfMechanicalParts.value[0].id,
          materialId: '1',
          mass: 1,
        })
      );

      await customProductSlice.dispatch(
        productSlice.actions.updateMassOfElectronicComponent({
          id: productState.componentMassesBreakdownOfElectronics.value[0].id,
          componentId: '1',
          mass: 1,
        })
      );

      expect(customProductSlice.getState().totalHardwareMass).toEqual(2);
    });
  });

  describe('Edit energy used during tests & qualification', () => {
    test('Tests & Qualificationualification section should be disabled by default', async () => {
      const productState: ProductState = productBuilder().build();

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      expect(
        customProductSlice.getState().energyUsedAtTestLocations.enabled
      ).toBe(false);

      expect(
        customProductSlice.getState().energyUsedAtTestLocations.testLocations
          .length
      ).toEqual(1);
    });
    test('Enable Tests & Qualificationualification section', async () => {
      const productState: ProductState = productBuilder().build();

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(testsAndQualificationsToggled());

      expect(
        customProductSlice.getState().energyUsedAtTestLocations.enabled
      ).toBe(true);
      expect(
        customProductSlice.getState().energyUsedAtTestLocations.testLocations
          .length
      ).toEqual(1);
    });
    test('Add a location', async () => {
      const productState: ProductState = productBuilder().build();

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(energyUsedAtTestLocationAdded());

      expect(
        customProductSlice.getState().energyUsedAtTestLocations.testLocations
          .length
      ).toEqual(2);

      const energyUsedAtTestLocation =
        customProductSlice.getState().energyUsedAtTestLocations
          .testLocations[0];
      expect(energyUsedAtTestLocation.id).toBeDefined();

      expect(energyUsedAtTestLocation).toEqual(
        expect.objectContaining({
          testLocationId: DefaultLocationId,
          energy: 0,
        })
      );
    });

    test('Update the selected location', async () => {
      const productState: ProductState = productWithEnergyUsedAtTestLocation(
        productBuilder().build(),
        true,
        energyUsedAtTestLocationBuilder()
          .withId('id1')
          .withTestLocationId('1')
          .withEnergyUsed(2)
          .build(),
        energyUsedAtTestLocationBuilder()
          .withId('id2')
          .withTestLocationId('2')
          .withEnergyUsed(3)
          .build()
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.energyUsedAtTestLocationUpdated({
          id: 'id2',
          testLocationId: '3',
          energy: 4,
        })
      );

      expect(
        customProductSlice.getState().energyUsedAtTestLocations.testLocations
      ).toStrictEqual<EnergyUsedAtTestLocation[]>([
        {
          id: 'id1',
          testLocationId: '1',
          energy: 2,
        },
        {
          id: 'id2',
          testLocationId: '3',
          energy: 4,
        },
      ]);
    });

    test('Remove a location', async () => {
      const productState: ProductState = productWithEnergyUsedAtTestLocation(
        productBuilder().build(),
        true,
        energyUsedAtTestLocationBuilder()
          .withId('id1')
          .withTestLocationId('1')
          .withEnergyUsed(2)
          .build(),
        energyUsedAtTestLocationBuilder()
          .withId('id2')
          .withTestLocationId('2')
          .withEnergyUsed(3)
          .build()
      );

      const customProductSlice = getPartialStoreWithState(
        productReducer,
        productState
      );

      await customProductSlice.dispatch(
        productSlice.actions.energyUsedAtTestLocationRemoved(
          energyUsedAtTestLocationBuilder()
            .withId('id1')
            .withTestLocationId('1')
            .withEnergyUsed(2)
            .build().id
        )
      );

      expect(
        customProductSlice.getState().energyUsedAtTestLocations.testLocations
          .length
      ).toEqual(1);

      expect(
        customProductSlice.getState().energyUsedAtTestLocations.testLocations
      ).toContainEqual<EnergyUsedAtTestLocation>({
        id: 'id2',
        testLocationId: '2',
        energy: 3,
      });
    });
  });
});
