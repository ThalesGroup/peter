/* eslint-disable no-param-reassign */
import {
  createListenerMiddleware,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  ElectricalComponentCoefficient,
  EmbeddedMobilityCoefficient,
  EnergyUsedAtTestLocationCoefficient,
  EvaluationImpact,
  EvaluationResult,
  EvaluationType,
  EvaluationVersion,
  EvaluationVersionId,
  EvaluationVersions,
  MaterialCoefficient,
  PowerSourceCoefficient,
  RecyclingCoefficient,
  TransportedMobilityCoefficient,
} from './entity/EvaluationVersions';
import { EvaluatedProduct } from './entity/EvaluatedProduct';
import { RecyclingType } from '../../../products/core/domain/entity/RecyclingType';
import { Category } from './entity/Category';
import { InUseMobilityType } from '../../../products/core/domain/entity/InUseMobilityType';
import { DefaultPowerSourceId } from '../../../products/core/domain/entity/PowerSource';
import { DefaultEmbeddedPlatformModelId } from '../../../products/core/domain/entity/PlatformModel';
import { loadEvaluationVersionList } from '../usecases/evaluation-version-list.query';
// TODO: Fix later
// eslint-disable-next-line import/no-cycle
import { selectEvaluationVersionList } from '../usecases/evaluation-version.selector';
import { RootStateWithDI } from '../../../shared/core/domain/store';

interface EvaluationComputationCommand {
  versionId: EvaluationVersionId;
  product: EvaluatedProduct;
}
const initialState: EvaluationVersions = {
  loading: 'idle',
  config: [],
  result: {
    values: [],
    error: '',
  },
};

export function categorizeImpacts(impacts: EvaluationImpact[]): Category {
  const isHardwareManufacturingImpact = (impact: EvaluationImpact): boolean => {
    return (
      impact.name === 'Hardware mechanics' ||
      impact.name === 'Hardware electronics'
    );
  };

  function computeCategory(
    topTwoHighestImpactNames: (string | undefined)[],
    highestImpact: EvaluationImpact
  ): Category {
    let category = Category.NONE;
    if (
      topTwoHighestImpactNames.includes('In-use power consumption') &&
      topTwoHighestImpactNames.includes('In-use mobility')
    ) {
      category = Category.EM;
    } else {
      if (highestImpact.name === 'HW Manufacturing') {
        category = Category.X;
      }

      if (highestImpact.name === 'In-use power consumption') {
        category = Category.E;
      }

      if (highestImpact.name === 'In-use mobility') {
        category = Category.M;
      }
    }
    return category;
  }

  const computeCategoryFrom = (computedImpacts: EvaluationImpact[]) => {
    let category = Category.NONE;
    const descendingImpacts = [...computedImpacts].sort((impactA, impactB) => {
      return impactB.total - impactA.total;
    });

    const highestImpact = descendingImpacts[0];

    if (highestImpact.total !== 0) {
      const topTwoHighestImpactNames = [
        highestImpact,
        descendingImpacts[1],
      ].map((impact) => impact?.name);
      category = computeCategory(topTwoHighestImpactNames, highestImpact);
    }

    return category;
  };

  const hardwareManufacturingImpactTotal = impacts
    .filter(isHardwareManufacturingImpact)
    .reduce((acc, impact) => {
      return acc + impact.total;
    }, 0);

  const impactsForCategorization = impacts.filter(
    (impact) => !isHardwareManufacturingImpact(impact)
  );
  impactsForCategorization.push({
    name: 'HW Manufacturing',
    total: hardwareManufacturingImpactTotal,
    details: [],
  });

  return computeCategoryFrom(impactsForCategorization);
}

function round(value: number, digit: number): number {
  return parseFloat(Number(value).toFixed(digit));
}

