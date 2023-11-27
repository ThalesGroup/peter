import productReducer, {
  NEW_PRODUCT,
  transportedPlatformPayloadBuilder,
} from '../../../../../src/module/products/core/domain/product.slice';
import {
  EnergyUsedAtTestLocation,
  MassOfElectronicComponent,
  PlatformModelPayload,
  ProductState,
  UsageOfEmbeddedPlatformModel,
} from '../../../../../src/module/products/core/domain/entity/Product';
import { InUseMobilityType } from '../../../../../src/module/products/core/domain/entity/InUseMobilityType';
import {
  EmbeddedPlatformModel,
  TransportedPlatformModel,
} from '../../../../../src/module/products/core/domain/entity/PlatformModel';
import { PowerLevel } from '../../../../../src/module/products/core/domain/entity/PowerLevel';
import { getPartialStoreWithStateWithReducerMapObjects } from './StoreInitializer';
import evaluationVersionsReducer from '../../../../../src/module/evaluations/core/domain/evaluationVersions.slice';
import { RecyclingType } from '../../../../../src/module/products/core/domain/entity/RecyclingType';
import { massOfMaterialBuilder } from '../domain/builders/massOfMaterial.builder';
import { MassOfMaterialState } from '../../../../../src/module/products/core/domain/entity/mass-of-material/MassOfMaterial';
import { massOfComponentBuilder } from '../domain/builders/massOfComponent.builder';
import { storeBuilder } from '../../../../builders/store.builder';

const initialState = NEW_PRODUCT;

const givenAnEmptyStore = () => {
  return storeBuilder().build();
};

const newProduct = (): ProductState => {
  return { ...initialState, name: 'Product under test' };
};

const productWithMaterial = (
  product: ProductState,
  ...massesOfMaterial: MassOfMaterialState[]
): ProductState => {
  return {
    ...product,
    materialMassesBreakdownOfMechanicalParts: {
      ...product.materialMassesBreakdownOfMechanicalParts,
      value: massesOfMaterial,
    },
  };
};

const productWithElectronicComponent = (
  product: ProductState,
  ...massesOfElectronicComponents: MassOfElectronicComponent[]
): ProductState => {
  return {
    ...product,
    componentMassesBreakdownOfElectronics: {
      ...product.componentMassesBreakdownOfElectronics,
      value: massesOfElectronicComponents,
    },
  };
};

const productWithEnergyUsedAtTestLocation = (
  product: ProductState,
  sectionEnabled: boolean,
  ...energyUsedAtTestLocations: EnergyUsedAtTestLocation[]
): ProductState => {
  return {
    ...product,
    energyUsedAtTestLocations: {
      enabled: sectionEnabled,
      testLocations: energyUsedAtTestLocations,
    },
  };
};

const productWithEmbeddedMobility = (
  product: ProductState,
  sectionEnabled: boolean,
  usageOfEmbeddedPlatformModel: UsageOfEmbeddedPlatformModel
): ProductState => {
  return {
    ...product,
    inUseMobility: {
      enabled: sectionEnabled,
      type: InUseMobilityType.EMBEDDED,
      embedded: {
        ...product.inUseMobility.embedded,
        usage: usageOfEmbeddedPlatformModel,
      },
      transported: product.inUseMobility.transported,
    },
  };
};

const productWithLoadedEmbeddedPlatformModels = (
  product: ProductState,
  platformModels: EmbeddedPlatformModel[]
): ProductState => {
  return {
    ...product,
    inUseMobility: {
      ...product.inUseMobility,
      embedded: {
        ...product.inUseMobility.embedded,
        platformModels,
      },
    },
  };
};
const productWithLoadedTransportedPlatformModels = (
  product: ProductState,
  platformModels: TransportedPlatformModel[]
): ProductState => {
  return {
    ...product,
    inUseMobility: {
      ...product.inUseMobility,
      transported: {
        ...product.inUseMobility.transported,
        platformModels,
      },
    },
  };
};

