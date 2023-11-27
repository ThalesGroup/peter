import { ElectronicComponentId } from './ElectronicalComponent';
import { InUseMobilityType } from './InUseMobilityType';
import {
  EmbeddedPlatformId,
  EmbeddedPlatformModel,
  TransportedPlatformId,
  TransportedPlatformModel,
} from './PlatformModel';
import { RecyclingType } from './RecyclingType';
import { PowerSourceId } from './PowerSource';
import { PowerLevel } from './PowerLevel';
import { TestLocationId } from './TestLocation';
import { MassOfMaterialState } from './mass-of-material/MassOfMaterial';

export type MassOfElectronicComponentId = string;
export type EnergyUsedAtTestLocationId = string;
export type PlatformModelPayloadId = string;

export interface MassOfElectronicComponent {
  id: MassOfElectronicComponentId;
  componentId: ElectronicComponentId;
  mass: number;
}

export interface EnergyUsedAtTestLocation {
  id: EnergyUsedAtTestLocationId;
  testLocationId: TestLocationId;
  energy: number;
}

export interface UsageOfEmbeddedPlatformModel {
  sectorId: string;
  filteredPlatformModels: EmbeddedPlatformModel[];
  platformModelId: EmbeddedPlatformId;
  usage: number;
}

export interface PlatformModelPayload {
  id: string;
  filteredPlatformModels: TransportedPlatformModel[];
  sectorId: string;
  platformModelId: TransportedPlatformId;
  payload: number;
}

export interface ProductState {
  id: string;
  name: string;
  totalHardwareMass: number;
  materialMassesBreakdownOfMechanicalParts: {
    value: MassOfMaterialState[];
    total: number;
  };
  componentMassesBreakdownOfElectronics: {
    value: MassOfElectronicComponent[];
    total: number;
  };
  energyUsedAtTestLocations: {
    enabled: boolean;
    testLocations: EnergyUsedAtTestLocation[];
  };
  inUseMobility: {
    enabled: boolean;
    type: InUseMobilityType;
    embedded: {
      loading: 'idle' | 'pending' | 'failed';
      platformModels: EmbeddedPlatformModel[];
      usage: UsageOfEmbeddedPlatformModel;
    };
    transported: {
      loading: 'idle' | 'pending' | 'failed';
      platformModels: TransportedPlatformModel[];
      payloads: PlatformModelPayload[];
    };
  };
  inUsePowerConsumption: {
    enabled: boolean;
    lifetime: number;
    powerSource: PowerSourceId;
    powerConsumptionBreakdown: {
      powerLevels: PowerLevel[];
      shareTotal: number;
      meanPower: number;
    };
  };
  recycling: {
    enabled: boolean;
    type: RecyclingType;
  };
}
