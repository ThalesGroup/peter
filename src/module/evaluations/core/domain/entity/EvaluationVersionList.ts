export interface MaterialCoefficientState {
  id: string;
  materialId: string;
  value: number;
}

export interface ElectricalComponentCoefficientState {
  id: string;
  componentId: string;
  value: number;
}

export interface EmbeddedMobilityCoefficientState {
  id: string;
  platformModelId: string;
  value: number;
}

export interface TransportedMobilityCoefficientState {
  id: string;
  platformModelId: string;
  value: number;
}

export interface RecyclingCoefficientState {
  type: string;
  value: number;
}

export interface PowerSourceCoefficientState {
  id: string;
  value: number;
}

export interface EnergyUsedAtTestLocationCoefficientState {
  testLocationId: string;
  value: number;
}

export interface EvaluationTypeState {
  name: string;
  coefficients: {
    hardware: {
      materials: MaterialCoefficientState[];
      electricalComponents: ElectricalComponentCoefficientState[];
      energyUsedAtTestLocations: EnergyUsedAtTestLocationCoefficientState[];
    };
    mobility: {
      embedded: EmbeddedMobilityCoefficientState[];
      transported: TransportedMobilityCoefficientState[];
    };
    powerSource: PowerSourceCoefficientState[];
    recycling: RecyclingCoefficientState[];
  };
}

export interface EvaluationVersionState {
  id: string;
  version: string;
  types: EvaluationTypeState[];
}

export class EvaluationVersionList {
  constructor(
    private readonly evaluationVersions: {
      id: string;
      version: string;
      types: EvaluationTypeState[];
    }[]
  ) {}

  get state() {
    return {
      evaluationVersions: this.evaluationVersions,
    };
  }
}