const productWithPlatformModelPayload = (
  product: ProductState,
  sectionEnabled: boolean,
  ...platformModelPayload: PlatformModelPayload[]
): ProductState => {
  return {
    ...product,
    inUseMobility: {
      ...product.inUseMobility,
      enabled: sectionEnabled,
      type: InUseMobilityType.TRANSPORTED,
      transported: {
        ...product.inUseMobility.transported,
        payloads: platformModelPayload,
      },
    },
  };
};

const productWithPowerLevel = (
  product: ProductState,
  ...powerLevels: PowerLevel[]
): ProductState => {
  return {
    ...product,
    inUsePowerConsumption: {
      ...product.inUsePowerConsumption,
      powerConsumptionBreakdown: {
        ...product.inUsePowerConsumption.powerConsumptionBreakdown,
        powerLevels,
      },
    },
  };
};

const givenANewProduct = () => {
  const reducerMapObjects = {
    product: productReducer,
    evaluationVersions: evaluationVersionsReducer,
  };

  return getPartialStoreWithStateWithReducerMapObjects(reducerMapObjects, {
    product: newProduct(),
  });
};

const aStandardProduct = (
  mobilityType: InUseMobilityType = InUseMobilityType.EMBEDDED
) => {
  let standardProduct: ProductState = productWithMaterial(
    newProduct(),
    massOfMaterialBuilder().withMaterialId('1').withMass(4).build(),
    massOfMaterialBuilder().withMaterialId('3').withMass(2).build()
  );

  standardProduct = productWithElectronicComponent(
    standardProduct,
    massOfComponentBuilder().withComponentId('1').withMass(4).build(),
    massOfComponentBuilder().withComponentId('2').withMass(2).build()
  );

  if (mobilityType === InUseMobilityType.EMBEDDED) {
    standardProduct = productWithEmbeddedMobility(standardProduct, true, {
      sectorId: 'AERO',
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
    });
  } else if (mobilityType === InUseMobilityType.TRANSPORTED) {
    const platformModelPayload = transportedPlatformPayloadBuilder({
      sectorId: 'NAVAL',
      platformModelId: 'tpm-20',
      payload: 100,
      filteredPlatformModels: [],
    });

    const platformModelPayload2 = transportedPlatformPayloadBuilder({
      sectorId: 'RAIL',
      platformModelId: 'tpm-16',
      payload: 1000,
      filteredPlatformModels: [],
    });

    standardProduct = productWithPlatformModelPayload(
      standardProduct,
      true,
      platformModelPayload,
      platformModelPayload2
    );
  }

  return {
    ...standardProduct,
    totalHardwareMass: 12,
    recycling: {
      enabled: true,
      type: RecyclingType.TYPE_2,
    },
    inUsePowerConsumption: {
      enabled: true,
      lifetime: 175200,
      powerSource: 'e0e40dd9-f999-47e4-942f-9f9760ce7c89',
      powerConsumptionBreakdown: {
        shareTotal: 100,
        powerLevels: [],
        meanPower: 9.1,
      },
    },
  };
};

const givenAStandardProduct = (
  mobilityType: InUseMobilityType = InUseMobilityType.EMBEDDED
) => {
  const reducerMapObjects = {
    product: productReducer,
    evaluationVersions: evaluationVersionsReducer,
  };

  const standardProduct = aStandardProduct(mobilityType);

  return getPartialStoreWithStateWithReducerMapObjects(reducerMapObjects, {
    product: standardProduct,
  });
};

export {
  givenAnEmptyStore,
  aStandardProduct,
  newProduct,
  productWithElectronicComponent,
  productWithMaterial,
  productWithEmbeddedMobility,
  productWithLoadedEmbeddedPlatformModels,
  productWithPlatformModelPayload,
  productWithLoadedTransportedPlatformModels,
  productWithPowerLevel,
  givenANewProduct,
  givenAStandardProduct,
  productWithEnergyUsedAtTestLocation,
};
