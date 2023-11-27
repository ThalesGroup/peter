/* eslint-disable no-param-reassign */
import {
  createAsyncThunk,
  createListenerMiddleware,
  createSlice,
  isAnyOf,
  ListenerEffectAPI,
  PayloadAction,
} from '@reduxjs/toolkit';
import { v4 as uuidV4 } from 'uuid';
import {
  EnergyUsedAtTestLocation,
  MassOfElectronicComponent,
  MassOfElectronicComponentId,
  PlatformModelPayload,
  PlatformModelPayloadId,
  ProductState,
  UsageOfEmbeddedPlatformModel,
} from './entity/Product';
import { DefaultMaterialId } from './entity/Material';
import { DefaultElectronicComponentId } from './entity/ElectronicalComponent';
import { InUseMobilityType } from './entity/InUseMobilityType';
import {
  DefaultEmbeddedPlatformModelId,
  DefaultSectorId,
  DefaultTransportedPlatformModelId,
  EmbeddedPlatformModel,
  EquipmentMobilityConfiguration,
  TransportedPlatformId,
  TransportedPlatformModel,
} from './entity/PlatformModel';
import InMemoryEquipmentMobilityConfigurationProvider from '../infrastructure/InMemoryEquipmentMobilityConfigurationProvider';
import { RecyclingType } from './entity/RecyclingType';
import { DefaultPowerSourceId, PowerSourceId } from './entity/PowerSource';
import { PowerLevel, PowerLevelId } from './entity/PowerLevel';
import { DefaultLocationId } from './entity/TestLocation';
import {
  MassOfMaterialId,
  MassOfMaterialState,
} from './entity/mass-of-material/MassOfMaterial';

export type FilterTransportedPlatformModelCommand = {
  sectorId: string;
  platformModelPayloadId: PlatformModelPayloadId;
};

export type ChoosePlatformModelPayloadCommand = {
  platformModelPayloadId: PlatformModelPayloadId;
  platformModelId: TransportedPlatformId;
};

export type OverridePlatformModelPayloadCommand = {
  platformModelPayloadId: PlatformModelPayloadId;
  payload: number;
};

export type UpdateElectricalPowerCommand = {
  lifetime: number;
  powerSource: PowerSourceId;
};

export const emptyMassOfElectronicComponent =
  (): MassOfElectronicComponent => ({
    id: uuidV4(),
    componentId: DefaultElectronicComponentId,
    mass: 0,
  });

export const emptyEnergyUsedAtTestLocation = (): EnergyUsedAtTestLocation => ({
  id: uuidV4(),
  testLocationId: DefaultLocationId,
  energy: 0,
});

export const emptyMassOfMaterial = (): MassOfMaterialState => ({
  id: uuidV4(),
  materialId: DefaultMaterialId,
  mass: 0,
});

export const usageOfEmbeddedPlatformModelBuilder =
  (usageOfEmbeddedPlatformModel: {
    sectorId: string;
    filteredPlatformModels: EmbeddedPlatformModel[];
    platformModelId: string;
    usage: number;
  }): UsageOfEmbeddedPlatformModel => ({
    ...usageOfEmbeddedPlatformModel,
  });

export const emptyUsageOfEmbeddedPlatformModel =
  (): UsageOfEmbeddedPlatformModel => ({
    sectorId: DefaultSectorId,
    filteredPlatformModels: [],
    platformModelId: DefaultEmbeddedPlatformModelId,
    usage: 0,
  });

export const transportedPlatformPayloadBuilder = (platformPayload: {
  sectorId: string;
  platformModelId: TransportedPlatformId;
  payload: number;
  filteredPlatformModels: TransportedPlatformModel[];
}): PlatformModelPayload => ({
  id: uuidV4(),
  ...platformPayload,
});

export const emptyTransportedPlatformPayload = (): PlatformModelPayload =>
  transportedPlatformPayloadBuilder({
    sectorId: DefaultSectorId,
    platformModelId: DefaultTransportedPlatformModelId,
    payload: 0,
    filteredPlatformModels: [],
  });

export const powerLevelBuilder = (powerLevel: {
  power: number;
  share: number;
}): PowerLevel => ({
  id: uuidV4(),
  ...powerLevel,
});