function buildImpactFromItem(item: {
  result: number;
  labelId: string;
  mass: number;
  coeff: number;
}) {
  return {
    labelId: item.labelId,
    factor: item.coeff,
    quantity: {
      value: item.mass,
      unit: 'kg',
    },
    impact: {
      value: item.result,
      unit: 'kg',
    },
  };
}
function computeMechanicalPartsImpact(
  product: EvaluatedProduct,
  materials: MaterialCoefficient[]
): EvaluationImpact {
  const items = product.materialMassesBreakdownOfMechanicalParts.value.map(
    (materialMass) => {
      const coeff = materials.filter(
        ({ materialId }) => materialId === materialMass.materialId
      )[0].value;
      return {
        coeff,
        labelId: materialMass.materialId,
        mass: materialMass.mass,
        result: round(coeff * materialMass.mass, 2),
      };
    }
  );
  return {
    name: 'Hardware mechanics',
    total: round(
      items.reduce((acc, item) => {
        return acc + item.result;
      }, 0),
      2
    ),
    details: items.map((item) => {
      return buildImpactFromItem(item);
    }),
  };
}

function computeElectronicComponentsImpact(
  product: EvaluatedProduct,
  electronicComponentCoefficients: ElectricalComponentCoefficient[]
): EvaluationImpact {
  const items = product.componentMassesBreakdownOfElectronics.value.map(
    (componentMass) => {
      const coeff = electronicComponentCoefficients.filter(
        ({ componentId }) => componentId === componentMass.componentId
      )[0].value;
      return {
        coeff,
        labelId: componentMass.componentId,
        mass: componentMass.mass,
        result: round(coeff * componentMass.mass, 2),
      };
    }
  );
  return {
    name: 'Hardware electronics',
    total: round(
      items.reduce((acc, item) => {
        return acc + item.result;
      }, 0),
      2
    ),
    details: items.map((item) => {
      return buildImpactFromItem(item);
    }),
  };
}

function computeEnergyUsedAtTestLocationsImpact(
  product: EvaluatedProduct,
  energyUsedAtTestLocationCoefficients: EnergyUsedAtTestLocationCoefficient[]
): EvaluationImpact {
  const items = product.energyUsedAtTestLocations.map(
    (energyUsedAtTestLocation) => {
      const coeff = energyUsedAtTestLocationCoefficients.filter(
        ({ testLocationId }) =>
          testLocationId === energyUsedAtTestLocation.testLocationId
      )[0].value;
      return {
        coeff,
        labelId: energyUsedAtTestLocation.testLocationId,
        energy: energyUsedAtTestLocation.energy,
        result: round(coeff * energyUsedAtTestLocation.energy, 2),
      };
    }
  );
  return {
    name: 'Tests & Qualification',
    total: round(
      items.reduce((acc, item) => {
        return acc + item.result;
      }, 0),
      2
    ),
    details: items.map((item) => {
      return {
        labelId: item.labelId,
        factor: item.coeff,
        quantity: {
          value: item.energy,
          unit: 'kW',
        },
        impact: {
          value: item.result,
          unit: 'kg',
        },
      };
    }),
  };
}

function computeEmbeddedMobilityInUseImpact(
  product: EvaluatedProduct,
  embeddedCoefficients: EmbeddedMobilityCoefficient[]
): EvaluationImpact {
  if (
    product.inUseMobility.embeddedPlatformModel.platformModelId !==
    DefaultEmbeddedPlatformModelId
  ) {
    const coeff = embeddedCoefficients.filter(
      ({ platformModelId }) =>
        platformModelId ===
        product.inUseMobility.embeddedPlatformModel?.platformModelId
    )[0].value;
    const total = round(
      (product.hardwareMass *
        coeff *
        product.inUseMobility.embeddedPlatformModel.usage) /
        product.inUseMobility.embeddedPlatformModel.defaultUsage,
      2
    );
    return {
      name: 'In-use mobility',
      total,
      details: [
        {
          labelId: product.inUseMobility.embeddedPlatformModel.platformModelId,
          factor: coeff,
          quantity: {
            value: product.inUseMobility.embeddedPlatformModel.usage,
            unit: '',
          },
          impact: {
            value: total,
            unit: 'kg',
          },
        },
      ],
    };
  }
  return {
    name: 'In-use mobility',
    total: 0,
    details: [],
  };
}

