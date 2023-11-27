import {
  newProduct,
  productWithElectronicComponent,
  productWithEmbeddedMobility,
  productWithEnergyUsedAtTestLocation,
  productWithMaterial,
  productWithPlatformModelPayload,
} from '../../../products/core/utils/ProductBuilder';
import { mapFromProduct } from '../../../../../src/module/evaluations/core/domain/mappers/EvaluatedProductMapper';
import { ProductState } from '../../../../../src/module/products/core/domain/entity/Product';
import {
  transportedPlatformPayloadBuilder,
  usageOfEmbeddedPlatformModelBuilder,
} from '../../../../../src/module/products/core/domain/product.slice';
import { DefaultMaterialId } from '../../../../../src/module/products/core/domain/entity/Material';
import { InUseMobilityType } from '../../../../../src/module/products/core/domain/entity/InUseMobilityType';
import { DefaultEmbeddedPlatformModelId } from '../../../../../src/module/products/core/domain/entity/PlatformModel';
import { RecyclingType } from '../../../../../src/module/products/core/domain/entity/RecyclingType';
import { massOfMaterialBuilder } from '../../../products/core/domain/builders/massOfMaterial.builder';
import { massOfComponentBuilder } from '../../../products/core/domain/builders/massOfComponent.builder';
import { DefaultElectronicComponentId } from '../../../../../src/module/products/core/domain/entity/ElectronicalComponent';
import { energyUsedAtTestLocationBuilder } from '../../../products/core/domain/builders/energyUsedAtTestLocation.builders';
import { DefaultLocationId } from '../../../../../src/module/products/core/domain/entity/TestLocation';
import { DefaultPowerSourceId } from '../../../../../src/module/products/core/domain/entity/PowerSource';

