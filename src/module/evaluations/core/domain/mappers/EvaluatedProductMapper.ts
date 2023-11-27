import {
  EnergyUsedAtTestLocation,
  EvaluatedProduct,
  PayloadOfTransportedPlatformModel,
} from '../entity/EvaluatedProduct';
import { ProductState } from '../../../../products/core/domain/entity/Product';
import { DefaultMaterialId } from '../../../../products/core/domain/entity/Material';
import { DefaultElectronicComponentId } from '../../../../products/core/domain/entity/ElectronicalComponent';
import { InUseMobilityType } from '../../../../products/core/domain/entity/InUseMobilityType';
import {
  DefaultEmbeddedPlatformModelId,
  DefaultTransportedPlatformModelId,
} from '../../../../products/core/domain/entity/PlatformModel';
import { DefaultLocationId } from '../../../../products/core/domain/entity/TestLocation';
import { RecyclingType } from '../../../../products/core/domain/entity/RecyclingType';
import { DefaultPowerSourceId } from '../../../../products/core/domain/entity/PowerSource';

function findEmbeddedPlatformModelDefaultValueOrZero(product: ProductState) {
  const embeddedPlatformModel =
    product.inUseMobility.embedded.usage.filteredPlatformModels.find(
      (platform) =>
        platform.id === product.inUseMobility.embedded.usage.platformModelId
    );

  let defaultPlatformModelUsage = 0;
  if (embeddedPlatformModel) {
    defaultPlatformModelUsage = embeddedPlatformModel.defaultValue.value;
  }
  return defaultPlatformModelUsage;
}
export const mapFromProduct = (product: ProductState): EvaluatedProduct => {
  const mappedInUseMobility = {
    type: InUseMobilityType.NONE,
    embeddedPlatformModel: {
      platformModelId: DefaultEmbeddedPlatformModelId,
      usage: 0,
      defaultUsage: 0,
    },
    transportedPlatformModels: new Array<PayloadOfTransportedPlatformModel>(),
  };

  let energyUsedAtTestLocations: EnergyUsedAtTestLocation[] = [];
  if (product.energyUsedAtTestLocations.enabled) {
    energyUsedAtTestLocations = product.energyUsedAtTestLocations.testLocations
      .filter(
        (energyUsed) =>
          energyUsed.testLocationId !== DefaultLocationId &&
          energyUsed.energy > 0
      )
      .map((validatedEnergyUsed) => {
        return {
          testLocationId: validatedEnergyUsed.testLocationId,
          energy: validatedEnergyUsed.energy,
        };
      });
  }

  if (product.inUseMobility.enabled) {
    mappedInUseMobility.type = product.inUseMobility.type;
    if (product.inUseMobility.type === InUseMobilityType.EMBEDDED) {
      const defaultPlatformModelUsage =
        findEmbeddedPlatformModelDefaultValueOrZero(product);

      mappedInUseMobility.embeddedPlatformModel = {
        platformModelId: product.inUseMobility.embedded.usage.platformModelId,
        usage: product.inUseMobility.embedded.usage.usage,
        defaultUsage: defaultPlatformModelUsage,
      };
    } else if (product.inUseMobility.type === InUseMobilityType.TRANSPORTED) {
      mappedInUseMobility.transportedPlatformModels =
        product.inUseMobility.transported.payloads
          .filter(
            (payload) =>
              payload.platformModelId !== DefaultTransportedPlatformModelId &&
              payload.payload > 0
          )
          .map((payload) => {
            return {
              platformModelId: payload.platformModelId,
              payload: payload.payload,
            };
          });
    }
  }

  let mappedInUsePowerConsumption = {
    lifetime: 0,
    powerSource: DefaultPowerSourceId,
    meanPower: 0,
  };
  if (product.inUsePowerConsumption.enabled) {
    mappedInUsePowerConsumption = {
      lifetime: product.inUsePowerConsumption.lifetime,
      powerSource: product.inUsePowerConsumption.powerSource,
      meanPower:
        product.inUsePowerConsumption.powerConsumptionBreakdown.meanPower,
    };
  }

  return {
    name: product.name,
    hardwareMass: product.totalHardwareMass,
    materialMassesBreakdownOfMechanicalParts: {
      value: product.materialMassesBreakdownOfMechanicalParts.value
        .filter(
          (materialMass) =>
            materialMass.materialId !== DefaultMaterialId &&
            materialMass.mass > 0
        )
        .map((validatedMaterialMass) => {
          return {
            materialId: validatedMaterialMass.materialId,
            mass: validatedMaterialMass.mass,
          };
        }),
      total: product.materialMassesBreakdownOfMechanicalParts.total,
    },
    componentMassesBreakdownOfElectronics: {
      value: product.componentMassesBreakdownOfElectronics.value
        .filter(
          (componentMass) =>
            componentMass.componentId !== DefaultElectronicComponentId &&
            componentMass.mass > 0
        )
        .map((validatedComponentMass) => {
          return {
            componentId: validatedComponentMass.componentId,
            mass: validatedComponentMass.mass,
          };
        }),
      total: product.componentMassesBreakdownOfElectronics.total,
    },
    energyUsedAtTestLocations,
    inUseMobility: mappedInUseMobility,
    inUsePowerConsumption: mappedInUsePowerConsumption,
    recyclingType: product.recycling.enabled
      ? product.recycling.type
      : RecyclingType.NONE,
  };
};