function computeTransportedMobilityInUseImpact(
  product: EvaluatedProduct,
  transportedCoefficients: TransportedMobilityCoefficient[]
): EvaluationImpact {
  const items = product.inUseMobility.transportedPlatformModels.map(
    (transportedPlatform) => {
      const coeff = transportedCoefficients.find(
        ({ platformModelId }) =>
          platformModelId === transportedPlatform.platformModelId
      )?.value;
      return {
        coeff,
        platformModelId: transportedPlatform.platformModelId,
        payload: transportedPlatform.payload,
        result: round(
          (coeff || 0) * transportedPlatform.payload * product.hardwareMass,
          2
        ),
      };
    }
  );
  const total = items.reduce((acc, item) => {
    const coeff = transportedCoefficients.find(
      ({ platformModelId }) => platformModelId === item.platformModelId
    )?.value;
    return acc + (coeff || 0) * item.payload * product.hardwareMass;
  }, 0);
  return {
    name: 'In-use mobility',
    total: round(total, 2),
    details: items.map((item) => {
      return {
        labelId: item.platformModelId,
        factor: item.coeff || 0,
        quantity: {
          value: item.payload,
          unit: '',
        },
        impact: {
          value: item.result,
          unit: 'kg',
        },
      };
    }),
  };
}

function computeRecyclingImpact(
  product: EvaluatedProduct,
  recycling: RecyclingCoefficient[]
): EvaluationImpact {
  const coeff = recycling.filter(
    ({ type }) => type === product.recyclingType.toString()
  )[0].value;
  const impact = round(product.hardwareMass * coeff, 2);
  return {
    name: 'Recycling',
    total: impact,
    details: [
      {
        labelId: product.recyclingType.toString(),
        factor: coeff,
        quantity: { value: 1, unit: '' },
        impact: {
          value: impact,
          unit: 'kg',
        },
      },
    ],
  };
}

function computePowerInUseImpact(
  product: EvaluatedProduct,
  powerSource: PowerSourceCoefficient[]
): EvaluationImpact {
  if (
    product.inUsePowerConsumption.powerSource === DefaultPowerSourceId ||
    product.inUsePowerConsumption.meanPower === 0 ||
    product.inUsePowerConsumption.lifetime === 0
  ) {
    return {
      name: 'In-use power consumption',
      total: 0,
      details: [],
    };
  }
  const coeff = powerSource.filter(
    ({ id }) => id === product.inUsePowerConsumption.powerSource
  )[0].value;
  return {
    name: 'In-use power consumption',
    total: round(
      (product.inUsePowerConsumption.lifetime / 1000) *
        product.inUsePowerConsumption.meanPower *
        coeff,
      2
    ),
    details: [
      {
        impact: {
          unit: '',
          value: 0,
        },
        labelId: 'In-use lifetime',
        quantity: {
          unit: 'h',
          value: product.inUsePowerConsumption.lifetime,
        },
      },
      {
        impact: {
          unit: '',
          value: 0,
        },
        labelId: 'Mean power',
        quantity: {
          unit: 'W',
          value: product.inUsePowerConsumption.meanPower,
        },
      },
      {
        impact: {
          unit: '',
          value: 0,
        },
        factor: coeff,
        labelId: product.inUsePowerConsumption.powerSource,
        quantity: {
          unit: '',
          value: 1,
        },
      },
    ],
  };
}