describe('Evaluated product mapper', () => {
  describe('Hardware manufacturing mapping', () => {
    test('Map hardware mass', () => {
      const product: ProductState = {
        ...newProduct(),
        totalHardwareMass: 10,
      };

      const evaluatedProduct = mapFromProduct(product);

      expect(evaluatedProduct.hardwareMass).toEqual(10);
    });

    test('Ignore incomplete mechanical parts', () => {
      const product: ProductState = productWithMaterial(
        newProduct(),
        massOfMaterialBuilder()
          .withId('id1')
          .withMaterialId(DefaultMaterialId)
          .withMass(4)
          .build(),
        massOfMaterialBuilder()
          .withId('id2')
          .withMaterialId('3')
          .withMass(0)
          .build(),
        massOfMaterialBuilder()
          .withId('id3')
          .withMaterialId('2')
          .withMass(2)
          .build()
      );
      const evaluatedProduct = mapFromProduct(product);

      expect(
        evaluatedProduct.materialMassesBreakdownOfMechanicalParts.value
      ).toEqual([
        {
          materialId: '2',
          mass: 2,
        },
      ]);
    });

    test('Ignore incomplete electrical components', () => {
      const product: ProductState = productWithElectronicComponent(
        newProduct(),
        massOfComponentBuilder()
          .withId('id1')
          .withComponentId(DefaultElectronicComponentId)
          .withMass(4)
          .build(),
        massOfComponentBuilder()
          .withId('id2')
          .withComponentId('3')
          .withMass(0)
          .build(),
        massOfComponentBuilder()
          .withId('id3')
          .withComponentId('4')
          .withMass(2)
          .build()
      );
      const evaluatedProduct = mapFromProduct(product);

      expect(
        evaluatedProduct.componentMassesBreakdownOfElectronics.value
      ).toEqual([
        {
          componentId: '4',
          mass: 2,
        },
      ]);
    });
  });
  describe('Tests & Qualificationualification mapping', () => {
    test('Ignore incomplete energy used at locations', () => {
      const product: ProductState = productWithEnergyUsedAtTestLocation(
        newProduct(),
        true,
        energyUsedAtTestLocationBuilder()
          .withTestLocationId(DefaultLocationId)
          .withEnergyUsed(4)
          .build(),
        energyUsedAtTestLocationBuilder()
          .withTestLocationId('3')
          .withEnergyUsed(0)
          .build(),
        energyUsedAtTestLocationBuilder()
          .withTestLocationId('4')
          .withEnergyUsed(2)
          .build()
      );
      const evaluatedProduct = mapFromProduct(product);

      expect(evaluatedProduct.energyUsedAtTestLocations).toEqual([
        {
          testLocationId: '4',
          energy: 2,
        },
      ]);
    });
    test('Ignore if section is disabled', () => {
      const product: ProductState = productWithEnergyUsedAtTestLocation(
        newProduct(),
        false,
        energyUsedAtTestLocationBuilder()
          .withTestLocationId('4')
          .withEnergyUsed(2)
          .build()
      );
      const evaluatedProduct = mapFromProduct(product);

      expect(evaluatedProduct.energyUsedAtTestLocations).toEqual([]);
    });
  });

  describe('Embedded equipment', () => {
    test('Map embedded equipment only when enabled', () => {
      const product: ProductState = productWithEmbeddedMobility(
        newProduct(),
        true,
        usageOfEmbeddedPlatformModelBuilder({
          sectorId: 'NAVAL',
          filteredPlatformModels: [
            {
              id: '1',
              sectorId: 'AERO',
              name: 'Commercial - short range',
              description: 'Airbus single aisle family',
              defaultValue: {
                description: '100 000h',
                value: 100000,
              },
            },
          ],
          platformModelId: '1',
          usage: 100000,
        })
      );

      const evaluatedProduct = mapFromProduct(product);

      expect(evaluatedProduct.inUseMobility).toEqual({
        type: InUseMobilityType.EMBEDDED,
        embeddedPlatformModel: {
          platformModelId: '1',
          usage: 100000,
          defaultUsage: 100000,
        },
        transportedPlatformModels: [],
      });
    });

    test('Do not map embedded equipment if section is disabled', () => {
      const product: ProductState = productWithEmbeddedMobility(
        newProduct(),
        false,
        usageOfEmbeddedPlatformModelBuilder({
          sectorId: 'NAVAL',
          filteredPlatformModels: [
            {
              id: '1',
              sectorId: 'AERO',
              name: 'Commercial - short range',
              description: 'Airbus single aisle family',
              defaultValue: {
                description: '100 000h',
                value: 100000,
              },
            },
          ],
          platformModelId: '1',
          usage: 100000,
        })
      );

      const evaluatedProduct = mapFromProduct(product);

      expect(evaluatedProduct.inUseMobility).toEqual({
        type: InUseMobilityType.NONE,
        embeddedPlatformModel: {
          platformModelId: DefaultEmbeddedPlatformModelId,
          usage: 0,
          defaultUsage: 0,
        },
        transportedPlatformModels: [],
      });
    });

    test('Do not map embedded equipment when not selected', () => {
      let product: ProductState = productWithEmbeddedMobility(
        newProduct(),
        true,
        usageOfEmbeddedPlatformModelBuilder({
          sectorId: 'NAVAL',
          filteredPlatformModels: [],
          platformModelId: '1',
          usage: 1,
        })
      );

      product = {
        ...product,
        inUseMobility: {
          ...product.inUseMobility,
          type: InUseMobilityType.NONE,
        },
      };

      const evaluatedProduct = mapFromProduct(product);

      expect(evaluatedProduct.inUseMobility).toEqual({
        type: InUseMobilityType.NONE,
        embeddedPlatformModel: {
          platformModelId: DefaultEmbeddedPlatformModelId,
          usage: 0,
          defaultUsage: 0,
        },
        transportedPlatformModels: [],
      });
    });
  });

  describe('Transported equipment', () => {
    test('Map transported equipment only when enabled', () => {
      const product: ProductState = productWithPlatformModelPayload(
        newProduct(),
        true,
        transportedPlatformPayloadBuilder({
          sectorId: 'NAVAL',
          platformModelId: '20',
          payload: 24,
          filteredPlatformModels: [],
        }),

        transportedPlatformPayloadBuilder({
          sectorId: 'RAIL',
          platformModelId: '16',
          payload: 100,
          filteredPlatformModels: [],
        })
      );

      const evaluatedProduct = mapFromProduct(product);

      expect(evaluatedProduct.inUseMobility).toEqual({
        type: InUseMobilityType.TRANSPORTED,
        embeddedPlatformModel: {
          platformModelId: DefaultEmbeddedPlatformModelId,
          usage: 0,
          defaultUsage: 0,
        },
        transportedPlatformModels: [
          {
            platformModelId: '20',
            payload: 24,
          },
          {
            platformModelId: '16',
            payload: 100,
          },
        ],
      });
    });

    test('Do not map transported equipment when section is disabled', () => {
      const product: ProductState = productWithPlatformModelPayload(
        newProduct(),
        false,
        transportedPlatformPayloadBuilder({
          sectorId: 'NAVAL',
          platformModelId: '20',
          payload: 24,
          filteredPlatformModels: [],
        }),

        transportedPlatformPayloadBuilder({
          sectorId: 'RAIL',
          platformModelId: '16',
          payload: 100,
          filteredPlatformModels: [],
        })
      );

      const evaluatedProduct = mapFromProduct(product);

      expect(evaluatedProduct.inUseMobility).toEqual({
        type: InUseMobilityType.NONE,
        embeddedPlatformModel: {
          platformModelId: DefaultEmbeddedPlatformModelId,
          usage: 0,
          defaultUsage: 0,
        },
        transportedPlatformModels: [],
      });
    });

    test('Do not map transported equipment when not selected', () => {
      let product: ProductState = productWithPlatformModelPayload(
        newProduct(),
        true,
        transportedPlatformPayloadBuilder({
          sectorId: 'NAVAL',
          platformModelId: '20',
          payload: 24,
          filteredPlatformModels: [],
        }),

        transportedPlatformPayloadBuilder({
          sectorId: 'RAIL',
          platformModelId: '16',
          payload: 100,
          filteredPlatformModels: [],
        })
      );

      product = {
        ...product,
        inUseMobility: {
          ...product.inUseMobility,
          type: InUseMobilityType.NONE,
        },
      };

      const evaluatedProduct = mapFromProduct(product);

      expect(evaluatedProduct.inUseMobility).toEqual({
        type: InUseMobilityType.NONE,
        embeddedPlatformModel: {
          platformModelId: DefaultEmbeddedPlatformModelId,
          usage: 0,
          defaultUsage: 0,
        },
        transportedPlatformModels: [],
      });
    });
    test('Do not map incomplete transported equipments', () => {
      const product: ProductState = productWithPlatformModelPayload(
        newProduct(),
        true,
        transportedPlatformPayloadBuilder({
          sectorId: '-1',
          platformModelId: '-1',
          payload: 24,
          filteredPlatformModels: [],
        }),

        transportedPlatformPayloadBuilder({
          sectorId: 'RAIL',
          platformModelId: '16',
          payload: 0,
          filteredPlatformModels: [],
        }),
        transportedPlatformPayloadBuilder({
          sectorId: 'RAIL',
          platformModelId: '17',
          payload: 100,
          filteredPlatformModels: [],
        })
      );

      const evaluatedProduct = mapFromProduct(product);

      expect(evaluatedProduct.inUseMobility).toEqual({
        type: InUseMobilityType.TRANSPORTED,
        embeddedPlatformModel: {
          platformModelId: DefaultEmbeddedPlatformModelId,
          usage: 0,
          defaultUsage: 0,
        },
        transportedPlatformModels: [
          {
            platformModelId: '17',
            payload: 100,
          },
        ],
      });
    });
  });

  describe('Power in Use mapping', () => {
    test('Map power consumption when section is enabled', () => {
      const product = {
        ...newProduct(),
        inUsePowerConsumption: {
          enabled: true,
          lifetime: 175200,
          powerSource: '1',
          powerConsumptionBreakdown: {
            enabled: true,
            powerLevels: [],
            shareTotal: 100,
            meanPower: 640,
          },
        },
      };

      const evaluatedProduct = mapFromProduct(product);

      expect(evaluatedProduct.inUsePowerConsumption).toEqual({
        lifetime: 175200,
        powerSource: '1',
        meanPower: 640,
      });
    });

    test('Do not map power consumption when section is enabled', () => {
      const product = {
        ...newProduct(),
        inUsePowerConsumption: {
          enabled: false,
          lifetime: 175200,
          powerSource: '1',
          powerConsumptionBreakdown: {
            enabled: true,
            powerLevels: [],
            shareTotal: 100,
            meanPower: 640,
          },
        },
      };

      const evaluatedProduct = mapFromProduct(product);

      expect(evaluatedProduct.inUsePowerConsumption).toEqual({
        lifetime: 0,
        powerSource: DefaultPowerSourceId,
        meanPower: 0,
      });
    });
  });

  describe('Recycling type', () => {
    test('Map recycling type', () => {
      const product = {
        ...newProduct(),
        recycling: {
          enabled: true,
          type: RecyclingType.TYPE_1,
        },
      };

      const evaluatedProduct = mapFromProduct(product);

      expect(evaluatedProduct.recyclingType).toEqual(RecyclingType.TYPE_1);
    });
    test('Do not map if section is disabled', () => {
      const product = {
        ...newProduct(),
        recycling: {
          enabled: false,
          type: RecyclingType.TYPE_1,
        },
      };

      const evaluatedProduct = mapFromProduct(product);

      expect(evaluatedProduct.recyclingType).toEqual(RecyclingType.NONE);
    });
  });
});
