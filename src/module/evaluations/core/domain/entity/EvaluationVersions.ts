import { Category } from './Category';

export type EvaluationVersionId = string;

export interface MaterialCoefficient {
  id: string;
  materialId: string;
  value: number;
}

export interface ElectricalComponentCoefficient {
  id: string;
  componentId: string;
  value: number;
}

export interface EmbeddedMobilityCoefficient {
  id: string;
  platformModelId: string;
  value: number;
}

export interface TransportedMobilityCoefficient {
  id: string;
  platformModelId: string;
  value: number;
}

export interface RecyclingCoefficient {
  type: string;
  value: number;
}

export interface PowerSourceCoefficient {
  id: string;
  value: number;
}

export interface EnergyUsedAtTestLocationCoefficient {
  testLocationId: string;
  value: number;
}

export interface EvaluationType {
  name: string;
  coefficients: {
    hardware: {
      materials: MaterialCoefficient[];
      electricalComponents: ElectricalComponentCoefficient[];
      energyUsedAtTestLocations: EnergyUsedAtTestLocationCoefficient[];
    };
    mobility: {
      embedded: EmbeddedMobilityCoefficient[];
      transported: TransportedMobilityCoefficient[];
    };
    powerSource: PowerSourceCoefficient[];
    recycling: RecyclingCoefficient[];
  };
}

export interface EvaluationVersion {
  id: EvaluationVersionId;
  version: string;
  types: EvaluationType[];
}

export interface MechanicalPartsResultItem {
  coeff: number;
  mass: number;
  result: number;
}

export interface EvaluationImpactDetails {
  labelId: string;
  factor?: number;
  quantity: {
    value: number;
    unit: string;
  };
  impact: {
    value: number;
    unit: string;
  };
}

export interface EvaluationImpact {
  name: string;
  total: number;
  details: EvaluationImpactDetails[];
}

export interface EvaluationResult {
  name: string;
  total: number;
  impacts: EvaluationImpact[];
  impactsSpread: { [k: string]: number };
  category: Category;
}

export interface EvaluationVersions {
  loading: 'idle' | 'pending' | 'failed';
  config: EvaluationVersion[];
  result: {
    values: EvaluationResult[];
    error: string;
  };
}
