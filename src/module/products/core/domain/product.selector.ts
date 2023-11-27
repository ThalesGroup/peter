import { RootStateWithDI } from '../../../shared/core/domain/store';

export const selectCurrentProduct = (state: RootStateWithDI) => state.product;
export const selectInUseMobilityType = (state: RootStateWithDI) =>
  state.product.inUseMobility.type;
export const selectTransportedPlatformModelSectors = (state: RootStateWithDI) =>
  [
    ...new Set(
      state.product.inUseMobility.transported.platformModels.map(
        (platform) => platform.sector
      )
    ),
  ].sort((sector1, sector2) => (sector1 >= sector2 ? 1 : 0));

export const selectTransportedPlatformModels = (state: RootStateWithDI) =>
  state.product.inUseMobility.transported.platformModels;

export const selectEmbeddedPlatformModels = (state: RootStateWithDI) =>
  state.product.inUseMobility.embedded.platformModels;

export const selectEmbeddedPlatformModelSectors = (state: RootStateWithDI) =>
  [
    ...new Set(
      state.product.inUseMobility.embedded.platformModels.map(
        (platform) => platform.sectorId
      )
    ),
  ].sort((sector1, sector2) => (sector1 >= sector2 ? 1 : 0));