function computeEvaluationResult(
  product: EvaluatedProduct,
  type: EvaluationType
): EvaluationResult {
  const computedImpacts: EvaluationImpact[] = [];

  const hardwareMechanicalImpact = computeMechanicalPartsImpact(
    product,
    type.coefficients.hardware.materials
  );
  if (hardwareMechanicalImpact.total > 0) {
    computedImpacts.push(hardwareMechanicalImpact);
  }

  const electronicComponentImpact = computeElectronicComponentsImpact(
    product,
    type.coefficients.hardware.electricalComponents
  );
  if (electronicComponentImpact.total > 0) {
    computedImpacts.push(electronicComponentImpact);
  }

  const energyUsedAtTestLocationsImpact =
    computeEnergyUsedAtTestLocationsImpact(
      product,
      type.coefficients.hardware.energyUsedAtTestLocations
    );
  if (energyUsedAtTestLocationsImpact.total > 0) {
    computedImpacts.push(energyUsedAtTestLocationsImpact);
  }

  if (product.inUseMobility.type === InUseMobilityType.EMBEDDED) {
    const mobilityInUseImpact = computeEmbeddedMobilityInUseImpact(
      product,
      type.coefficients.mobility.embedded
    );

    if (mobilityInUseImpact.total > 0) {
      computedImpacts.push(mobilityInUseImpact);
    }
  } else if (product.inUseMobility.type === InUseMobilityType.TRANSPORTED) {
    const mobilityInUseImpact = computeTransportedMobilityInUseImpact(
      product,
      type.coefficients.mobility.transported
    );
    if (mobilityInUseImpact.total > 0) {
      computedImpacts.push(mobilityInUseImpact);
    }
  }

  const powerInUseImpact = computePowerInUseImpact(
    product,
    type.coefficients.powerSource
  );
  if (powerInUseImpact.total > 0) {
    computedImpacts.push(powerInUseImpact);
  }

  if (product.recyclingType !== RecyclingType.NONE) {
    const recyclingImpact = computeRecyclingImpact(
      product,
      type.coefficients.recycling
    );
    if (recyclingImpact.total > 0) {
      computedImpacts.push(recyclingImpact);
    }
  }

  const totalImpact = round(
    computedImpacts.reduce((acc, impact) => {
      return acc + impact.total;
    }, 0),
    2
  );

  const impactSpreads = new Map<string, number>();
  if (totalImpact !== 0) {
    computedImpacts.forEach((impact) => {
      impactSpreads.set(
        impact.name,
        round((impact.total / totalImpact) * 100, 1)
      );
    });
  }

  return {
    name: type.name,
    total: totalImpact,
    impacts: computedImpacts,
    impactsSpread: Object.fromEntries(impactSpreads),
    category: Category.NONE,
  };
}

export const evaluationVersionsSlice = createSlice({
  name: 'Evaluations',
  initialState,
  reducers: {
    evaluationForProductComputed: (
      state,
      action: PayloadAction<EvaluationComputationCommand>
    ) => {
      const providedVersion = action.payload.versionId;

      const foundVersion = state.config.filter(
        ({ version }) => version === providedVersion
      )[0];

      if (!foundVersion) {
        state.result.error = 'Version "0" doesn\'t exist';
      } else {
        state.result.error = '';
        const types = new Array<EvaluationResult>();
        foundVersion.types.forEach((type: EvaluationType) => {
          const result: EvaluationResult = computeEvaluationResult(
            action.payload.product,
            type
          );
          types.push(result);
        });
        state.result.values = types;
      }
    },
    categoryComputed: (state) => {
      state.result.values.forEach((result) => {
        result.category = categorizeImpacts(result.impacts);
      });
    },
    loadConfigDeprecated: (
      state,
      action: PayloadAction<EvaluationVersion[]>
    ) => {
      state.config = action.payload;
    },
  },
});
export const {
  evaluationForProductComputed,
  categoryComputed,
  loadConfigDeprecated,
} = evaluationVersionsSlice.actions;

export const evaluationVersionListenerMiddleware = createListenerMiddleware();

evaluationVersionListenerMiddleware.startListening({
  matcher: isAnyOf(evaluationForProductComputed),
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(categoryComputed());
  },
});

evaluationVersionListenerMiddleware.startListening({
  matcher: isAnyOf(loadEvaluationVersionList.fulfilled),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootStateWithDI;
    const evaluationVersions = selectEvaluationVersionList(state);
    listenerApi.dispatch(
      loadConfigDeprecated(evaluationVersions.state.evaluationVersions)
    );
  },
});

export default evaluationVersionsSlice.reducer;