export const emptyPowerLevel = (): PowerLevel =>
  powerLevelBuilder({
    power: 0,
    share: 0,
  });

export const NEW_PRODUCT: ProductState = {
  id: uuidV4(),
  name: '',
  materialMassesBreakdownOfMechanicalParts: {
    value: [emptyMassOfMaterial()],
    total: 0,
  },
  componentMassesBreakdownOfElectronics: {
    value: [emptyMassOfElectronicComponent()],
    total: 0,
  },
  totalHardwareMass: 0,
  energyUsedAtTestLocations: {
    enabled: false,
    testLocations: [emptyEnergyUsedAtTestLocation()],
  },
  inUseMobility: {
    enabled: false,
    type: InUseMobilityType.NONE,
    embedded: {
      loading: 'idle',
      platformModels: [],
      usage: emptyUsageOfEmbeddedPlatformModel(),
    },
    transported: {
      loading: 'idle',
      platformModels: [],
      payloads: [],
    },
  },
  inUsePowerConsumption: {
    enabled: false,
    lifetime: 175200,
    powerSource: DefaultPowerSourceId,
    powerConsumptionBreakdown: {
      powerLevels: [],
      shareTotal: 0,
      meanPower: 0,
    },
  },
  recycling: {
    enabled: false,
    type: RecyclingType.NONE,
  },
};

const initialState = NEW_PRODUCT;

function computeMaterialMassTotal(materialMasses: MassOfMaterialState[]) {
  return materialMasses.reduce((acc, massOfMaterial) => {
    return massOfMaterial.materialId !== DefaultMaterialId
      ? acc + massOfMaterial.mass
      : acc;
  }, 0);
}

function computeElectronicComponentMassTotal(
  componentMasses: MassOfElectronicComponent[]
) {
  return componentMasses.reduce((acc, massOfComponent) => {
    return massOfComponent.componentId !== DefaultElectronicComponentId
      ? acc + massOfComponent.mass
      : acc;
  }, 0);
}

export const loadMobilityEquipmentConfiguration =
  createAsyncThunk<EquipmentMobilityConfiguration>(
    `Product/EquipmentMobility/load`,
    async () => {
      return InMemoryEquipmentMobilityConfigurationProvider.load();
    }
  );

