import { MaterialId } from '../../../../products/core/domain/entity/Material';
import { ElectronicComponentId } from '../../../../products/core/domain/entity/ElectronicalComponent';
import { InUseMobilityType } from '../../../../products/core/domain/entity/InUseMobilityType';
import {
  EmbeddedPlatformId,
  TransportedPlatformId,
} from '../../../../products/core/domain/entity/PlatformModel';
import { RecyclingType } from '../../../../products/core/domain/entity/RecyclingType';
import { PowerSourceId } from '../../../../products/core/domain/entity/PowerSource';
import { TestLocationId } from '../../../../products/core/domain/entity/TestLocation';

export interface MassOfMaterial {
  materialId: MaterialId;
  mass: number;
}

export interface MassOfElectronicComponent {
  componentId: ElectronicComponentId;
  mass: number;
}

export interface UsageOfEmbeddedPlatformModel {
  platformModelId: EmbeddedPlatformId;
  usage: number;

  defaultUsage: number;
}

export interface PayloadOfTransportedPlatformModel {
  platformModelId: TransportedPlatformId;
  payload: number;
}

export interface EnergyUsedAtTestLocation {
  testLocationId: TestLocationId;
  energy: number;
}

export interface EvaluatedProduct {
  name: string;
  hardwareMass: number;
  materialMassesBreakdownOfMechanicalParts: {
    value: MassOfMaterial[];
    total: number;
  };
  componentMassesBreakdownOfElectronics: {
    value: MassOfElectronicComponent[];
    total: number;
  };
  energyUsedAtTestLocations: EnergyUsedAtTestLocation[];
  inUseMobility: {
    type: InUseMobilityType;
    embeddedPlatformModel: UsageOfEmbeddedPlatformModel;
    transportedPlatformModels: PayloadOfTransportedPlatformModel[];
  };
  inUsePowerConsumption: {
    lifetime: number;
    powerSource: PowerSourceId;
    meanPower: number;
  };
  recyclingType: RecyclingType;
}