export const productSlice = createSlice({
  name: 'Product',
  initialState,
  reducers: {
    addMassOfMaterial: (state) => {
      state.materialMassesBreakdownOfMechanicalParts.value.push(
        emptyMassOfMaterial()
      );
    },
    updateMassOfMaterial: (
      state,
      action: PayloadAction<MassOfMaterialState>
    ) => {
      const index =
        state.materialMassesBreakdownOfMechanicalParts.value.findIndex(
          ({ id }) => id === action.payload.id
        );

      state.materialMassesBreakdownOfMechanicalParts.value[index] = {
        ...state.materialMassesBreakdownOfMechanicalParts.value[index],
        ...action.payload,
      };
    },
    removeMassOfMaterial: (state, action: PayloadAction<MassOfMaterialId>) => {
      state.materialMassesBreakdownOfMechanicalParts.value =
        state.materialMassesBreakdownOfMechanicalParts.value.filter(
          ({ id }) => id !== action.payload
        );
    },
    computeMassOfMaterialTotal: (state) => {
      state.materialMassesBreakdownOfMechanicalParts.total =
        computeMaterialMassTotal(
          state.materialMassesBreakdownOfMechanicalParts.value
        );
    },
    addMassOfElectronicComponent: (state) => {
      state.componentMassesBreakdownOfElectronics.value.push(
        emptyMassOfElectronicComponent()
      );
    },
    updateMassOfElectronicComponent: (
      state,
      action: PayloadAction<MassOfElectronicComponent>
    ) => {
      const index = state.componentMassesBreakdownOfElectronics.value.findIndex(
        ({ id }) => id === action.payload.id
      );

      state.componentMassesBreakdownOfElectronics.value[index] = {
        ...state.componentMassesBreakdownOfElectronics.value[index],
        ...action.payload,
      };
    },
    removeMassOfElectronicComponent: (
      state,
      action: PayloadAction<MassOfElectronicComponentId>
    ) => {
      state.componentMassesBreakdownOfElectronics.value =
        state.componentMassesBreakdownOfElectronics.value.filter(
          ({ id }) => id !== action.payload
        );
    },
    computeMassOfElectronicComponentTotal: (state) => {
      state.componentMassesBreakdownOfElectronics.total =
        computeElectronicComponentMassTotal(
          state.componentMassesBreakdownOfElectronics.value
        );
    },
    computeTotalHardwareMass: (state) => {
      state.totalHardwareMass =
        state.componentMassesBreakdownOfElectronics.total +
        state.materialMassesBreakdownOfMechanicalParts.total;
    },
    inUseMobilityToggled: (state) => {
      state.inUseMobility.enabled = !state.inUseMobility.enabled;
      state.inUseMobility.type = InUseMobilityType.EMBEDDED;
    },
    inUseMobilityTypeUpdated: (
      state,
      action: PayloadAction<InUseMobilityType>
    ) => {
      state.inUseMobility.type = action.payload;
    },
    embeddedEquipmentMobilityUpdated: (
      state,
      action: PayloadAction<UsageOfEmbeddedPlatformModel>
    ) => {
      state.inUseMobility.embedded.usage = action.payload;
    },
    embeddedEquipmentMobilitySectorSelected: (
      state,
      action: PayloadAction<string>
    ) => {
      state.inUseMobility.embedded.usage = {
        ...emptyUsageOfEmbeddedPlatformModel(),
        sectorId: action.payload,
        filteredPlatformModels:
          state.inUseMobility.embedded.platformModels.filter(
            (platform) => platform.sectorId === action.payload
          ),
      };
    },
    embeddedEquipmentMobilityPlatformModelSelected: (
      state,
      action: PayloadAction<string>
    ) => {
      const platformModelUsage = state.inUseMobility.embedded.usage;

      const platformModel = platformModelUsage.filteredPlatformModels.filter(
        ({ id }) => id === action.payload
      )[0];

      if (platformModel) {
        state.inUseMobility.embedded.usage = {
          ...state.inUseMobility.embedded.usage,
          platformModelId: action.payload,
          usage: platformModel.defaultValue.value,
        };
      } else {
        state.inUseMobility.embedded.usage = {
          ...state.inUseMobility.embedded.usage,
          platformModelId: DefaultEmbeddedPlatformModelId,
          usage: 0,
        };
      }
    },
    embeddedEquipmentMobilityUsageOverridden: (
      state,
      action: PayloadAction<number>
    ) => {
      state.inUseMobility.embedded.usage = {
        ...state.inUseMobility.embedded.usage,
        usage: action.payload,
      };
    },
    transportedEquipmentPayloadAdded: (state) => {
      state.inUseMobility.transported.payloads.push(
        emptyTransportedPlatformPayload()
      );
    },
    platformModelPayloadSectorSelected: (
      state,
      action: PayloadAction<FilterTransportedPlatformModelCommand>
    ) => {
      const index = state.inUseMobility.transported.payloads.findIndex(
        ({ id }) => id === action.payload.platformModelPayloadId
      );

      state.inUseMobility.transported.payloads[index] = {
        ...emptyTransportedPlatformPayload(),
        sectorId: action.payload.sectorId,
        filteredPlatformModels:
          state.inUseMobility.transported.platformModels.filter(
            (platform) => platform.sector === action.payload.sectorId
          ),
      };
    },
    platformModelForPayloadSelected: (
      state,
      action: PayloadAction<ChoosePlatformModelPayloadCommand>
    ) => {
      const index = state.inUseMobility.transported.payloads.findIndex(
        ({ id }) => id === action.payload.platformModelPayloadId
      );

      const platformModelPayload =
        state.inUseMobility.transported.payloads[index];

      const platformModel = platformModelPayload.filteredPlatformModels.filter(
        ({ id }) => id === action.payload.platformModelId
      )[0];

      if (platformModel) {
        state.inUseMobility.transported.payloads[index] = {
          ...state.inUseMobility.transported.payloads[index],
          platformModelId: action.payload.platformModelId,
          payload: platformModel.defaultValue.value,
        };
      } else {
        state.inUseMobility.transported.payloads[index] = {
          ...state.inUseMobility.transported.payloads[index],
          platformModelId: DefaultTransportedPlatformModelId,
          payload: 0,
        };
      }
    },
    platformModelPayloadOverridden: (
      state,
      action: PayloadAction<OverridePlatformModelPayloadCommand>
    ) => {
      const index = state.inUseMobility.transported.payloads.findIndex(
        ({ id }) => id === action.payload.platformModelPayloadId
      );

      state.inUseMobility.transported.payloads[index] = {
        ...state.inUseMobility.transported.payloads[index],
        payload: action.payload.payload,
      };
    },
    platformModelPayloadRemoved: (
      state,
      action: PayloadAction<PlatformModelPayloadId>
    ) => {
      state.inUseMobility.transported.payloads =
        state.inUseMobility.transported.payloads.filter(
          ({ id }) => id !== action.payload
        );
    },
    recyclingToggled: (state) => {
      const recyclingEnabled = state.recycling.enabled;
      state.recycling.enabled = !state.recycling.enabled;
      if (!recyclingEnabled && state.recycling.type === RecyclingType.NONE) {
        state.recycling.type = RecyclingType.TYPE_1;
      }
    },
    recyclingTypeUpdated: (state, action: PayloadAction<RecyclingType>) => {
      state.recycling.type = action.payload;
    },
    inUsePowerConsumptionToggled: (state) => {
      state.inUsePowerConsumption.enabled =
        !state.inUsePowerConsumption.enabled;
    },
    inUsePowerConsumptionUpdated: (
      state,
      action: PayloadAction<UpdateElectricalPowerCommand>
    ) => {
      state.inUsePowerConsumption.lifetime = action.payload.lifetime;
      state.inUsePowerConsumption.powerSource = action.payload.powerSource;
    },
    powerLevelAdded: (state) => {
      state.inUsePowerConsumption.powerConsumptionBreakdown.powerLevels.push(
        emptyPowerLevel()
      );
    },
    powerLevelUpdated: (state, action: PayloadAction<PowerLevel>) => {
      const index =
        state.inUsePowerConsumption.powerConsumptionBreakdown.powerLevels.findIndex(
          ({ id }) => id === action.payload.id
        );

      state.inUsePowerConsumption.powerConsumptionBreakdown.powerLevels[index] =
        action.payload;
    },
    powerLevelRemoved: (state, action: PayloadAction<PowerLevelId>) => {
      state.inUsePowerConsumption.powerConsumptionBreakdown.powerLevels =
        state.inUsePowerConsumption.powerConsumptionBreakdown.powerLevels.filter(
          ({ id }) => id !== action.payload
        );
    },
    powerLevelShareTotalComputed: (state) => {
      state.inUsePowerConsumption.powerConsumptionBreakdown.shareTotal =
        state.inUsePowerConsumption.powerConsumptionBreakdown.powerLevels.reduce(
          (acc, powerLevel) => {
            return acc + powerLevel.share;
          },
          0
        );
    },
    powerLevelMeanPowerComputed: (state) => {
      const totalPower =
        state.inUsePowerConsumption.powerConsumptionBreakdown.powerLevels.reduce(
          (acc, powerLevel) => {
            return acc + powerLevel.power * powerLevel.share;
          },
          0
        );
      state.inUsePowerConsumption.powerConsumptionBreakdown.meanPower =
        totalPower /
        state.inUsePowerConsumption.powerConsumptionBreakdown.shareTotal;
    },
    testsAndQualificationsToggled: (state) => {
      state.energyUsedAtTestLocations.enabled =
        !state.energyUsedAtTestLocations.enabled;
    },
    energyUsedAtTestLocationAdded: (state) => {
      state.energyUsedAtTestLocations.testLocations.push(
        emptyEnergyUsedAtTestLocation()
      );
    },
    energyUsedAtTestLocationUpdated: (
      state,
      action: PayloadAction<EnergyUsedAtTestLocation>
    ) => {
      const index = state.energyUsedAtTestLocations.testLocations.findIndex(
        ({ id }) => id === action.payload.id
      );

      state.energyUsedAtTestLocations.testLocations[index] = {
        ...state.energyUsedAtTestLocations.testLocations[index],
        ...action.payload,
      };
    },
    energyUsedAtTestLocationRemoved: (
      state,
      action: PayloadAction<MassOfMaterialId>
    ) => {
      state.energyUsedAtTestLocations.testLocations =
        state.energyUsedAtTestLocations.testLocations.filter(
          ({ id }) => id !== action.payload
        );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadMobilityEquipmentConfiguration.pending, (state) => {
        state.inUseMobility.transported.loading = 'pending';
        state.inUseMobility.embedded.loading = 'pending';
      })
      .addCase(
        loadMobilityEquipmentConfiguration.fulfilled,
        (state, action) => {
          state.inUseMobility.transported.loading = 'idle';
          state.inUseMobility.embedded.loading = 'idle';
          state.inUseMobility.transported.platformModels =
            action.payload.transportedPlatformModels;
          state.inUseMobility.embedded.platformModels =
            action.payload.embeddedPlatformModels;
        }
      )
      .addCase(loadMobilityEquipmentConfiguration.rejected, (state) => {
        state.inUseMobility.transported.loading = 'failed';
        state.inUseMobility.embedded.loading = 'failed';
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  addMassOfMaterial,
  updateMassOfMaterial,
  removeMassOfMaterial,
  computeMassOfMaterialTotal,
  addMassOfElectronicComponent,
  updateMassOfElectronicComponent,
  removeMassOfElectronicComponent,
  computeMassOfElectronicComponentTotal,
  computeTotalHardwareMass,
  inUseMobilityTypeUpdated,
  embeddedEquipmentMobilityUpdated,
  embeddedEquipmentMobilitySectorSelected,
  embeddedEquipmentMobilityPlatformModelSelected,
  embeddedEquipmentMobilityUsageOverridden,
  transportedEquipmentPayloadAdded,
  platformModelPayloadSectorSelected,
  platformModelForPayloadSelected,
  platformModelPayloadOverridden,
  platformModelPayloadRemoved,
  recyclingTypeUpdated,
  inUsePowerConsumptionUpdated,
  powerLevelAdded,
  powerLevelRemoved,
  powerLevelUpdated,
  powerLevelShareTotalComputed,
  powerLevelMeanPowerComputed,
  energyUsedAtTestLocationAdded,
  energyUsedAtTestLocationUpdated,
  energyUsedAtTestLocationRemoved,
  recyclingToggled,
  testsAndQualificationsToggled,
  inUseMobilityToggled,
  inUsePowerConsumptionToggled,
} = productSlice.actions;

export const productListenerMiddleware = createListenerMiddleware();

productListenerMiddleware.startListening({
  matcher: isAnyOf(updateMassOfMaterial, removeMassOfMaterial),
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(computeMassOfMaterialTotal());
  },
});

productListenerMiddleware.startListening({
  matcher: isAnyOf(
    updateMassOfElectronicComponent,
    removeMassOfElectronicComponent
  ),
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(computeMassOfElectronicComponentTotal());
  },
});

productListenerMiddleware.startListening({
  matcher: isAnyOf(
    computeMassOfMaterialTotal,
    computeMassOfElectronicComponentTotal
  ),
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(computeTotalHardwareMass());
  },
});

productListenerMiddleware.startListening({
  matcher: isAnyOf(inUsePowerConsumptionToggled),
  effect: async (action, listenerApi: ListenerEffectAPI<any, any>) => {
    const powerConsumption =
      listenerApi.getState().product.inUsePowerConsumption;

    if (
      powerConsumption.enabled &&
      powerConsumption.powerConsumptionBreakdown.powerLevels.length === 0
    ) {
      listenerApi.dispatch(powerLevelAdded());
    }
  },
});

productListenerMiddleware.startListening({
  matcher: isAnyOf(powerLevelUpdated, powerLevelRemoved),
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(powerLevelShareTotalComputed());
  },
});

productListenerMiddleware.startListening({
  matcher: isAnyOf(powerLevelShareTotalComputed),
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(powerLevelMeanPowerComputed());
  },
});

productListenerMiddleware.startListening({
  matcher: isAnyOf(inUseMobilityTypeUpdated),
  effect: async (action, listenerApi: ListenerEffectAPI<any, any>) => {
    const onBoardedState =
      listenerApi.getState().product.inUseMobility.transported;

    if (onBoardedState.payloads.length < 1) {
      listenerApi.dispatch(transportedEquipmentPayloadAdded());
    }
  },
});
export default productSlice.reducer;
